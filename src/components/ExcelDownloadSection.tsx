import { motion } from "framer-motion";
import { Video, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const SPREADSHEET_ID = "1WSzVYnLnq3VCXAUvFxYUlNAT2YOxHAqkpt_L-pQP0F8";

const SYSTEM_SHEETS: Record<string, { gid: string; label: string }> = {
  respiratory: { gid: "0", label: "呼吸系統" },
  circulatory: { gid: "1352104618", label: "循環系統" },
  digestive: { gid: "286972187", label: "消化系統" },
  nervous: { gid: "1148795897", label: "神經系統" },
  urinary: { gid: "1049521290", label: "排泄與泌尿系統" },
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
