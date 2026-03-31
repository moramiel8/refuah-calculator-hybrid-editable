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
    const fromEmail = Deno.env.get("CONTACT_FROM_EMAIL") || Deno.env.get("TRANSACTIONAL_FROM_EMAIL");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey || !resendApiKey || !fromEmail) {
      return new Response(JSON.stringify({ error: "Missing server configuration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { userId, redirectTo } = await req.json();

    if (!userId || typeof userId !== "string") {
      return new Response(JSON.stringify({ error: "Missing target user id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!redirectTo || typeof redirectTo !== "string") {
      return new Response(JSON.stringify({ error: "Missing redirect url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();

    const {
      data: { user: actor },
      error: actorError,
    } = await adminClient.auth.getUser(accessToken);

    if (actorError || !actor) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: actorProfile, error: actorProfileError } = await adminClient
      .from("profiles")
      .select("user_id, is_admin, role, primary_role, first_name, last_name")
      .eq("user_id", actor.id)
      .maybeSingle();

    if (actorProfileError || !actorProfile) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const actorPrimaryRole = actorProfile.primary_role || actorProfile.role || "user";
    const canResetPasswords = actorProfile.is_admin || actorPrimaryRole === "owner" || actorPrimaryRole === "admin";

    if (!canResetPasswords) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: targetProfile, error: targetProfileError } = await adminClient
      .from("profiles")
      .select("user_id, email, first_name, last_name")
      .eq("user_id", userId)
      .maybeSingle();

    if (targetProfileError || !targetProfile) {
      return new Response(JSON.stringify({ error: "Target user profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: targetAuthUserData, error: targetAuthUserError } = await adminClient.auth.admin.getUserById(userId);

    if (targetAuthUserError || !targetAuthUserData.user?.email) {
      return new Response(JSON.stringify({ error: "Target user auth email not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const targetAuthEmail = targetAuthUserData.user.email;

    const { data: recoveryData, error: recoveryError } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email: targetAuthEmail,
      options: {
        redirectTo,
      },
    });

    if (recoveryError || !recoveryData.properties?.action_link) {
      console.error("admin-password-reset recovery link failed", recoveryError);
      return new Response(JSON.stringify({ error: "Failed to generate recovery link" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const targetName =
      [targetProfile.first_name, targetProfile.last_name].filter(Boolean).join(" ").trim() || targetProfile.email;
    const actorName =
      [actorProfile.first_name, actorProfile.last_name].filter(Boolean).join(" ").trim() || actor.email || "מנהל/ת";

    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
        <div style="max-width: 620px; margin: 0 auto; background: white; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0;">
          <h1 style="margin: 0 0 16px; color: #0f172a; font-size: 24px;">איפוס סיסמה</h1>
          <p style="margin: 0 0 12px; color: #475569;">שלום ${escapeHtml(targetName)},</p>
          <p style="margin: 0 0 16px; color: #475569;">${escapeHtml(actorName)} ביקש/ה לעזור לך לאפס את הסיסמה לחשבון שלך.</p>
          <p style="margin: 0 0 20px; color: #475569;">לחץ/י על הכפתור הבא כדי לבחור סיסמה חדשה:</p>
          <a href="${recoveryData.properties.action_link}" style="display:inline-block;background:#3b82f6;color:white;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:700;">איפוס סיסמה</a>
          <p style="margin: 20px 0 0; color: #64748b; font-size: 14px;">אם לא ביקשת לבצע איפוס, אפשר להתעלם מהמייל הזה.</p>
        </div>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [targetAuthEmail],
        subject: "איפוס סיסמה לחשבון שלך",
        html,
        text: `שלום ${targetName},\n\n${actorName} ביקש/ה לעזור לך לאפס את הסיסמה.\n\nאיפוס סיסמה: ${recoveryData.properties.action_link}\n\nאם לא ביקשת לבצע איפוס, אפשר להתעלם מהמייל הזה.`,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("admin-password-reset resend failed", errorText);
      return new Response(JSON.stringify({ error: "Failed to send reset email" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("admin-password-reset failed", error);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
