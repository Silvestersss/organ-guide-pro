import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, ExternalLink, Play, Video } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PUBLISHED_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTh6UyfZsLBAffnGuqu2mK3tE3l3gprKU9P4VpRHXD4HcvDD0VpolqM0T8kCrfycsEHli9rC9-hi7si/pub";

const SYSTEM_GIDS: Record<string, string> = {
  respiratory: "0",
  circulatory: "1352104618",
  digestive: "286972187",
  nervous: "1148795897",
  urinary: "1049521290",
};

const SPREADSHEET_ID = "1WSzVYnLnq3VCXAUvFxYUlNAT2YOxHAqkpt_L-pQP0F8";

function getViewUrl(gid: string) {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${gid}#gid=${gid}`;
}

/** Extract a readable title from a filename or path */
function extractTitle(raw: string): string {
  // Remove path prefix
  let name = raw.replace(/^.*[\\/]/, "");
  // Remove file extension
  name = name.replace(/\.mp4$/i, "");
  // Remove trailing hash codes like ____xxxxxxxx
  name = name.replace(/____[a-f0-9]+$/i, "");
  // Clean up
  name = name.trim();
  return name || raw;
}

/** Check if a string looks like a playable URL */
function isPlayableUrl(raw: string): boolean {
  return raw.startsWith("http://") || raw.startsWith("https://");
}

/** Convert Google Drive share link to embeddable preview URL */
function toEmbedUrl(url: string): string {
  // https://drive.google.com/file/d/FILE_ID/view → preview
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

interface VideoEntry {
  title: string;
  rawUrl: string;
  playable: boolean;
}

function parseCSV(csv: string): VideoEntry[] {
  const lines = csv.split("\n").filter((l) => l.trim());
  return lines.map((line) => {
    // Remove surrounding quotes
    let raw = line.trim().replace(/^"+|"+$/g, "").trim();
    const playable = isPlayableUrl(raw);
    const title = extractTitle(raw);
    return { title, rawUrl: raw, playable };
  });
}

interface VideoTableSectionProps {
  systemId: string;
}

export function VideoTableSection({ systemId }: VideoTableSectionProps) {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<VideoEntry | null>(null);

  const gid = SYSTEM_GIDS[systemId];

  useEffect(() => {
    if (!user || !gid) return;

    setLoading(true);
    setError(null);

    const url = `${PUBLISHED_BASE}?gid=${gid}&single=true&output=csv`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("無法載入資料");
        return res.text();
      })
      .then((csv) => {
        const entries = parseCSV(csv);
        setVideos(entries);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, gid]);

  if (!user || !gid) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">教學影片</h2>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href={getViewUrl(gid)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              線上檢視完整資料
            </a>
          </Button>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">載入中...</p>
        )}
        {error && (
          <p className="text-sm text-destructive">載入失敗：{error}</p>
        )}

        {!loading && !error && videos.length === 0 && (
          <p className="text-sm text-muted-foreground">暫無影片資料</p>
        )}

        {!loading && !error && videos.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>影片標題</TableHead>
                <TableHead className="w-24 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video, i) => (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell className="text-right">
                    {video.playable ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPlayingVideo(video)}
                      >
                        <Play className="h-4 w-4" />
                        播放
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        待上傳
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* Video Player Dialog */}
      <Dialog
        open={!!playingVideo}
        onOpenChange={(open) => !open && setPlayingVideo(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{playingVideo?.title}</DialogTitle>
          </DialogHeader>
          {playingVideo && (
            <div className="aspect-video w-full">
              <iframe
                src={toEmbedUrl(playingVideo.rawUrl)}
                className="h-full w-full rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
