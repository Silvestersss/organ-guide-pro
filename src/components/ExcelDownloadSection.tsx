import { motion } from "framer-motion";
import { FileSpreadsheet, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SPREADSHEET_ID = "1WSzVYnLnq3VCXAUvFxYUlNAT2YOxHAqkpt_L-pQP0F8";

const SYSTEM_SHEETS: Record<string, { gid: string; label: string }> = {
  respiratory: { gid: "0", label: "呼吸系統 學習資料" },
  circulatory: { gid: "1352104618", label: "循環系統 學習資料" },
  digestive: { gid: "286972187", label: "消化系統 學習資料" },
  nervous: { gid: "1148795897", label: "神經系統 學習資料" },
  urinary: { gid: "1049521290", label: "排泄與泌尿系統 學習資料" },
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
      <div className="mb-4 flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-medical-green" />
        <h2 className="font-display text-xl font-bold">學習資料</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>標題</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{sheet.label}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" asChild>
                <a href={getViewUrl(sheet.gid)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  線上檢視
                </a>
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </motion.div>
  );
}
