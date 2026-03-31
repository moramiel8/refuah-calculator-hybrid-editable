import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "@/features/auth";
import { LockKeyhole, ShieldCheck } from "lucide-react";

interface BetaAccessScreenProps {
  email?: string | null;
}

const BetaAccessScreen: React.FC<BetaAccessScreenProps> = ({ email }) => {
  const logoutMutation = useLogout();
  const isLoggedIn = Boolean(email);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(241,245,249,0.96))]" />
      <div className="absolute right-[-100px] top-[-80px] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[-120px] left-[-120px] h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/80 bg-white/90 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="border-b border-border/70 px-8 py-6 text-right">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            מצב בטא סגור
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">הגישה לאתר מוגבלת כרגע</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            גרסת הטסטינג פתוחה רק למשתמשים שמחוברים עם כתובת מייל שאושרה מראש. כל שאר הדפים חסומים עד התחברות עם משתמש מורשה.
          </p>
        </div>

        <div className="grid gap-6 px-8 py-7 md:grid-cols-[1.2fr_0.8fr]" dir="rtl">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-6 text-right">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isLoggedIn ? "המשתמש הזה עדיין לא מורשה" : "צריך להתחבר עם משתמש בטא"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {isLoggedIn
                ? "התחברת בהצלחה, אבל כתובת המייל הזו עדיין לא נמצאת ברשימת הגישה לגרסת הטסטינג."
                : "כדי להיכנס, יש להתחבר או להירשם עם כתובת מייל שנמצאת ברשימת המשתמשים המורשים לבטא."}
            </p>

            {email && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800">
                מחובר/ת בתור <span className="font-semibold">{email}</span>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    התחברות
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                  >
                    הרשמה
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  התנתקות
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[28px] bg-slate-900 px-6 py-6 text-right text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/80">Closed Beta</p>
              <h3 className="mt-3 text-2xl font-bold">רק למיילים שאושרו</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                אם תרצה לפתוח גישה למישהו, מספיק להוסיף את כתובת המייל שלו לרשימת ההרשאות של הבטא ולפרוס את הפרונט.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-200">
              {isLoggedIn
                ? "אם זה המייל הנכון, צריך להוסיף אותו ל־allowlist. אחרי רענון, הגישה תיפתח."
                : "אם אתה בודק מורשה, התחבר עם המייל שאושר עבורך מראש."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaAccessScreen;
