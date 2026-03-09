import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type AuthMode = "login" | "signup" | "forgot";

interface EmailAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailAuthDialog({ open, onOpenChange }: EmailAuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("請輸入電子郵件和密碼");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("電子郵件或密碼錯誤");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("請先到信箱驗證您的電子郵件");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("登入成功！");
        resetForm();
        onOpenChange(false);
      }
    } catch (e) {
      toast.error("登入失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      toast.error("請輸入電子郵件和密碼");
      return;
    }
    if (password.length < 6) {
      toast.error("密碼至少需要 6 個字元");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("註冊成功！請到信箱驗證您的電子郵件。");
        resetForm();
        setMode("login");
      }
    } catch (e) {
      toast.error("註冊失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("請輸入您的電子郵件");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("已發送密碼重設信件，請查看您的信箱。");
      }
    } catch (e) {
      toast.error("發送失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") handleLogin();
    else if (mode === "signup") handleSignup();
    else handleForgotPassword();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-display">
            {mode === "login" && "電子郵件登入"}
            {mode === "signup" && "建立新帳號"}
            {mode === "forgot" && "忘記密碼"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="電子郵件 (Yahoo、Hotmail 等皆可)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              autoComplete="email"
            />
          </div>

          {mode !== "forgot" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="密碼（至少 6 個字元）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "處理中..."
              : mode === "login"
              ? "登入"
              : mode === "signup"
              ? "註冊"
              : "發送重設信件"}
          </Button>

          <div className="flex flex-col items-center gap-2 text-sm">
            {mode === "login" && (
              <>
                <button
                  type="button"
                  onClick={() => { resetForm(); setMode("forgot"); }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  忘記密碼？
                </button>
                <button
                  type="button"
                  onClick={() => { resetForm(); setMode("signup"); }}
                  className="text-primary hover:underline"
                >
                  還沒有帳號？立即註冊
                </button>
              </>
            )}
            {mode === "signup" && (
              <button
                type="button"
                onClick={() => { resetForm(); setMode("login"); }}
                className="text-primary hover:underline"
              >
                已有帳號？返回登入
              </button>
            )}
            {mode === "forgot" && (
              <button
                type="button"
                onClick={() => { resetForm(); setMode("login"); }}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <ArrowLeft className="h-3 w-3" /> 返回登入
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
