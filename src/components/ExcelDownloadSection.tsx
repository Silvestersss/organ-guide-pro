import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const SYSTEM_FOLDERS: Record<string, { folderId: string; label: string }> = {
  respiratory: { folderId: "18VjBffBCLCeB23dAoS1l3lDBYgG2CoCe", label: "呼吸系統" },
  circulatory: { folderId: "1wE5wp8Y8IKiYyZjxIb9RHLTxTEvzECZj", label: "循環系統" },
  digestive: { folderId: "1CeKHYcTjdSrfphAThOwG7HoTqCBH1eT0", label: "消化系統" },
  nervous: { folderId: "1hn7QMZWCMlCfk8k1MbcnG0j4flrnqOT0", label: "神經系統" },
  urinary: { folderId: "1KBrXy-dKE7WKsGbu8oEjF8gJvHd7MNhN", label: "排泄與泌尿系統" },
};

interface ExcelDownloadSectionProps {
  systemId: string;
}

export function ExcelDownloadSection({ systemId }: ExcelDownloadSectionProps) {
  const { user } = useAuth();
  const folder = SYSTEM_FOLDERS[systemId];

  if (!user || !folder) return null;

  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folder.folderId}#list`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Video className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">知識影片</h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <iframe
          src={embedUrl}
          className="w-full bg-background"
          style={{ height: "300px", border: "none" }}
          title={`${folder.label}影片列表`}
          allow="autoplay"
        />
      </div>
    </motion.div>
  );
}
