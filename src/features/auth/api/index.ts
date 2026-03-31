import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/shared/types";

export const authApi = {
  getUsers: async (_filters: Record<string, unknown>) => {
    // This is now handled directly by admin hooks using supabase
    return { data: { users: [] as User[], count: 0 } };
  },
};
