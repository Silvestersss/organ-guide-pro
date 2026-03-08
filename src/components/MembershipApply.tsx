import { motion } from "framer-motion";
import { Crown, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMyMembership, useEnsureBasicMembership, TIER_LABELS, TIER_DESCRIPTIONS, type MemberTier } from "@/hooks/useMembership";

const TIERS: MemberTier[] = ["basic", "paid", "premium"];

export function MembershipApply() {
  const { user } = useAuth();
  const email = user?.email;
  const { data: membership } = useMyMembership(email);

  // Auto-assign basic membership
  useEnsureBasicMembership(email);

  if (!email) return null;

  const currentTier = membership?.tier || "basic";

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

      <div className="grid gap-3 md:grid-cols-3">
        {TIERS.map((tier) => {
          const isActive = currentTier === tier;
          return (
            <div
              key={tier}
              className={`rounded-lg border p-4 transition-all ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Crown className={`h-4 w-4 ${tier === "premium" ? "text-yellow-500" : tier === "paid" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium text-foreground">{TIER_LABELS[tier]}</span>
                {isActive && <Check className="h-4 w-4 text-primary ml-auto" />}
              </div>
              <p className="text-xs text-muted-foreground">{TIER_DESCRIPTIONS[tier]}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        如需升級為付費會員或尊貴會員，請聯繫管理員。
      </p>
    </motion.div>
  );
}
