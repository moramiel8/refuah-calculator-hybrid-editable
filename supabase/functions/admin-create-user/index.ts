import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function normalizeUsername(input: string) {
  return input.trim().replace(/\s+/g, "").toLowerCase();
}

function buildAuthEmail(input: string) {
  const trimmed = input.trim().toLowerCase();
  if (EMAIL_RE.test(trimmed)) {
    return { authEmail: trimmed, emailWasNormalized: false };
  }

  const slug =
    trimmed
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/_+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 32) || `user-${crypto.randomUUID().slice(0, 8)}`;

  return {
    authEmail: `${slug}-${Date.now()}@placeholder.refuah.invalid`,
    emailWasNormalized: true,
  };
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
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: "Missing server configuration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      firstName = "",
      lastName = "",
      username,
      email,
      password,
      isStudent = false,
      primaryRole = "user",
    } = await req.json();

    if (!username || typeof username !== "string") {
      return new Response(JSON.stringify({ error: "Missing username" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authorization,
        },
      },
    });

    const {
      data: { user: actor },
      error: actorError,
    } = await authClient.auth.getUser();

    if (actorError || !actor) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: actorProfile, error: actorProfileError } = await adminClient
      .from("profiles")
      .select("user_id, role, primary_role")
      .eq("user_id", actor.id)
      .maybeSingle();

    const actorRole = actorProfile?.primary_role || actorProfile?.role || "user";

    if (actorProfileError || actorRole !== "owner") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanUsername = normalizeUsername(username);
    const rawEmail = email.trim();
    const { authEmail, emailWasNormalized } = buildAuthEmail(rawEmail);

    const { data: existingUsername, error: existingUsernameError } = await adminClient
      .from("profiles")
      .select("user_id")
      .ilike("username", cleanUsername)
      .limit(1);

    if (existingUsernameError) {
      throw existingUsernameError;
    }

    if (existingUsername && existingUsername.length > 0) {
      return new Response(JSON.stringify({ error: "Username already exists" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existingEmail, error: existingEmailError } = await adminClient
      .from("profiles")
      .select("user_id")
      .eq("email", rawEmail)
      .limit(1);

    if (existingEmailError) {
      throw existingEmailError;
    }

    if (existingEmail && existingEmail.length > 0) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resolvedRole = primaryRole === "owner" || primaryRole === "admin" || primaryRole === "moderator" || primaryRole === "editor"
      ? primaryRole
      : "user";
    const isAdmin = resolvedRole === "owner" || resolvedRole === "admin";

    const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
      email: authEmail,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: String(firstName || "").trim(),
        last_name: String(lastName || "").trim(),
      },
    });

    if (createError || !createdUser.user) {
      return new Response(JSON.stringify({ error: createError?.message || "Failed to create user" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert(
        {
          user_id: createdUser.user.id,
          first_name: String(firstName || "").trim(),
          last_name: String(lastName || "").trim(),
          username: cleanUsername,
          email: rawEmail,
          is_student: !!isStudent,
          primary_role: resolvedRole,
          role: resolvedRole,
          is_admin: isAdmin,
        } as never,
        { onConflict: "user_id" },
      );

    if (profileError) {
      await adminClient.auth.admin.deleteUser(createdUser.user.id);
      return new Response(JSON.stringify({ error: profileError.message || "Failed to update profile" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId: createdUser.user.id,
        loginEmail: authEmail,
        profileEmail: rawEmail,
        emailWasNormalized,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("admin-create-user failed", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
