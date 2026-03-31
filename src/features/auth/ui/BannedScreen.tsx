import React from "react";
import { Ban } from "lucide-react";
import { useLogout } from "@/features/auth";
import { Button } from "@/components/ui/button";

const BannedScreen: React.FC = () => {
  const logout = useLogout();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4" dir="rtl">
      <div className="mx-auto max-w-md text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <Ban className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">החשבון שלך נחסם</h1>
        <p className="text-muted-foreground">ניתן ליצור איתנו קשר במייל הבא:</p>

        <div className="flex justify-center">
          <a
            href="mailto:support@refuah.io"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <span className="transition-transform group-hover:scale-110">📧</span>
            support@refuah.io
          </a>
        </div>
        <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
          התנתקות
        </Button>
      </div>
    </div>
  );
};

export default BannedScreen;
