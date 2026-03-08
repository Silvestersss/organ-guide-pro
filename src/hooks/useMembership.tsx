import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MemberTier = "basic" | "paid" | "premium";

export const TIER_LABELS: Record<MemberTier, string> = {
  basic: "一般會員",
  paid: "付費會員",
  premium: "尊貴會員",
};

export const TIER_DESCRIPTIONS: Record<MemberTier, string> = {
  basic: "可觀看免費影片",
  paid: "可觀看免費影片及付費影片",
  premium: "可觀看所有影片，並可管理影片清單",
};

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
  level_id: string | null;
  status: string;
  tier: MemberTier;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  system_id: string;
  title: string;
  url: string | null;
  is_free: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Fetch current user's approved membership
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

// Auto-assign basic membership on login
export function useEnsureBasicMembership(email: string | undefined) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ["ensure_membership", email],
    enabled: !!email,
    staleTime: Infinity,
    queryFn: async () => {
      // Check if membership exists
      const { data: existing } = await supabase
        .from("user_memberships")
        .select("id")
        .eq("user_email", email!)
        .maybeSingle();

      if (!existing) {
        // Auto-create basic membership
        await supabase.from("user_memberships").insert({
          user_email: email!,
          tier: "basic",
          status: "approved",
        });
        qc.invalidateQueries({ queryKey: ["my_membership", email] });
      }
      return true;
    },
  });
}

// Fetch all memberships (admin)
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

// Admin: update membership tier/status
export function useUpdateMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; tier?: MemberTier }) => {
      const { error } = await supabase
        .from("user_memberships")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
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

// Admin: assign membership by email
export function useAssignMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_email, tier }: { user_email: string; tier: MemberTier }) => {
      // Upsert: if exists update, if not insert
      const { data: existing } = await supabase
        .from("user_memberships")
        .select("id")
        .eq("user_email", user_email)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("user_memberships")
          .update({ tier, status: "approved", updated_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_memberships")
          .insert({ user_email, tier, status: "approved" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all_memberships"] });
      qc.invalidateQueries({ queryKey: ["my_membership"] });
    },
  });
}

// Videos: fetch by system
export function useVideos(systemId: string) {
  return useQuery({
    queryKey: ["videos", systemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("system_id", systemId)
        .order("sort_order");
      if (error) throw error;
      return data as Video[];
    },
  });
}

// Videos: add
export function useAddVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (video: { system_id: string; title: string; url?: string; is_free?: boolean; sort_order?: number }) => {
      const { error } = await supabase.from("videos").insert(video);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["videos", v.system_id] }),
  });
}

// Videos: update
export function useUpdateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Video> & { id: string }) => {
      const { error } = await supabase.from("videos").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

// Videos: delete
export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

// Keep old exports for backward compatibility
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
