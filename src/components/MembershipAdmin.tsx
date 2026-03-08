import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Check, X, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useAllMemberships,
  useUpdateMembership,
  useDeleteMembership,
  useAssignMembership,
  TIER_LABELS,
  TIER_DESCRIPTIONS,
  type MemberTier,
} from "@/hooks/useMembership";

const TIERS: MemberTier[] = ["basic", "paid", "premium"];

export function MembershipAdmin() {
  const { data: memberships = [], isLoading } = useAllMemberships();
  const updateMembership = useUpdateMembership();
  const deleteMembership = useDeleteMembership();
  const assignMembership = useAssignMembership();

  const [showAssign, setShowAssign] = useState(false);
  const [assignEmail, setAssignEmail] = useState("");
  const [assignTier, setAssignTier] = useState<MemberTier>("paid");

  const handleAssign = async () => {
    if (!assignEmail.trim()) return;
    try {
      await assignMembership.mutateAsync({ user_email: assignEmail.trim(), tier: assignTier });
      setAssignEmail("");
      setAssignTier("paid");
      setShowAssign(false);
      toast.success("已指派會員級別");
    } catch {
      toast.error("指派失敗");
    }
  };

  const handleChangeTier = async (id: string, tier: MemberTier) => {
    try {
      await updateMembership.mutateAsync({ id, tier });
      toast.success("已更改級別");
    } catch {
      toast.error("更改失敗");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMembership.mutateAsync(id);
      toast.success("已移除");
    } catch {
      toast.error("移除失敗");
    }
  };

  const tierBadge = (tier: MemberTier) => {
    const cls: Record<MemberTier, string> = {
      basic: "bg-muted text-muted-foreground",
      paid: "bg-primary/10 text-primary",
      premium: "bg-yellow-500/10 text-yellow-600",
    };
    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls[tier]}`}>{TIER_LABELS[tier]}</span>;
  };

  if (isLoading) return <p className="text-muted-foreground">載入中...</p>;

  return (
    <div>
      {/* Tier descriptions */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Crown className={`h-4 w-4 ${tier === "premium" ? "text-yellow-500" : tier === "paid" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium text-foreground">{TIER_LABELS[tier]}</span>
            </div>
            <p className="text-xs text-muted-foreground">{TIER_DESCRIPTIONS[tier]}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5" /> 會員列表
        </h2>
        <Button size="sm" onClick={() => setShowAssign(!showAssign)} className="gap-1">
          <Plus className="h-4 w-4" /> 指派會員
        </Button>
      </div>

      {showAssign && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-3 rounded-lg border border-border bg-card p-4">
          <Input placeholder="客戶 Google Email *" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} />
          <select
            value={assignTier}
            onChange={(e) => setAssignTier(e.target.value as MemberTier)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>{TIER_LABELS[t]}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAssign} disabled={!assignEmail.trim() || assignMembership.isPending}>確認指派</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAssign(false)}>取消</Button>
          </div>
        </motion.div>
      )}

      {memberships.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          尚無會員紀錄。用戶以 Google 登入後會自動成為一般會員。
        </div>
      ) : (
        <div className="space-y-2">
          {memberships.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-foreground">{m.user_email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {tierBadge(m.tier)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={m.tier}
                    onChange={(e) => handleChangeTier(m.id, e.target.value as MemberTier)}
                    className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    {TIERS.map((t) => (
                      <option key={t} value={t}>{TIER_LABELS[t]}</option>
                    ))}
                  </select>
                  <button onClick={() => handleDelete(m.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
