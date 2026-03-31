/**
 * Calculator feature flag & access control.
 * Set ENABLE_CALCULATOR_FOR_ALL to true to restore full access for everyone.
 */

export const ENABLE_CALCULATOR_FOR_ALL = true;

const ALLOWED_UIDS = new Set(["e150226d-e8a4-4c0e-8484-ea967a86d032", "e154ae72-ebca-49c9-85f1-63a473063420"]);

export function canAccessCalculator(
  user: {
    id: string;
    role?: string;
  } | null,
): boolean {
  if (ENABLE_CALCULATOR_FOR_ALL) return true;
  if (!user) return false;
  if (user.role === "owner" || user.role === "admin") return true;
  return ALLOWED_UIDS.has(user.id);
}
