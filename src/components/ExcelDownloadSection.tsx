import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Play, Plus, Pencil, Trash2, Check, X, Lock, Crown, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  useVideos,
  useAddVideo,
  useUpdateVideo,
  useDeleteVideo,
  useMyMembership,
  type MemberTier,
  TIER_LABELS,
} from "@/hooks/useMembership";

interface ExcelDownloadSectionProps {
  systemId: string;
}

export function ExcelDownloadSection({ systemId }: ExcelDownloadSectionProps) {
  const { user, isAdmin } = useAuth();
  const { data: videos = [], isLoading } = useVideos(systemId);
  const { data: membership } = useMyMembership(user?.email);
  const addVideo = useAddVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();

  const tier: MemberTier = membership?.tier || "basic";
  const canViewPaid = isAdmin || tier === "paid" || tier === "premium";
  const canEdit = isAdmin || tier === "premium";

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIsFree, setNewIsFree] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIsFree, setEditIsFree] = useState(true);

  if (!user) return null;

  const freeVideos = videos.filter((v) => v.is_free);
  const paidVideos = videos.filter((v) => !v.is_free);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    try {
      await addVideo.mutateAsync({
        system_id: systemId,
        title: newTitle.trim(),
        url: newUrl.trim() || undefined,
        is_free: newIsFree,
        sort_order: videos.length,
      });
      setNewTitle("");
      setNewUrl("");
      setNewIsFree(true);
      setShowAdd(false);
      toast.success("已新增影片");
    } catch {
      toast.error("新增失敗");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateVideo.mutateAsync({ id, title: editTitle, url: editUrl || undefined, is_free: editIsFree });
      setEditingId(null);
      toast.success("已更新");
    } catch {
      toast.error("更新失敗");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVideo.mutateAsync(id);
      toast.success("已刪除");
    } catch {
      toast.error("刪除失敗");
    }
  };

  const handleMoveVideo = async (videoId: string, direction: 'up' | 'down') => {
    const sortedVideos = [...videos].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sortedVideos.findIndex((v) => v.id === videoId);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sortedVideos.length) return;

    const current = sortedVideos[idx];
    const swap = sortedVideos[swapIdx];
    try {
      await updateVideo.mutateAsync({ id: current.id, sort_order: swap.sort_order });
      await updateVideo.mutateAsync({ id: swap.id, sort_order: current.sort_order });
      toast.success("已調整排序");
    } catch {
      toast.error("排序調整失敗");
    }
  };

  const renderVideoItem = (video: typeof videos[0], index: number, list: typeof videos) => {
    if (editingId === video.id && canEdit) {
      return (
        <li key={video.id} className="rounded-lg border border-border p-3 space-y-2">
          <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-8" placeholder="標題" />
          <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className="h-8" placeholder="網址" />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={editIsFree} onChange={(e) => setEditIsFree(e.target.checked)} />
            免費影片
          </label>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => handleUpdate(video.id)}><Check className="h-4 w-4 text-primary" /></Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
          </div>
        </li>
      );
    }

    return (
      <li key={video.id}>
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/50">
          {canEdit && (
            <div className="flex flex-col shrink-0">
              <button
                onClick={() => handleMoveVideo(video.id, 'up')}
                disabled={index === 0}
                className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleMoveVideo(video.id, 'down')}
                disabled={index === list.length - 1}
                className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <Play className="h-4 w-4 shrink-0 text-primary" />
          {video.url ? (
            <a href={video.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-foreground hover:text-primary transition-colors">
              {video.title}
            </a>
          ) : (
            <span className="flex-1 text-sm text-foreground">{video.title}</span>
          )}
          {!video.is_free && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">付費</span>
          )}
          {canEdit && (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => { setEditingId(video.id); setEditTitle(video.title); setEditUrl(video.url || ""); setEditIsFree(video.is_free); }}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(video.id)} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </li>
    );
  };

  if (isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">有關影片</h2>
        </div>
        {canEdit && (
          <Button size="sm" variant="outline" onClick={() => setShowAdd(!showAdd)} className="gap-1">
            <Plus className="h-4 w-4" /> 新增影片
          </Button>
        )}
      </div>

      {/* Add form */}
      {showAdd && canEdit && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-2 rounded-lg border border-border bg-muted/30 p-4">
          <Input placeholder="影片標題 *" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <Input placeholder="影片網址（選填）" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={newIsFree} onChange={(e) => setNewIsFree(e.target.checked)} />
            免費影片
          </label>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim() || addVideo.isPending}>確認新增</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>取消</Button>
          </div>
        </motion.div>
      )}

      {/* Free videos */}
      {freeVideos.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">免費影片</p>
          <ul className="space-y-2">{freeVideos.map(renderVideoItem)}</ul>
        </div>
      )}

      {/* Paid videos */}
      {paidVideos.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
            <Crown className="h-3.5 w-3.5" /> 付費影片
          </p>
          {canViewPaid ? (
            <ul className="space-y-2">{paidVideos.map(renderVideoItem)}</ul>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <Lock className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">升級為付費會員即可觀看付費影片</p>
            </div>
          )}
        </div>
      )}

      {videos.length === 0 && !showAdd && (
        <p className="text-sm text-muted-foreground">尚未新增影片</p>
      )}
    </motion.div>
  );
}
