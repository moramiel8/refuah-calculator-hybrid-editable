import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RoleColors {
  badgeColor: string;
  nameColor: string;
}

const DEFAULT_COLORS: Record<string, RoleColors> = {
  owner: { badgeColor: "#d97706", nameColor: "#d97706" },
  admin: { badgeColor: "#3b82f6", nameColor: "#3b82f6" },
  moderator: { badgeColor: "#10b981", nameColor: "#10b981" },
  editor: { badgeColor: "#8b5cf6", nameColor: "#8b5cf6" },
  supporter: { badgeColor: "#ec4899", nameColor: "#ec4899" },
};

export function useRoleColors() {
  const { data: colorMap = DEFAULT_COLORS } = useQuery({
    queryKey: ["role-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_settings" as any)
        .select("role, badge_color, name_color");
      if (error || !data) return DEFAULT_COLORS;
      const map: Record<string, RoleColors> = { ...DEFAULT_COLORS };
      (data as any[]).forEach((row) => {
        map[row.role] = { badgeColor: row.badge_color, nameColor: row.name_color };
      });
      return map;
    },
    staleTime: 60_000,
  });

  const getNameStyle = (role: string): React.CSSProperties | undefined => {
    const c = colorMap[role];
    if (!c) return undefined;
    return {
      color: c.nameColor,
      fontWeight: role === "owner" || role === "supporter" ? 700 : 500,
    };
  };

  const getBadgeStyle = (role: string): React.CSSProperties | undefined => {
    const c = colorMap[role];
    if (!c) return undefined;
    return {
      backgroundColor: `${c.badgeColor}20`,
      color: c.badgeColor,
      borderColor: `${c.badgeColor}30`,
    };
  };

  return { colorMap, getNameStyle, getBadgeStyle };
}
