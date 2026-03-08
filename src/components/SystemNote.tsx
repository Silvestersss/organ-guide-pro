import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface SystemNoteProps {
  systemId: string;
}

export function SystemNote({ systemId }: SystemNoteProps) {
  const { isAdmin, isEditMode } = useAuth();
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditing(false);
    setLoading(true);
    supabase
      .from("system_notes")
      .select("note")
      .eq("system_id", systemId)
      .maybeSingle()
      .then(({ data }) => {
        setNote(data?.note ?? "");
        setLoading(false);
      });
  }, [systemId]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [editing]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    const { error } = await supabase
      .from("system_notes")
      .upsert({ system_id: systemId, note: trimmed, updated_at: new Date().toISOString() }, { onConflict: "system_id" });

    if (error) {
      toast.error("儲存失敗");
      console.error(error);
    } else {
      setNote(trimmed);
      setEditing(false);
      toast.success("備註已更新");
    }
  };

  const startEdit = () => {
    setDraft(note);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  if (loading) return null;

  // Not in edit mode: show note if exists
  if (!isAdmin || !isEditMode) {
    if (!note) return null;
    return (
      <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{note}</p>
      </div>
    );
  }

  // Edit mode
  if (editing) {
    return (
      <div className="rounded-lg border border-primary/30 bg-muted/50 p-3">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          placeholder="輸入備註內容，例如：本頁已於 3/8 更新呼吸系統資料..."
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          rows={2}
        />
        <div className="mt-2 flex gap-2">
          <button onClick={handleSave} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            <Check className="h-3 w-3" /> 儲存
          </button>
          <button onClick={cancelEdit} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted">
            <X className="h-3 w-3" /> 取消
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={startEdit}
      className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/50"
    >
      <Pencil className="h-3.5 w-3.5 shrink-0" />
      {note || "點擊新增備註..."}
    </button>
  );
}
