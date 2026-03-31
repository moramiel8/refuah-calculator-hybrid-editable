/**
 * Emergency only: set to `true` in a code deploy to force-open the app for everyone,
 * ignoring `beta_access_settings` (e.g. misconfiguration or lockout).
 *
 * Normal operation: keep `false` — turn beta on/off only from the site (owner admin → Supabase).
 */
export const BETA_GATE_KILL_SWITCH = false;

export const normalizeBetaEmail = (email: string) => email.trim().toLowerCase();

/** localStorage key — must stay in sync with App beta-runtime query cache. */
export const BETA_RUNTIME_CACHE_KEY = "beta-runtime-enabled";
