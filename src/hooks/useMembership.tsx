import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MembershipLevel {
  id: string;
  name: string;
  description: string;
  allowed_systems: string[];
  sort_order: number;
  created_at: string;
}

export interface UserMembership {
  id: string;
  user_email: string;
  level_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Fetch all membership levels
export function useMembershipLevels() {
  return useQuery({
    queryKey: ["membership_levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_levels")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as MembershipLevel[];
    },
  });
}

// Fetch current user's membership
export function useMyMembership(email: string | undefined) {
  return useQuery({
    queryKey: ["my_membership", email],
    enabled: !!email,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_memberships")
        .select("*")
        .eq("user_email", email!)
        .eq("status", "approved")
        .maybeSingle();
      if (error) throw error;
      return data as UserMembership | null;
    },
  });
}

// Fetch all user memberships (admin)
export function useAllMemberships() {
  return useQuery({
    queryKey: ["all_memberships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_memberships")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as UserMembership[];
    },
  });
}

// Admin: add level
export function useAddLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (level: { name: string; description?: string; allowed_systems: string[]; sort_order?: number }) => {
      const { error } = await supabase.from("membership_levels").insert(level);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["membership_levels"] }),
  });
}

// Admin: update level
export function useUpdateLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MembershipLevel> & { id: string }) => {
      const { error } = await supabase.from("membership_levels").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["membership_levels"] }),
  });
}

// Admin: delete level
export function useDeleteLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("membership_levels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["membership_levels"] }),
  });
}

// User: apply for membership
export function useApplyMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_email, level_id }: { user_email: string; level_id: string }) => {
      const { error } = await supabase.from("user_memberships").insert({ user_email, level_id, status: "pending" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my_membership"] });
      qc.invalidateQueries({ queryKey: ["all_memberships"] });
    },
  });
}

// Admin: update membership status/level
export function useUpdateMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; level_id?: string }) => {
      const { error } = await supabase.from("user_memberships").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all_memberships"] });
      qc.invalidateQueries({ queryKey: ["my_membership"] });
    },
  });
}

// Admin: delete membership
export function useDeleteMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_memberships").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all_memberships"] });
      qc.invalidateQueries({ queryKey: ["my_membership"] });
    },
  });
}

// Admin: directly assign membership
export function useAssignMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_email, level_id }: { user_email: string; level_id: string }) => {
      const { error } = await supabase.from("user_memberships").upsert(
        { user_email, level_id, status: "approved", updated_at: new Date().toISOString() },
        { onConflict: "user_email,level_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all_memberships"] });
      qc.invalidateQueries({ queryKey: ["my_membership"] });
    },
  });
}
