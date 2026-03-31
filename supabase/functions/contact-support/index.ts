import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildHtmlEmail({
  senderName,
  senderEmail,
  subject,
  message,
}: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}) {
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
      <div style="max-width: 620px; margin: 0 auto; background: white; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0;">
        <h1 style="margin: 0 0 16px; color: #0f172a; font-size: 24px;">הודעה חדשה מטופס יצירת קשר</h1>
        <p style="margin: 0 0 8px; color: #475569;"><strong>שולח/ת:</strong> ${escapeHtml(senderName)}</p>
        <p style="margin: 0 0 8px; color: #475569;"><strong>אימייל:</strong> ${escapeHtml(senderEmail)}</p>
        <p style="margin: 0 0 20px; color: #475569;"><strong>נושא:</strong> ${escapeHtml(subject)}</p>
        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; color: #0f172a; line-height: 1.7;">
          ${safeMessage}
        </div>
      </div>
    </div>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supportEmail = Deno.env.get("CONTACT_SUPPORT_EMAIL") || "support@refuah.io";
    const fromEmail = Deno.env.get("CONTACT_FROM_EMAIL");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey || !resendApiKey || !fromEmail) {
      return new Response(JSON.stringify({ error: "Missing server email configuration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subject, message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();

    const {
      data: { user },
      error: authError,
    } = await adminClient.auth.getUser(accessToken);

    if (authError || !user) {
      console.error("contact-support unauthorized", authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await adminClient
      .from("profiles")
      .select("first_name, last_name, email")
      .eq("user_id", user.id)
      .maybeSingle();

    const senderName =
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      "משתמש/ת";
    const senderEmail = profile?.email || user.email;

    if (!senderEmail) {
      return new Response(JSON.stringify({ error: "Missing sender email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeSubject =
      typeof subject === "string" && subject.trim() ? subject.trim() : "פנייה חדשה מהאתר";
    const trimmedMessage = message.trim();

    const insertContactMessageLog = async ({
      status,
      resendMessageId,
    }: {
      status: "sent" | "failed";
      resendMessageId?: string | null;
    }) => {
      const { error: logError } = await adminClient.from("contact_messages").insert({
        sender_user_id: user.id,
        sender_email: senderEmail,
        subject: safeSubject,
        message: trimmedMessage,
        resend_message_id: resendMessageId ?? null,
        status,
      });

      if (logError) {
        console.error("Failed to insert contact_messages log", logError);
      }
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [supportEmail],
        reply_to: senderEmail,
        subject: `[Contact] ${safeSubject}`,
        html: buildHtmlEmail({
          senderName,
          senderEmail,
          subject: safeSubject,
          message: trimmedMessage,
        }),
        text: `שולח/ת: ${senderName}\nאימייל: ${senderEmail}\nנושא: ${safeSubject}\n\n${trimmedMessage}`,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend contact email failed", errorText);
      await insertContactMessageLog({ status: "failed" });
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendData = await resendResponse.json();
    await insertContactMessageLog({ status: "sent", resendMessageId: resendData.id });

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("contact-support failed", error);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
