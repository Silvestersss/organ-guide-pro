import { motion } from "framer-motion";
import { Video, ExternalLink, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import respiratoryImg from "@/assets/respiratory.jpg";
import circulatoryImg from "@/assets/circulatory.jpg";
import digestiveImg from "@/assets/digestive.jpg";
import nervousImg from "@/assets/nervous.jpg";
import urinaryImg from "@/assets/urinary.jpg";

const SYSTEM_FOLDERS: Record<string, { url: string; label: string; videoCount: number; thumbnail: string }> = {
  respiratory: { url: "https://drive.google.com/drive/folders/18VjBffBCLCeB23dAoS1l3lDBYgG2CoCe", label: "呼吸系統", videoCount: 5, thumbnail: respiratoryImg },
  circulatory: { url: "https://drive.google.com/drive/folders/1wE5wp8Y8IKiYyZjxIb9RHLTxTEvzECZj", label: "循環系統", videoCount: 5, thumbnail: circulatoryImg },
  digestive: { url: "https://drive.google.com/drive/folders/1CeKHYcTjdSrfphAThOwG7HoTqCBH1eT0", label: "消化系統", videoCount: 5, thumbnail: digestiveImg },
  nervous: { url: "https://drive.google.com/drive/folders/1hn7QMZWCMlCfk8k1MbcnG0j4flrnqOT0", label: "神經系統", videoCount: 5, thumbnail: nervousImg },
  urinary: { url: "https://drive.google.com/drive/folders/1KBrXy-dKE7WKsGbu8oEjF8gJvHd7MNhN", label: "排泄與泌尿系統", videoCount: 5, thumbnail: urinaryImg },
};

interface ExcelDownloadSectionProps {
  systemId: string;
}

export function ExcelDownloadSection({ systemId }: ExcelDownloadSectionProps) {
  const { user } = useAuth();
  const folder = SYSTEM_FOLDERS[systemId];

  if (!user || !folder) return null;

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
          <h2 className="font-display text-xl font-bold">知識影片</h2>
          <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            共 {folder.videoCount} 部
          </span>
        </div>
        <a
          href={folder.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          觀看全部
        </a>
      </div>

      <a
        href={folder.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-lg"
      >
        <img
          src={folder.thumbnail}
          alt={`${folder.label}知識影片`}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
            <Play className="h-7 w-7 fill-current" />
          </div>
        </div>
      </a>
    </motion.div>
  );
}
