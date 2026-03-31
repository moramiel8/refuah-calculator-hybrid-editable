import { supabase } from "@/integrations/supabase/client";
import type { Path } from "@/shared/types";

export const baseDataApi = {
  getPaths: async (): Promise<Path[]> => {
    const { data, error } = await supabase
      .from("paths")
      .select("*")
      .order("created_at");
    if (error) throw error;
    return (data ?? []).map((p) => ({
      _id: p.id,
      name: p.name,
      slug: p.slug ?? undefined,
    }));
  },
};
