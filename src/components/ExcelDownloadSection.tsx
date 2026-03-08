import { motion } from "framer-motion";
import { Video, Play } from "lucide-react";

interface VideoItem {
  title: string;
  fileId: string;
}

const SYSTEM_VIDEOS: Record<string, { label: string; videos: VideoItem[] }> = {
  respiratory: {
    label: "呼吸系統",
    videos: [
      { title: "肩周炎、肩袖損傷、Slap損傷到底是怎麼回事？", fileId: "" },
      { title: "過敏性鼻炎為什麼拖著拖著？", fileId: "" },
    ],
  },
  circulatory: {
    label: "循環系統",
    videos: [
      { title: "90%的腰疼都不是腰突", fileId: "" },
    ],
  },
  digestive: {
    label: "消化系統",
    videos: [
      { title: "胃炎到底是哪裡出問題了？", fileId: "" },
    ],
  },
  nervous: {
    label: "神經系統",
    videos: [
      { title: "頭疼得想撞牆", fileId: "" },
      { title: "女性下腹痛", fileId: "" },
    ],
  },
  urinary: {
    label: "排泄與泌尿系統",
    videos: [],
  },
};

const FOLDER_URLS: Record<string, string> = {
  respiratory: "https://drive.google.com/drive/folders/18VjBffBCLCeB23dAoS1l3lDBYgG2CoCe",
  circulatory: "https://drive.google.com/drive/folders/1wE5wp8Y8IKiYyZjxIb9RHLTxTEvzECZj",
  digestive: "https://drive.google.com/drive/folders/1CeKHYcTjdSrfphAThOwG7HoTqCBH1eT0",
  nervous: "https://drive.google.com/drive/folders/1hn7QMZWCMlCfk8k1MbcnG0j4flrnqOT0",
  urinary: "https://drive.google.com/drive/folders/1KBrXy-dKE7WKsGbu8oEjF8gJvHd7MNhN",
};

interface ExcelDownloadSectionProps {
  systemId: string;
}

export function ExcelDownloadSection({ systemId }: ExcelDownloadSectionProps) {
  const system = SYSTEM_VIDEOS[systemId];
  const folderUrl = FOLDER_URLS[systemId];

  if (!system) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Video className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold text-foreground">知識影片</h2>
      </div>

      {system.videos.length > 0 ? (
        <ul className="space-y-2">
          {system.videos.map((video, index) => (
            <li key={index}>
              <a
                href={folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <Play className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{video.title}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">尚未新增影片</p>
      )}
    </motion.div>
  );
}
