import { motion } from "framer-motion";
import { AlertTriangle, Heart, Lightbulb, Sparkles } from "lucide-react";
import type { OrganSystem } from "@/data/organSystems";
import { CustomLinksSection } from "@/components/CustomLinksSection";
import { ExcelDownloadSection } from "@/components/ExcelDownloadSection";
import { VideoTableSection } from "@/components/VideoTableSection";

interface OrganSystemContentProps {
  system: OrganSystem;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function OrganSystemContent({ system }: OrganSystemContentProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={fadeUp} transition={{ delay: 0 }} className="relative overflow-hidden rounded-xl">
        <img
          src={system.image}
          alt={system.name}
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="font-display text-3xl font-bold">{system.name}</h1>
          <p className="text-sm text-muted-foreground">{system.nameEn}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {system.facts.map((fact, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 text-center transition-all hover:glow-border">
            <p className="stat-number text-2xl md:text-3xl">{fact.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{fact.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Description */}
      <motion.div variants={fadeUp} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 font-display text-xl font-bold">概述</h2>
        <p className="leading-relaxed text-secondary-foreground">{system.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {system.organs.map((organ) => (
            <span
              key={organ}
              className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {organ}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Function */}
      <motion.div variants={fadeUp} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold">系統功能</h2>
        </div>
        <p className="leading-relaxed text-secondary-foreground">{system.details.function}</p>
      </motion.div>

      {/* Common Diseases */}
      <motion.div variants={fadeUp} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-medical-amber" />
          <h2 className="font-display text-xl font-bold">常見疾病</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {system.details.commonDiseases.map((disease, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-1 font-semibold">{disease.name}</h3>
              <p className="text-sm text-muted-foreground">{disease.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Health Tips */}
      <motion.div variants={fadeUp} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-medical-green" />
          <h2 className="font-display text-xl font-bold">健康建議</h2>
        </div>
        <ul className="space-y-3">
          {system.details.healthTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-medical-green/10 text-xs font-bold text-medical-green">
                {i + 1}
              </span>
              <span className="text-secondary-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Fun Facts */}
      <motion.div variants={fadeUp} transition={{ delay: 0.35 }} className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-medical-cyan" />
          <h2 className="font-display text-xl font-bold">趣味小知識</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {system.details.funFacts.map((fact, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/5 p-3">
              <span className="text-lg">💡</span>
              <p className="text-sm text-secondary-foreground">{fact}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Video Table (logged-in only) */}
      <VideoTableSection systemId={system.id} />

      {/* Excel Download (logged-in only) */}
      <ExcelDownloadSection systemId={system.id} />

      {/* Custom Links */}
      <CustomLinksSection systemId={system.id} />
    </motion.div>
  );
}
