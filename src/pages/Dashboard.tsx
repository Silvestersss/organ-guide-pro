import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Activity, Stethoscope, BookOpen, Shield, Settings } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PasswordModal } from "@/components/PasswordModal";
import { OrganSystemContent } from "@/components/OrganSystemContent";
import { AuthButton } from "@/components/AuthButton";
import { SystemNote } from "@/components/SystemNote";
import { MembershipApply } from "@/components/MembershipApply";
import { useAuth } from "@/hooks/useAuth";
import { organSystems } from "@/data/organSystems";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [activeSystem, setActiveSystem] = useState<string | null>(null);
  const [unlockedSystems, setUnlockedSystems] = useState<Set<string>>(new Set());
  const [passwordModal, setPasswordModal] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectSystem = useCallback((id: string) => {
    setActiveSystem(id);
    setSidebarOpen(false);
  }, []);

  const handlePasswordSubmit = useCallback((password: string) => {
    const system = organSystems.find((s) => s.id === passwordModal);
    if (system && password === system.password) {
      setUnlockedSystems((prev) => new Set([...prev, system.id]));
      setActiveSystem(system.id);
      setPasswordModal(null);
      setSidebarOpen(false);
      return true;
    }
    return false;
  }, [passwordModal]);

  const handleLogout = () => {
    navigate("/");
  };

  const currentSystem = organSystems.find((s) => s.id === activeSystem);
  const modalSystem = organSystems.find((s) => s.id === passwordModal);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          activeSystem={activeSystem}
          unlockedSystems={unlockedSystems}
          onSelectSystem={handleSelectSystem}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 h-full">
            <DashboardSidebar
              activeSystem={activeSystem}
              unlockedSystems={unlockedSystems}
              onSelectSystem={handleSelectSystem}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold">
              {currentSystem ? currentSystem.name : "歡迎回來！🎉"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {currentSystem ? currentSystem.nameEn : "選擇一個器官系統開始探索"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="內容管理"
              >
                <Settings className="h-5 w-5" />
              </button>
            )}
            <AuthButton />
          </div>
        </header>

        {/* System note */}
        {currentSystem && (
          <div className="border-b border-border bg-background/50 px-4 py-3 lg:px-6">
            <SystemNote systemId={currentSystem.id} />
          </div>
        )}

        <div className="p-4 lg:p-8">
          {currentSystem ? (
            <OrganSystemContent key={currentSystem.id} system={currentSystem} />
          ) : (
            <>
              <WelcomeContent unlockedCount={unlockedSystems.size} onSelectSystem={handleSelectSystem} />
              {user && <div id="membership-apply" className="mt-8"><MembershipApply /></div>}
            </>
          )}
        </div>
      </main>

      {/* Password Modal */}
      <PasswordModal
        isOpen={!!passwordModal}
        onClose={() => setPasswordModal(null)}
        onSubmit={handlePasswordSubmit}
        systemName={modalSystem?.name || ""}
      />
    </div>
  );
}

function WelcomeContent({ unlockedCount, onSelectSystem }: { unlockedCount: number; onSelectSystem: (id: string) => void }) {
  const stats = [
    { icon: Activity, label: "器官系統", value: "5 大系統" },
    { icon: Stethoscope, label: "常見疾病", value: "20+ 種" },
    { icon: BookOpen, label: "健康知識", value: "50+ 條" },
    { icon: Shield, label: "已解鎖", value: `${unlockedCount} / 5` },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-hero border border-border p-8 text-center">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          歡迎來到 <span className="text-gradient-teal">IU 健康百科</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          會員權限系統已啟用，享受個人化的內容體驗
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-5 text-center"
          >
            <stat.icon className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 font-display text-xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* System Cards */}
      <div>
        <h3 className="mb-4 font-display text-xl font-bold">探索器官系統</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organSystems.map((sys, i) => (
            <motion.button
              key={sys.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              onClick={() => onSelectSystem(sys.id)}
              className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:glow-border"
            >
              <div className="relative h-36 overflow-hidden">
                <img src={sys.image} alt={sys.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="p-4">
                <h4 className="font-display font-bold">{sys.name}</h4>
                <p className="text-xs text-muted-foreground">{sys.nameEn}</p>
                <p className="mt-2 line-clamp-2 text-sm text-secondary-foreground">{sys.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {sys.organs.slice(0, 3).map((o) => (
                    <span key={o} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{o}</span>
                  ))}
                  {sys.organs.length > 3 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">+{sys.organs.length - 3}</span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
