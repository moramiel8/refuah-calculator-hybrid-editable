export const USERNAME_MAX_LENGTH = 20;

export const USERNAME_ALLOWED_REGEX = /^[a-zA-Z0-9._\u0590-\u05FF]+$/;

export function normalizeUsernameInput(value: string) {
  return value
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase()
    .slice(0, USERNAME_MAX_LENGTH);
}

export function buildUsernameFromName(firstName: string, lastName: string) {
  const combined = `${firstName}${lastName}`;
  const normalized = normalizeUsernameInput(combined).replace(/[^a-zA-Z0-9._\u0590-\u05FF]/g, "");
  return normalized.slice(0, USERNAME_MAX_LENGTH);
}
