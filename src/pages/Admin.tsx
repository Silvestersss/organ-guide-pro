import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Pencil, Check, X, ExternalLink, GripVertical } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCustomLinks, useAddLink, useUpdateLink, useDeleteLink } from "@/hooks/useCustomLinks";
import { organSystems } from "@/data/organSystems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(organSystems[0].id);
  const { data: links = [], isLoading } = useCustomLinks(activeTab);
  const addLink = useAddLink();
  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDesc, setEditDesc] = useState("");

  if (loading) return <div className="flex h-screen items-center justify-center text-muted-foreground">載入中...</div>;
  if (!isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-muted-foreground">
        <p>你沒有管理員權限</p>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>返回</Button>
      </div>
    );
  }

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    try {
      await addLink.mutateAsync({
        system_id: activeTab,
        title: newTitle.trim(),
        url: newUrl.trim() || undefined,
        description: newDesc.trim() || undefined,
        sort_order: links.length,
      });
      setNewTitle(""); setNewUrl(""); setNewDesc(""); setShowAdd(false);
      toast.success("已新增");
    } catch { toast.error("新增失敗"); }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateLink.mutateAsync({ id, title: editTitle, url: editUrl || undefined, description: editDesc || undefined });
      setEditingId(null);
      toast.success("已更新");
    } catch { toast.error("更新失敗"); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLink.mutateAsync(id);
      toast.success("已刪除");
    } catch { toast.error("刪除失敗"); }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const current = links[index], prev = links[index - 1];
    await Promise.all([
      updateLink.mutateAsync({ id: current.id, sort_order: prev.sort_order }),
      updateLink.mutateAsync({ id: prev.id, sort_order: current.sort_order }),
    ]);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= links.length - 1) return;
    const current = links[index], next = links[index + 1];
    await Promise.all([
      updateLink.mutateAsync({ id: current.id, sort_order: next.sort_order }),
      updateLink.mutateAsync({ id: next.id, sort_order: current.sort_order }),
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:px-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <h1 className="font-display text-lg font-bold">內容管理</h1>
      </header>

      <div className="container mx-auto max-w-4xl p-4 lg:p-8">
        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {organSystems.map((sys) => (
            <button
              key={sys.id}
              onClick={() => { setActiveTab(sys.id); setShowAdd(false); setEditingId(null); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === sys.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {sys.name}
            </button>
          ))}
        </div>

        {/* Add button */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            {organSystems.find(s => s.id === activeTab)?.name} — 延伸資源
          </h2>
          <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="gap-1">
            <Plus className="h-4 w-4" />
            新增連結
          </Button>
        </div>

        {/* Add form */}
        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-2 rounded-lg border border-border bg-card p-4">
            <Input placeholder="標題 *" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <Input placeholder="網址（選填）" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
            <Input placeholder="描述（選填）" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim() || addLink.isPending}>確認新增</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>取消</Button>
            </div>
          </motion.div>
        )}

        {/* Links list */}
        {isLoading ? (
          <p className="text-muted-foreground">載入中...</p>
        ) : links.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            此系統尚無延伸資源，點擊「新增連結」開始添加。
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link, i) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => handleMoveUp(i)} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5">▲</button>
                  <button onClick={() => handleMoveDown(i)} disabled={i >= links.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5">▼</button>
                </div>

                {editingId === link.id ? (
                  <div className="flex-1 space-y-1">
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-8" />
                    <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="網址" className="h-8" />
                    <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="描述" className="h-8" />
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleUpdate(link.id)}><Check className="h-4 w-4 text-medical-green" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{link.title}</p>
                      {link.description && <p className="text-sm text-muted-foreground">{link.description}</p>}
                      {link.url && <p className="text-xs text-primary truncate">{link.url}</p>}
                    </div>
                    <div className="flex gap-1">
                      {link.url && (
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="rounded p-2 text-primary hover:bg-primary/10">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => { setEditingId(link.id); setEditTitle(link.title); setEditUrl(link.url || ""); setEditDesc(link.description || ""); }}
                        className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(link.id)} className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
