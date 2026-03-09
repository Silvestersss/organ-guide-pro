import { useState } from "react";
import { LogIn, LogOut, Pencil, PencilOff, Eye, EyeOff, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { EmailAuthDialog } from "@/components/EmailAuthDialog";
import { toast } from "sonner";

export function AuthButton() {
  const { user, isAdmin, isEditMode, setEditMode, isPreviewingAsMember, setPreviewingAsMember, signOut, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast.error("登入失敗");
        console.error(error);
      }
    } catch (e) {
      toast.error("登入失敗");
      console.error(e);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("已登出");
  };

  if (loading) return null;

  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={signingIn}
            className="gap-2"
          >
            <LogIn className="h-4 w-4" />
            {signingIn ? "登入中..." : "Google 登入"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEmailDialogOpen(true)}
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            Email 登入
          </Button>
        </div>
        <EmailAuthDialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen} />
      </>
    );
  }

  const ADMIN_EMAILS = ["leezhixing117@gmail.com", "amypy117@gmail.com", "worksmartstyle@gmail.com"];
  const isRealAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);

  return (
    <div className="flex items-center gap-2">
      {isRealAdmin && (
        <Button
          size="sm"
          variant={isPreviewingAsMember ? "secondary" : "outline"}
          onClick={() => {
            setPreviewingAsMember(!isPreviewingAsMember);
            if (!isPreviewingAsMember) setEditMode(false);
          }}
          className="gap-1.5"
        >
          {isPreviewingAsMember ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {isPreviewingAsMember ? "返回管理員" : "會員視角"}
        </Button>
      )}
      {isAdmin && (
        <Button
          size="sm"
          variant={isEditMode ? "default" : "outline"}
          onClick={() => setEditMode(!isEditMode)}
          className="gap-1.5"
        >
          {isEditMode ? <PencilOff className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          {isEditMode ? "退出編輯" : "編輯模式"}
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={handleSignOut} className="gap-1.5 text-muted-foreground">
        <LogOut className="h-4 w-4" />
        登出
      </Button>
    </div>
  );
}