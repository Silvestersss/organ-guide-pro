import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CustomLink {
  id: string;
  system_id: string;
  title: string;
  url: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useCustomLinks(systemId?: string) {
  return useQuery({
    queryKey: ["custom_links", systemId],
    queryFn: async () => {
      let query = supabase
        .from("custom_links")
        .select("*")
        .order("sort_order", { ascending: true });
      if (systemId) query = query.eq("system_id", systemId);
      const { data, error } = await query;
      if (error) throw error;
      return data as CustomLink[];
    },
  });
}

export function useAddLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (link: { system_id: string; title: string; url?: string; description?: string; sort_order?: number }) => {
      const { data, error } = await supabase.from("custom_links").insert(link).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custom_links"] }),
  });
}

export function useUpdateLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; title?: string; url?: string; description?: string; sort_order?: number }) => {
      const { data, error } = await supabase.from("custom_links").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custom_links"] }),
  });
}

export function useDeleteLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("custom_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custom_links"] }),
  });
}
