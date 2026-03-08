import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Check, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useMembershipLevels, useMyMembership, useApplyMembership } from "@/hooks/useMembership";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { organSystems } from "@/data/organSystems";

export function MembershipApply() {
  const { user } = useAuth();
  const email = user?.email;
  const { data: levels = [] } = useMembershipLevels();
  const { data: approvedMembership } = useMyMembership(email);
  const apply = useApplyMembership();

  // Also fetch pending/rejected
  const { data: allMyMemberships = [] } = useQuery({
    queryKey: ["my_all_memberships", email],
    enabled: !!email,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_memberships")
        .select("*")
        .eq("user_email", email!);
      if (error) throw error;
      return data;
    },
  });

  if (!email || levels.length === 0) return null;

  const handleApply = async (levelId: string) => {
    try {
      await apply.mutateAsync({ user_email: email, level_id: levelId });
      toast.success("申請已提交，請等待管理員審核");
    } catch {
      toast.error("申請失敗，可能已申請過此級別");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Crown className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold text-foreground">會員等級</h2>
      </div>

      {approvedMembership ? (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">
              目前級別：{levels.find((l) => l.id === approvedMembership.level_id)?.name || "未知"}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {levels.find((l) => l.id === approvedMembership.level_id)?.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {(levels.find((l) => l.id === approvedMembership.level_id)?.allowed_systems || []).map((sysId) => {
              const sys = organSystems.find((s) => s.id === sysId);
              return sys ? (
                <span key={sysId} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{sys.name}</span>
              ) : null;
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">選擇一個會員級別提交申請，管理員審核後即可享受對應權限。</p>
          {levels.map((level) => {
            const existing = allMyMemberships.find((m) => m.level_id === level.id);
            const isPending = existing?.status === "pending";
            const isRejected = existing?.status === "rejected";

            return (
              <div key={level.id} className="rounded-lg border border-border p-4 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{level.name}</p>
                  {level.description && <p className="text-sm text-muted-foreground">{level.description}</p>}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {level.allowed_systems.map((sysId) => {
                      const sys = organSystems.find((s) => s.id === sysId);
                      return sys ? (
                        <span key={sysId} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{sys.name}</span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div>
                  {isPending ? (
                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                      <Clock className="h-3.5 w-3.5" /> 審核中
                    </span>
                  ) : isRejected ? (
                    <span className="flex items-center gap-1 text-xs text-red-500">
                      <XCircle className="h-3.5 w-3.5" /> 已拒絕
                    </span>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleApply(level.id)} disabled={apply.isPending}>
                      申請
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
