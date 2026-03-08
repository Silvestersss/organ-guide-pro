import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Check, X, Users, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { organSystems } from "@/data/organSystems";
import {
  useMembershipLevels,
  useAddLevel,
  useUpdateLevel,
  useDeleteLevel,
  useAllMemberships,
  useUpdateMembership,
  useDeleteMembership,
  useAssignMembership,
  type MembershipLevel,
} from "@/hooks/useMembership";

export function MembershipAdmin() {
  const [tab, setTab] = useState<"levels" | "members">("levels");

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("levels")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "levels"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Crown className="inline h-4 w-4 mr-1" />
          會員級別
        </button>
        <button
          onClick={() => setTab("members")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "members"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Users className="inline h-4 w-4 mr-1" />
          會員管理
        </button>
      </div>

      {tab === "levels" ? <LevelsManager /> : <MembersManager />}
    </div>
  );
}

function LevelsManager() {
  const { data: levels = [], isLoading } = useMembershipLevels();
  const addLevel = useAddLevel();
  const updateLevel = useUpdateLevel();
  const deleteLevel = useDeleteLevel();

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSystems, setNewSystems] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSystems, setEditSystems] = useState<string[]>([]);

  const toggleSystem = (systems: string[], sysId: string) =>
    systems.includes(sysId) ? systems.filter((s) => s !== sysId) : [...systems, sysId];

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await addLevel.mutateAsync({ name: newName.trim(), description: newDesc.trim(), allowed_systems: newSystems, sort_order: levels.length });
      setNewName(""); setNewDesc(""); setNewSystems([]); setShowAdd(false);
      toast.success("已新增級別");
    } catch { toast.error("新增失敗"); }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateLevel.mutateAsync({ id, name: editName, description: editDesc, allowed_systems: editSystems });
      setEditingId(null);
      toast.success("已更新");
    } catch { toast.error("更新失敗"); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLevel.mutateAsync(id);
      toast.success("已刪除");
    } catch { toast.error("刪除失敗"); }
  };

  const SystemChips = ({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) => (
    <div className="flex flex-wrap gap-1.5">
      {organSystems.map((sys) => (
        <button
          key={sys.id}
          type="button"
          onClick={() => onToggle(sys.id)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            selected.includes(sys.id)
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {sys.name}
        </button>
      ))}
    </div>
  );

  if (isLoading) return <p className="text-muted-foreground">載入中...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">會員級別設定</h2>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="gap-1">
          <Plus className="h-4 w-4" /> 新增級別
        </Button>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-3 rounded-lg border border-border bg-card p-4">
          <Input placeholder="級別名稱 *" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input placeholder="描述（選填）" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">可訪問的系統：</p>
            <SystemChips selected={newSystems} onToggle={(id) => setNewSystems(toggleSystem(newSystems, id))} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={!newName.trim() || addLevel.isPending}>確認新增</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>取消</Button>
          </div>
        </motion.div>
      )}

      {levels.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          尚無會員級別，點擊「新增級別」開始設定。
        </div>
      ) : (
        <div className="space-y-2">
          {levels.map((level) => (
            <motion.div key={level.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-border bg-card p-4">
              {editingId === level.id ? (
                <div className="space-y-2">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="描述" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1.5">可訪問的系統：</p>
                    <SystemChips selected={editSystems} onToggle={(id) => setEditSystems(toggleSystem(editSystems, id))} />
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleUpdate(level.id)}><Check className="h-4 w-4 text-primary" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="font-medium">{level.name}</span>
                    </div>
                    {level.description && <p className="mt-1 text-sm text-muted-foreground">{level.description}</p>}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {level.allowed_systems.length > 0 ? (
                        level.allowed_systems.map((sysId) => {
                          const sys = organSystems.find((s) => s.id === sysId);
                          return sys ? (
                            <span key={sysId} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{sys.name}</span>
                          ) : null;
                        })
                      ) : (
                        <span className="text-xs text-muted-foreground">無系統權限</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingId(level.id); setEditName(level.name); setEditDesc(level.description); setEditSystems(level.allowed_systems); }}
                      className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(level.id)} className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function MembersManager() {
  const { data: memberships = [], isLoading } = useAllMemberships();
  const { data: levels = [] } = useMembershipLevels();
  const updateMembership = useUpdateMembership();
  const deleteMembership = useDeleteMembership();
  const assignMembership = useAssignMembership();

  const [showAssign, setShowAssign] = useState(false);
  const [assignEmail, setAssignEmail] = useState("");
  const [assignLevelId, setAssignLevelId] = useState("");

  const handleAssign = async () => {
    if (!assignEmail.trim() || !assignLevelId) return;
    try {
      await assignMembership.mutateAsync({ user_email: assignEmail.trim(), level_id: assignLevelId });
      setAssignEmail(""); setAssignLevelId(""); setShowAssign(false);
      toast.success("已指派會員級別");
    } catch { toast.error("指派失敗"); }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateMembership.mutateAsync({ id, status: "approved" });
      toast.success("已批准");
    } catch { toast.error("操作失敗"); }
  };

  const handleReject = async (id: string) => {
    try {
      await updateMembership.mutateAsync({ id, status: "rejected" });
      toast.success("已拒絕");
    } catch { toast.error("操作失敗"); }
  };

  const handleChangeLevel = async (id: string, levelId: string) => {
    try {
      await updateMembership.mutateAsync({ id, level_id: levelId });
      toast.success("已更改級別");
    } catch { toast.error("更改失敗"); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMembership.mutateAsync(id);
      toast.success("已移除");
    } catch { toast.error("移除失敗"); }
  };

  const getLevelName = (levelId: string) => levels.find((l) => l.id === levelId)?.name || "未知";

  const statusLabel: Record<string, { text: string; cls: string }> = {
    pending: { text: "待審核", cls: "bg-yellow-500/10 text-yellow-600" },
    approved: { text: "已批准", cls: "bg-green-500/10 text-green-600" },
    rejected: { text: "已拒絕", cls: "bg-red-500/10 text-red-600" },
  };

  if (isLoading) return <p className="text-muted-foreground">載入中...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">會員管理</h2>
        <Button size="sm" onClick={() => setShowAssign(!showAssign)} className="gap-1">
          <Plus className="h-4 w-4" /> 直接指派
        </Button>
      </div>

      {showAssign && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-3 rounded-lg border border-border bg-card p-4">
          <Input placeholder="客戶 Google Email *" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} />
          <select
            value={assignLevelId}
            onChange={(e) => setAssignLevelId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">選擇級別...</option>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAssign} disabled={!assignEmail.trim() || !assignLevelId || assignMembership.isPending}>確認指派</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAssign(false)}>取消</Button>
          </div>
        </motion.div>
      )}

      {memberships.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          尚無會員申請或指派紀錄。
        </div>
      ) : (
        <div className="space-y-2">
          {memberships.map((m) => {
            const st = statusLabel[m.status] || statusLabel.pending;
            return (
              <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{m.user_email}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.text}</span>
                      <span className="text-xs text-muted-foreground">級別：{getLevelName(m.level_id)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {m.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleApprove(m.id)} className="text-xs">批准</Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(m.id)} className="text-xs">拒絕</Button>
                      </>
                    )}
                    <select
                      value={m.level_id}
                      onChange={(e) => handleChangeLevel(m.id, e.target.value)}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      {levels.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                    <button onClick={() => handleDelete(m.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
