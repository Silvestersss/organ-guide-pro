import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ExternalLink, Trash2, GripVertical, Pencil, X, Check, Link2 } from "lucide-react";
import { useCustomLinks, useAddLink, useUpdateLink, useDeleteLink } from "@/hooks/useCustomLinks";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CustomLinksSectionProps {
  systemId: string;
}

export function CustomLinksSection({ systemId }: CustomLinksSectionProps) {
  const { data: links = [], isLoading } = useCustomLinks(systemId);
  const { isAdmin, isEditMode } = useAuth();
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

  const canEdit = isAdmin && isEditMode;

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    try {
      await addLink.mutateAsync({
        system_id: systemId,
        title: newTitle.trim(),
        url: newUrl.trim() || undefined,
        description: newDesc.trim() || undefined,
        sort_order: links.length,
      });
      setNewTitle("");
      setNewUrl("");
      setNewDesc("");
      setShowAdd(false);
      toast.success("已新增連結");
    } catch {
      toast.error("新增失敗");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateLink.mutateAsync({
        id,
        title: editTitle.trim(),
        url: editUrl.trim() || undefined,
        description: editDesc.trim() || undefined,
      });
      setEditingId(null);
      toast.success("已更新");
    } catch {
      toast.error("更新失敗");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLink.mutateAsync(id);
      toast.success("已刪除");
    } catch {
      toast.error("刪除失敗");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const current = links[index];
    const prev = links[index - 1];
    await Promise.all([
      updateLink.mutateAsync({ id: current.id, sort_order: prev.sort_order }),
      updateLink.mutateAsync({ id: prev.id, sort_order: current.sort_order }),
    ]);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= links.length - 1) return;
    const current = links[index];
    const next = links[index + 1];
    await Promise.all([
      updateLink.mutateAsync({ id: current.id, sort_order: next.sort_order }),
      updateLink.mutateAsync({ id: next.id, sort_order: current.sort_order }),
    ]);
  };

  if (links.length === 0 && !canEdit) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold">延伸資源</h2>
        </div>
        {canEdit && (
          <Button size="sm" variant="outline" onClick={() => setShowAdd(!showAdd)} className="gap-1">
            <Plus className="h-4 w-4" />
            新增
          </Button>
        )}
      </div>

      {/* Add form */}
      {showAdd && canEdit && (
        <div className="mb-4 space-y-2 rounded-lg border border-border bg-muted/50 p-4">
          <Input placeholder="標題 *" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <Input placeholder="網址（選填）" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
          <Input placeholder="描述（選填）" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim() || addLink.isPending}>
              確認新增
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
              取消
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">載入中...</p>
      ) : links.length === 0 ? (
        <p className="text-sm text-muted-foreground">尚無延伸資源，點擊「新增」來添加。</p>
      ) : (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={link.id} className="group flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 transition-all hover:bg-muted/50">
              {canEdit && (
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => handleMoveUp(i)} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <GripVertical className="h-3 w-3 rotate-90" />
                  </button>
                  <button onClick={() => handleMoveDown(i)} disabled={i >= links.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <GripVertical className="h-3 w-3 -rotate-90" />
                  </button>
                </div>
              )}

              {editingId === link.id ? (
                <div className="flex-1 space-y-1">
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-8 text-sm" />
                  <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="網址" className="h-8 text-sm" />
                  <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="描述" className="h-8 text-sm" />
                  <div className="flex gap-1">
                    <button onClick={() => handleUpdate(link.id)} className="rounded p-1 text-medical-green hover:bg-medical-green/10">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{link.title}</p>
                    {link.description && <p className="text-xs text-muted-foreground truncate">{link.description}</p>}
                  </div>
                  {link.url && (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded p-1.5 text-primary hover:bg-primary/10">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {canEdit && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingId(link.id);
                          setEditTitle(link.title);
                          setEditUrl(link.url || "");
                          setEditDesc(link.description || "");
                        }}
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(link.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
