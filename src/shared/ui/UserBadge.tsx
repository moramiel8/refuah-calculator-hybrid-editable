import React from "react";
import { Crown, Shield, MessageCircle, Pencil, Heart } from "lucide-react";
import { ROLE_CONFIG } from "@/shared/lib/roleConfig";
import { useRoleColors } from "@/shared/lib/useRoleColors";

const ICONS: Record<string, React.ReactNode> = {
  crown: <Crown className="h-3 w-3" />,
  shield: <Shield className="h-3 w-3" />,
  "message-circle": <MessageCircle className="h-3 w-3" />,
  pencil: <Pencil className="h-3 w-3" />,
  heart: <Heart className="h-3 w-3" />,
};

export type UserRole = "owner" | "admin" | "moderator" | "editor" | "supporter" | "user";

interface UserBadgeProps {
  role: string;
  size?: "sm" | "md";
  className?: string;
}

const UserBadge: React.FC<UserBadgeProps> = ({ role, size = "sm", className = "" }) => {
  const config = ROLE_CONFIG[role];
  const { getBadgeStyle } = useRoleColors();
  if (!config) return null;

  const sizeClasses = size === "sm"
    ? "px-1.5 py-0.5 text-[10px] gap-1"
    : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium whitespace-nowrap ${sizeClasses} ${config.badgeClass} ${className}`}
      style={getBadgeStyle(role)}
      title={config.label}
    >
      {ICONS[config.iconName]}
      {config.label}
    </span>
  );
};

export default UserBadge;
