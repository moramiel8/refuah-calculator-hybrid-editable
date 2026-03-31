interface UserDisplayInput {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  fallback?: string;
}

export function getPrimaryUserLabel({
  firstName,
  lastName,
  username,
  fallback = "משתמש/ת",
}: UserDisplayInput) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (username) return `@${username}`;
  return fallback;
}

export function getUsernameLabel(username?: string | null) {
  return username ? `@${username}` : null;
}
