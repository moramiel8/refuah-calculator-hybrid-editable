import { useQuery } from "@tanstack/react-query";
import { baseDataApi } from "./api";
import { useBaseDataStore } from "./store";
import { universitiesApi } from "@/features/universities/api";

export function useBaseData() {
  const setBaseData = useBaseDataStore((s) => s.setBaseData);

  return useQuery({
    queryKey: ["baseData"],
    queryFn: async () => {
      const [paths, uniRows] = await Promise.all([
        baseDataApi.getPaths(),
        universitiesApi.getAll(),
      ]);
      const universities = uniRows.map((u) => ({
        _id: u.id,
        name: u.name,
        slug: u.slug ?? undefined,
        color: u.color,
        path_id: u.path_id,
        path_ids: Array.isArray(u.path_ids) ? u.path_ids : u.path_id ? [u.path_id] : null,
      }));
      const data = {
        paths,
        universities,
        sections: [],
        datagroups: [],
        datafields: [],
        datatables: [],
      };
      setBaseData(data);
      return data;
    },
    retry: 1,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
