/**
 * Central role configuration — single source of truth for role visuals.
 * Import this everywhere roles need to be displayed.
 */

import { resolvePrimaryRole } from "./profileRoles";

export type AppRole = "owner" | "admin" | "moderator" | "editor" | "supporter" | "user";

export interface RoleConfigEntry {
  label: string;
  /** Lucide icon name */
  iconName: "crown" | "shield" | "message-circle" | "pencil" | "heart";
  /** Tailwind classes for the badge */
  badgeClass: string;
  /** Tailwind text color class for inline username coloring */
  nameClass: string;
}

export const ROLE_CONFIG: Record<string, RoleConfigEntry> = {
  owner: {
    label: "מייסד",
    iconName: "crown",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    nameClass: "text-amber-600 dark:text-amber-400",
  },
  admin: {
    label: "מנהל/ת",
    iconName: "shield",
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    nameClass: "text-blue-600 dark:text-blue-400",
  },
  moderator: {
    label: "מנהל/ת קהילה",
    iconName: "message-circle",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    nameClass: "text-emerald-600 dark:text-emerald-400",
  },
  editor: {
    label: "עורך/ת תוכן",
    iconName: "pencil",
    badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
    nameClass: "text-purple-600 dark:text-purple-400",
  },
  supporter: {
    label: "תומך/ת",
    iconName: "heart",
    badgeClass: "bg-pink-500/12 text-pink-600 dark:text-pink-400 border-pink-500/20",
    nameClass: "text-pink-600 dark:text-pink-400",
  },
};

/** Returns the effective display role (e.g. is_admin + role=user → admin) */
export function getEffectiveRole(role?: string | null, isAdmin?: boolean): string {
  return resolvePrimaryRole({ role, isAdmin });
}

/** Check if a role should be visually indicated */
export function hasVisualRole(role: string): boolean {
  return role !== "user" && role in ROLE_CONFIG;
}
