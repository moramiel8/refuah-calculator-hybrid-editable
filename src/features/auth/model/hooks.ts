import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "./store";
import type { AuthUser } from "./store";
import { resolveBadges, resolvePrimaryRole } from "@/shared/lib/profileRoles";
import type { User } from "@supabase/supabase-js";
import { buildUsernameFromName, normalizeUsernameInput } from "../lib/username";
import type { Json } from "@/integrations/supabase/types";

function splitFullName(fullName: string) {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function extractProfileSeed(user: User) {
  const metadata = user.user_metadata ?? {};
  const fullName = String(metadata.full_name ?? metadata.name ?? "").trim();
  const splitName = splitFullName(fullName);

  return {
    email: user.email ?? "",
    firstName: String(metadata.first_name ?? splitName.firstName ?? "").trim(),
    lastName: String(metadata.last_name ?? splitName.lastName ?? "").trim(),
    preferredUsername: String(
      metadata.preferred_username ?? metadata.user_name ?? metadata.username ?? ""
    ).trim(),
  };
}

async function ensureProfileExists(user: User) {
  const seed = extractProfileSeed(user);
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name, username")
    .eq("user_id", user.id)
    .maybeSingle();

  const firstName = existingProfile?.first_name?.trim() || seed.firstName;
  const lastName = existingProfile?.last_name?.trim() || seed.lastName;
  const currentUsername = existingProfile?.username?.trim() || "";
  const username =
    currentUsername ||
    (firstName || lastName || seed.preferredUsername
      ? await resolveAvailableUsername(firstName, lastName, seed.preferredUsername, user.id)
      : "");

  const { error } = await supabase
    .from("profiles")
    .upsert({
      user_id: user.id,
      email: seed.email,
      first_name: firstName,
      last_name: lastName,
      username,
    } as any, { onConflict: "user_id" });

  if (error) throw error;
}

async function resolveAvailableUsername(
  firstName: string,
  lastName: string,
  preferredUsername?: string,
  excludeUserId?: string
) {
  const baseUsername = normalizeUsernameInput(preferredUsername || "") || buildUsernameFromName(firstName, lastName);
  const fallbackBase = baseUsername || `user${Date.now().toString().slice(-6)}`;

  for (let index = 0; index < 50; index += 1) {
    const suffix = index === 0 ? "" : `${index}`;
    const candidate = normalizeUsernameInput(`${fallbackBase}${suffix}`);
    let query = supabase
      .from("profiles")
      .select("user_id")
      .ilike("username", candidate)
      .limit(1);

    if (excludeUserId) {
      query = query.neq("user_id", excludeUserId);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) {
      return candidate;
    }
  }

  throw new Error("לא הצלחנו לייצר שם משתמש פנוי. נסה לבחור אחד ידנית.");
}

async function fetchProfile(userId: string): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  const primaryRole = resolvePrimaryRole({
    primaryRole: (data as any).primary_role,
    role: (data as any).role,
    isAdmin: data.is_admin,
  });

  return {
    id: data.user_id,
    firstName: data.first_name,
    lastName: data.last_name,
    username: data.username,
    email: data.email,
    isStudent: data.is_student,
    isAdmin: data.is_admin,
    avatarUrl: (data as any).avatar_url ?? null,
    isEmailPrivate: (data as any).is_email_private ?? false,
    hideLastSeen: (data as any).hide_last_seen ?? false,
    primaryRole,
    role: primaryRole,
    badges: resolveBadges({ badges: (data as any).badges ?? [], role: (data as any).role }),
    permissions: (data as any).permissions ?? [],
    bannedAt: (data as any).banned_at ?? null,
    emailNotifications: (data as any).email_notifications ?? true,
  };
}

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  const query = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      // After OAuth redirect it can take a brief moment until Supabase session is available.
      // If we setUser(null) immediately, ProtectedRoute may redirect back to /login.
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      let resolvedSession = session;

      if (!resolvedSession?.user) {
        const maxAttempts = 3;
        const delayMs = 250;

        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          // Wait a bit for auth state to settle after redirect.
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => window.setTimeout(r, delayMs));

          // eslint-disable-next-line no-await-in-loop
          const { data: { session: nextSession } } = await supabase.auth.getSession();
          resolvedSession = nextSession;
          if (resolvedSession?.user) break;
        }
      }

      if (!resolvedSession?.user) {
        setUser(null);
        return null;
      }
      await ensureProfileExists(resolvedSession.user);
      let profile = await fetchProfile(resolvedSession.user.id);
      setUser(profile);
      return profile;
    },
    retry: false,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          setUser(null);
          return;
        }
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          setTimeout(async () => {
            // Sync auth email to profile if changed
            if (event === "USER_UPDATED" && session.user.email) {
              await supabase
                .from("profiles")
                .update({ email: session.user.email })
                .eq("user_id", session.user.id);
            }
            await ensureProfileExists(session.user);
            let profile = await fetchProfile(session.user.id);
            setUser(profile);
          }, 0);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return query;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      newPassword: string;
      isStudent: boolean;
      candidateData?: Record<string, unknown>;
    }) => {
      const resolvedUsername = await resolveAvailableUsername(data.firstName, data.lastName, data.username);

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.newPassword,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });
      if (error) throw error;

      if (authData.user) {
        await supabase
          .from("profiles")
          .upsert({
            user_id: authData.user.id,
            email: data.email,
            username: resolvedUsername,
            is_student: data.isStudent,
            first_name: data.firstName,
            last_name: data.lastName,
          } as any, { onConflict: "user_id" });

        if (data.candidateData && Object.keys(data.candidateData).length > 0) {
          const { error: candidateError } = await supabase
            .from("candidates")
            .insert({
              user_id: authData.user.id,
              data: data.candidateData as Json,
            } as any);

          if (candidateError && candidateError.code !== "23505") {
            throw candidateError;
          }

          if (candidateError?.code === "23505") {
            const { error: updateCandidateError } = await supabase
              .from("candidates")
              .update({ data: data.candidateData as Json } as any)
              .eq("user_id", authData.user.id);

            if (updateCandidateError) throw updateCandidateError;
          }
        }
      }

      return authData;
    },
    onSuccess: async (authData) => {
      if (authData.user) {
        const profile = await fetchProfile(authData.user.id);
        setUser(profile);
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      logout();
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useEditUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const nextUsername = typeof data.username === "string" ? normalizeUsernameInput(data.username) : null;
      const nextEmail = typeof data.email === "string" ? data.email.trim().toLowerCase() : null;

      if (nextUsername) {
        const { data: existingUsername, error: usernameError } = await supabase
          .from("profiles")
          .select("user_id")
          .ilike("username", nextUsername)
          .neq("user_id", session.user.id)
          .limit(1);
        if (usernameError) throw usernameError;
        if (existingUsername && existingUsername.length > 0) {
          throw new Error("שם המשתמש כבר קיים במערכת");
        }
        data.username = nextUsername;
      }

      if (nextEmail) {
        const { data: existingEmail, error: emailError } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("email", nextEmail)
          .neq("user_id", session.user.id)
          .limit(1);
        if (emailError) throw emailError;
        if (existingEmail && existingEmail.length > 0) {
          throw new Error("כתובת האימייל כבר קיימת במערכת");
        }
        data.email = nextEmail;
      }

      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("user_id", session.user.id);
      if (error) throw error;

      return fetchProfile(session.user.id);
    },
    onSuccess: (profile) => {
      setUser(profile);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      if (error) throw error;
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ password }: { token: string; password: string }) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    },
  });
}

export function useChangeEmail() {
  return useMutation({
    mutationFn: async (newEmail: string) => {
      const normalizedEmail = newEmail.trim().toLowerCase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { data: existingEmail, error: emailError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", normalizedEmail)
        .neq("user_id", session.user.id)
        .limit(1);
      if (emailError) throw emailError;
      if (existingEmail && existingEmail.length > 0) {
        throw new Error("כתובת האימייל כבר קיימת במערכת");
      }

      const { error } = await supabase.auth.updateUser({
        email: normalizedEmail,
      });
      if (error) throw error;
    },
  });
}
