import React from "react";
import UserBadge from "./UserBadge";
import { getDisplayRoles, type ProfileRoleInput } from "@/shared/lib/profileRoles";

interface UserBadgesProps extends ProfileRoleInput {
  size?: "sm" | "md";
  className?: string;
}

const UserBadges: React.FC<UserBadgesProps> = ({ size = "sm", className = "", ...input }) => {
  const roles = getDisplayRoles(input);

  if (!roles.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {roles.map((role) => (
        <UserBadge key={role} role={role} size={size} />
      ))}
    </div>
  );
};

export default UserBadges;
