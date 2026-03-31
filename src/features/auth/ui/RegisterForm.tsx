import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRegister, useAuthStore } from "@/features/auth";
import { FormInput, Loadbar, PasswordInput } from "@/shared/ui";
import { USERNAME_ALLOWED_REGEX, normalizeUsernameInput, USERNAME_MAX_LENGTH } from "../lib/username";
import { useBaseData, useBaseDataStore } from "@/entities/baseData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NAME_REGEX = /^[\u0590-\u05FFa-zA-Z\s]+$/;

const RegisterForm: React.FC = () => {
  useBaseData();
  const paths = useBaseDataStore((s) => s.paths);
  const universities = useBaseDataStore((s) => s.universities);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    newPassword: "",
    isStudent: false,
  });
  const [candidateEnabled, setCandidateEnabled] = useState(true);
  const [candidateValues, setCandidateValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [googleLoading, setGoogleLoading] = useState(false);

  const registerMutation = useRegister();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "newPassword" && value.length > 64) return;
    const nextValue = name === "username" ? normalizeUsernameInput(value) : value;
    setValues((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCandidateChange = (key: string, value: string) => {
    setCandidateValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const selectedPathId = candidateValues.path || "";
  const uniMatchesPath = (uni: any, pid: string) => {
    const pathIds = Array.isArray(uni.path_ids) ? (uni.path_ids as string[]) : [];
    if (pathIds.length > 0) return pathIds.includes(pid);
    return !uni.path_id || uni.path_id === pid;
  };
  const visibleUniversities = selectedPathId
    ? universities.filter((uni: any) => uniMatchesPath(uni, selectedPathId))
    : universities;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        setErrors({ email: "שגיאה בהרשמה עם Google" });
      }
    } catch {
      setErrors({ email: "שגיאה בהרשמה עם Google" });
    }
    setGoogleLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!values.firstName.trim()) newErrors.firstName = "שדה חובה";
    else if (values.firstName.trim().length < 2) newErrors.firstName = "שם חייב להכיל לפחות 2 תווים";
    else if (!NAME_REGEX.test(values.firstName.trim())) newErrors.firstName = "שם יכול להכיל רק אותיות בעברית או באנגלית";

    if (!values.lastName.trim()) newErrors.lastName = "שדה חובה";
    else if (values.lastName.trim().length < 2) newErrors.lastName = "שם משפחה חייב להכיל לפחות 2 תווים";
    else if (!NAME_REGEX.test(values.lastName.trim())) newErrors.lastName = "שם משפחה יכול להכיל רק אותיות בעברית או באנגלית";

    if (values.username && !USERNAME_ALLOWED_REGEX.test(values.username)) {
      newErrors.username = "שם משתמש יכול להכיל רק אותיות, מספרים, נקודה וקו תחתון";
    }
    if (!values.email) newErrors.email = "שדה חובה";
    if (!values.newPassword) newErrors.newPassword = "שדה חובה";
    if (values.newPassword.length < 6) newErrors.newPassword = "סיסמה חייבת להכיל לפחות 6 תווים";

    if (candidateEnabled) {
      const psychometric = candidateValues.psychometric?.trim();
      const psychometricValue = psychometric ? Number(psychometric) : null;

      if (psychometric && (Number.isNaN(psychometricValue) || psychometricValue < 200 || psychometricValue > 800)) {
        newErrors.psychometric = "ציון פסיכומטרי חייב להיות בין 200 ל-800";
      }

      for (const uni of visibleUniversities) {
        const key = `bagrut_${uni._id}`;
        const bagrut = candidateValues[key]?.trim();
        if (!bagrut) continue;
        const bagrutValue = Number(bagrut);
        if (Number.isNaN(bagrutValue) || bagrutValue < 80 || bagrutValue > 127) {
          newErrors[key] = `ממוצע בגרות ל${uni.name} חייב להיות בין 80 ל-127`;
        }
      }
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const candidateData = candidateEnabled
        ? Object.fromEntries(
            Object.entries(candidateValues).filter(([, value]) => value.trim() !== "")
          )
        : undefined;

      const authData = await registerMutation.mutateAsync({
        ...values,
        candidateData,
      });
      if (!authData.session) {
        toast.success("החשבון נוצר. צריך לאשר את המייל לפני שמתחברים.");
        navigate("/login", {
          state: {
            referrer: "/profile/userdata",
            emailHint: values.email,
          },
        });
        return;
      }

      navigate("/profile/userdata");
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message || "שגיאה בהרשמה";
      setErrors({ email: message });
    }
  };

  if (isAuthenticated) {
    const referrer = (location.state as { referrer?: string })?.referrer;
    navigate(referrer || "/");
    return null;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-3xl rounded-[32px] border border-border/70 bg-card/95 p-6 shadow-[0_30px_80px_-35px_rgba(30,64,175,0.35)] backdrop-blur md:p-8">
        <div className="mb-8 rounded-[28px] border border-primary/10 bg-gradient-to-l from-primary/10 via-background to-background p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">הרשמה חדשה</span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">הפרופיל נפתח מיד בסיום</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-primary">בואו נפתח לך פרופיל כמו שצריך</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            קודם פרטי משתמש, ואז אפשר להשלים כבר עכשיו גם נתוני מועמדות כדי להתחיל עם פרופיל מוכן.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {googleLoading ? "מעביר ל-Google..." : "הרשמה עם Google"}
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">או הרשמה ידנית</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6 rounded-[26px] border border-border/70 bg-background p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">1</div>
              <div>
                <h2 className="text-base font-semibold text-foreground">פרטי החשבון שלך</h2>
                <p className="text-xs text-muted-foreground">השלב הבסיסי לפתיחת המשתמש.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInput type="text" label="שם" name="firstName" value={values.firstName} onChange={handleChange} error={errors.firstName} limit="20" />
              <FormInput type="text" label="שם משפחה" name="lastName" value={values.lastName} onChange={handleChange} error={errors.lastName} limit="20" />
              <div className="md:col-span-2">
                <FormInput type="text" label="שם משתמש (לא חובה)" name="username" value={values.username} onChange={handleChange} error={errors.username} limit={String(USERNAME_MAX_LENGTH)} />
                <p className="-mt-3 mb-1 text-[11px] text-muted-foreground">אם לא תמלא שם משתמש, ניצור אותו אוטומטית מהשם המלא ללא רווחים.</p>
              </div>
              <FormInput type="email" label="דואר אלקטרוני" name="email" value={values.email} onChange={handleChange} error={errors.email} />
              <PasswordInput
                label="סיסמה"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                showStrength
              />
            </div>
          </div>

          <div className="mb-6 rounded-[26px] border border-primary/15 bg-gradient-to-b from-primary/[0.06] via-background to-background p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/12 text-sm font-bold text-primary">2</div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">נתוני מועמדות</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    שלב אופציונלי, אבל שווה. ככה הפרופיל שלך ייפתח כבר עם הנתונים החשובים.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCandidateEnabled(true)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    candidateEnabled
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  כן, להוסיף עכשיו
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCandidateEnabled(false);
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.psychometric;
                      for (const key of Object.keys(next)) {
                        if (key.startsWith("bagrut_")) delete next[key];
                      }
                      return next;
                    });
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    !candidateEnabled
                      ? "bg-slate-800 text-white shadow-sm"
                      : "border border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  עדיין אין לי
                </button>
              </div>
            </div>

            {candidateEnabled ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-primary/10 bg-background/90 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">אופציונלי</span>
                    <span className="text-xs text-muted-foreground">אפשר למלא רק את מה שכבר יש לך</span>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">מסלול</label>
                    <select
                      value={candidateValues.path || ""}
                      onChange={(e) => handleCandidateChange("path", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="">אפשר גם להחליט אחר כך</option>
                      {paths.map((path) => (
                        <option key={path._id} value={path._id}>
                          {path.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-background/90 p-4">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">פסיכומטרי</label>
                    <input
                      type="number"
                      min={200}
                      max={800}
                      value={candidateValues.psychometric || ""}
                      onChange={(e) => handleCandidateChange("psychometric", e.target.value)}
                      placeholder="200-800"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                    <p className="mt-2 text-[11px] text-muted-foreground">אפשר להשאיר ריק אם עדיין אין ציון.</p>
                    {errors.psychometric && <p className="mt-1.5 text-xs text-destructive">{errors.psychometric}</p>}
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/90 p-4">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">מו״ר / מרק״ם</label>
                    <input
                      type="text"
                      value={candidateValues.mor || ""}
                      onChange={(e) => handleCandidateChange("mor", e.target.value)}
                      placeholder="אם כבר יש לך"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                    <p className="mt-2 text-[11px] text-muted-foreground">גם את זה אפשר להשלים אחר כך.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/90 p-4">
                  <p className="mb-2 text-sm font-medium text-foreground">ממוצע בגרות לפי אוניברסיטה</p>
                  <p className="mb-4 text-xs text-muted-foreground">כל אוניברסיטה מחשבת קצת אחרת, אז אפשר למלא רק מה שכבר חישבת.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {visibleUniversities.map((uni) => {
                      const key = `bagrut_${uni._id}`;
                      return (
                        <div key={uni._id} className="rounded-2xl border border-border/60 bg-muted/15 p-3">
                          <label className="mb-1.5 block text-xs font-semibold text-foreground">{uni.name}</label>
                          <input
                            type="number"
                            min={80}
                            max={127}
                            step="0.01"
                            value={candidateValues[key] || ""}
                            onChange={(e) => handleCandidateChange(key, e.target.value)}
                            placeholder="80-127"
                            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                          />
                          {errors[key] && <p className="mt-1.5 text-xs text-destructive">{errors[key]}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-background/80 p-4">
                <p className="text-sm text-muted-foreground">
                  אין בעיה. נפתח לכם עכשיו את המשתמש, ותוכלו להשלים את כל הנתונים אחר כך מתוך הפרופיל האישי.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              הרשמה ופתיחת פרופיל
            </button>
            {registerMutation.isPending && <Loadbar small />}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            כבר יש לך משתמש?{" "}
            <Link className="font-medium text-primary hover:underline" to="/login" state={location.state}>
              להתחברות
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
