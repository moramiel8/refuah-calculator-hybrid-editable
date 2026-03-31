import { create } from "zustand";
import type { Path, University, Section, DataGroup, DataField, DataTable } from "@/shared/types";

interface BaseDataState {
  paths: Path[];
  universities: University[];
  sections: Section[];
  datagroups: DataGroup[];
  datafields: DataField[];
  datatables: DataTable[];
  loading: boolean;
  setBaseData: (data: Partial<BaseDataState>) => void;
  setLoading: (loading: boolean) => void;
}

export const useBaseDataStore = create<BaseDataState>((set) => ({
  paths: [],
  universities: [],
  sections: [],
  datagroups: [],
  datafields: [],
  datatables: [],
  loading: true,
  setBaseData: (data) => set({ ...data, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
