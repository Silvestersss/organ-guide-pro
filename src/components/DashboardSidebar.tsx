import { Wind, Heart, Apple, Brain, Droplets, Lock, Check, Instagram, LogOut, User, Crown, Star, ArrowUpCircle } from "lucide-react";
import { organSystems } from "@/data/organSystems";
import { useAuth } from "@/hooks/useAuth";
import { useMyMembership, TIER_LABELS, type MemberTier } from "@/hooks/useMembership";

const iconMap: Record<string, React.ElementType> = {
  Wind, Heart, Apple, Brain, Droplets,
};

interface DashboardSidebarProps {
  activeSystem: string | null;
  unlockedSystems: Set<string>;
  onSelectSystem: (id: string) => void;
  onLogout: () => void;
}

export function DashboardSidebar({ activeSystem, unlockedSystems, onSelectSystem, onLogout }: DashboardSidebarProps) {
  const { user, isAdmin } = useAuth();
  const { data: membership } = useMyMembership(user?.email);
  const tier: MemberTier = isAdmin ? "premium" : (membership?.tier || "basic");

  const tierIcon = tier === "premium" ? Crown : tier === "paid" ? Star : User;
  const TierIcon = tierIcon;

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-gradient-sidebar">
      {/* Header */}
      <div className="border-b border-border p-5">
        <h2 className="font-display text-lg font-bold text-gradient-teal">IU 健康百科</h2>
        <p className="mt-1 text-xs text-muted-foreground">人體器官系統探索</p>
      </div>

      {/* User info */}
      {user && (
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <TierIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "管理員" : TIER_LABELS[tier]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {organSystems.map((sys) => {
          const Icon = iconMap[sys.icon] || Wind;
          const isActive = activeSystem === sys.id;
          const isUnlocked = unlockedSystems.has(sys.id);

          return (
            <button
              key={sys.id}
              onClick={() => onSelectSystem(sys.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-all ${
                isActive
                  ? "bg-primary/10 text-primary glow-border"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <div className="flex-1 truncate">
                <p className="font-medium">{sys.name}</p>
                <p className="truncate text-xs text-muted-foreground">{sys.nameEn}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-2">
        <a
          href="https://www.instagram.com/ai.mbti/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Instagram className="h-4 w-4" />
          <span>追蹤 Instagram</span>
        </a>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>登出</span>
        </button>
      </div>
    </aside>
  );
}
