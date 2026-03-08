import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Heart, Shield, Activity, Sparkles, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-anatomy.jpg";

const stats = [
  { value: "5", label: "大器官系統", icon: Activity },
  { value: "20+", label: "常見疾病知識", icon: Shield },
  { value: "50+", label: "健康建議", icon: BookOpen },
  { value: "∞", label: "趣味知識", icon: Sparkles },
];

const features = [
  {
    icon: Brain,
    title: "深度解析",
    description: "每個器官系統均包含詳細的生理構造說明、功能介紹和專業數據。",
  },
  {
    icon: Heart,
    title: "健康知識",
    description: "了解常見疾病的成因和症狀，掌握科學的預防和保健方法。",
  },
  {
    icon: Shield,
    title: "會員專屬",
    description: "密碼保護的專屬內容，確保優質的學習體驗和知識分享。",
  },
  {
    icon: Users,
    title: "專業數據",
    description: "豐富的醫學數據和統計資料，以直觀的方式呈現人體的奧妙。",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Human anatomy" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        <div className="container relative z-10 mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>IU 健康百科 — 專業醫學知識平台</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
              探索人體的
              <br />
              <span className="text-gradient-teal">奧妙世界</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              深入了解人體五大器官系統，從呼吸到神經，掌握全面的生理知識和健康資訊。以專業數據和精美視覺化呈現人體構造。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="h-14 gap-2 rounded-xl px-8 text-base font-semibold"
              >
                開始探索
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-14 rounded-xl px-8 text-base font-semibold"
              >
                了解更多
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                <p className="stat-number">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              為什麼選擇 <span className="text-gradient-teal">IU 健康百科</span>？
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              結合專業醫學知識與現代化設計，讓學習人體知識變得輕鬆有趣
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:glow-border"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-hero p-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              準備好探索人體了嗎？
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              立即登入，開啟你的人體知識之旅
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="mt-8 h-14 gap-2 rounded-xl px-10 text-base font-semibold"
            >
              立即開始
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 IU 健康百科 — 專業人體器官知識平台</p>
          <a
            href="https://www.instagram.com/ai.mbti/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-primary transition-colors hover:underline"
          >
            追蹤我們的 Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}
