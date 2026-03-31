import React from "react";
import { Crown, Shield, MessageCircle, Pencil, Heart } from "lucide-react";
import { ROLE_CONFIG } from "@/shared/lib/roleConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ICONS: Record<string, (cls: string) => React.ReactNode> = {
  crown: (cls) => <Crown className={cls} />,
  shield: (cls) => <Shield className={cls} />,
  "message-circle": (cls) => <MessageCircle className={cls} />,
  pencil: (cls) => <Pencil className={cls} />,
  heart: (cls) => <Heart className={cls} />,
};

interface RoleIconProps {
  role: string;
  size?: "xs" | "sm";
  className?: string;
}

/**
 * Lightweight inline role icon with tooltip.
 * Use next to usernames for subtle role indication.
 */
const RoleIcon: React.FC<RoleIconProps> = ({ role, size = "xs", className = "" }) => {
  const config = ROLE_CONFIG[role];
  if (!config) return null;

  const sizeClass = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex shrink-0 ${className}`}>
            {ICONS[config.iconName]?.(`${sizeClass} ${config.nameClass}`)}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {config.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RoleIcon;
