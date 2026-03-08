import { motion } from "framer-motion";
import { Video, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const SPREADSHEET_ID = "1WSzVYnLnq3VCXAUvFxYUlNAT2YOxHAqkpt_L-pQP0F8";

const SYSTEM_FOLDERS: Record<string, { url: string; label: string }> = {
  respiratory: { url: "https://drive.google.com/drive/folders/18VjBffBCLCeB23dAoS1l3lDBYgG2CoCe", label: "呼吸系統" },
  circulatory: { url: "https://drive.google.com/drive/folders/1wE5wp8Y8IKiYyZjxIb9RHLTxTEvzECZj", label: "循環系統" },
  digestive: { url: "https://drive.google.com/drive/folders/1CeKHYcTjdSrfphAThOwG7HoTqCBH1eT0", label: "消化系統" },
  nervous: { url: "https://drive.google.com/drive/folders/1hn7QMZWCMlCfk8k1MbcnG0j4flrnqOT0", label: "神經系統" },
  urinary: { url: "https://drive.google.com/drive/folders/1KBrXy-dKE7WKsGbu8oEjF8gJvHd7MNhN", label: "排泄與泌尿系統" },
};

function getViewUrl(gid: string) {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${gid}#gid=${gid}`;
}

interface ExcelDownloadSectionProps {
  systemId: string;
}

export function ExcelDownloadSection({ systemId }: ExcelDownloadSectionProps) {
  const { user } = useAuth();
  const sheet = SYSTEM_SHEETS[systemId];

  if (!user || !sheet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold">知識影片</h2>
        </div>
        <a
          href={getViewUrl(sheet.gid)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          觀看影片列表
        </a>
      </div>
    </motion.div>
  );
}
