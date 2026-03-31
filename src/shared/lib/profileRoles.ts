export type ProfileRoleInput = {
  primaryRole?: string | null;
  role?: string | null;
  badges?: string[] | null;
  isAdmin?: boolean;
};

const PRIMARY_ROLES = new Set(["owner", "admin", "moderator", "editor", "user"]);
const BADGE_ROLES = new Set(["supporter"]);

export function resolvePrimaryRole({
  primaryRole,
  role,
  isAdmin,
}: ProfileRoleInput): string {
  if (primaryRole && PRIMARY_ROLES.has(primaryRole) && primaryRole !== "user") {
    return primaryRole;
  }

  if (role && PRIMARY_ROLES.has(role) && role !== "user") {
    return role;
  }

  if (isAdmin) {
    return "admin";
  }

  if (primaryRole === "user") {
    return primaryRole;
  }

  if (role === "user") {
    return role;
  }

  return "user";
}

export function resolveBadges({
  badges,
  role,
}: Pick<ProfileRoleInput, "badges" | "role">): string[] {
  const next = new Set<string>();

  for (const badge of badges ?? []) {
    if (BADGE_ROLES.has(badge)) {
      next.add(badge);
    }
  }

  if (role === "supporter") {
    next.add("supporter");
  }

  return [...next];
}

export function getDisplayRoles(input: ProfileRoleInput): string[] {
  const roles: string[] = [];
  const primaryRole = resolvePrimaryRole(input);

  if (primaryRole !== "user") {
    roles.push(primaryRole);
  }

  for (const badge of resolveBadges(input)) {
    if (!roles.includes(badge)) {
      roles.push(badge);
    }
  }

  return roles;
}

export function getProminentRole(input: ProfileRoleInput): string {
  const primaryRole = resolvePrimaryRole(input);
  const badges = resolveBadges(input);

  if (primaryRole === "owner") {
    return "owner";
  }

  if (badges.includes("supporter")) {
    return "supporter";
  }

  return primaryRole;
}

export function hasBadge(input: ProfileRoleInput, badge: string): boolean {
  return resolveBadges(input).includes(badge);
}
