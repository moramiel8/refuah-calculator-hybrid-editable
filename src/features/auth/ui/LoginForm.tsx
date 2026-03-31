import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { supabase } from "@/integrations/supabase/client";
import { FormInput, Loadbar, PasswordInput } from "@/shared/ui";
import { toast } from "sonner";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginForm: React.FC = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownWelcome = React.useRef(false);

  const getReferrer = () => (location.state as { referrer?: string })?.referrer || "/";

  useEffect(() => {
    if (isAuthenticated) {
      if (!hasShownWelcome.current && user?.firstName) {
        toast.success(`ברוכים הבאים, ${user.firstName}!`);
        hasShownWelcome.current = true;
      }
      navigate(getReferrer(), { replace: true });
    }
  }, [isAuthenticated, user?.firstName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password" && value.length > 64) return;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!values.email) newErrors.email = "שדה חובה";
    if (!values.password) newErrors.password = "שדה חובה";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setLoading(false);

    if (error) {
      setErrors({ email: error.message });
      return;
    }
  };

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
        setErrors({ email: "שגיאה בהתחברות עם Google" });
      }
    } catch {
      setErrors({ email: "שגיאה בהתחברות עם Google" });
    }
    setGoogleLoading(false);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-primary">התחברות</h1>
        <p className="mb-6 text-center text-xs text-muted-foreground">מועמדים לרפואה בישראל</p>

        {/* Google Sign In - direct, no intermediate modal */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {googleLoading ? "מתחבר..." : "התחברות עם Google"}
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">או</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            type="email"
            label="דואר אלקטרוני"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />
          <PasswordInput
            label="סיסמה"
            name="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />

          <button
            type="button"
            className="mb-4 text-sm text-primary hover:underline"
            onClick={() => setShowForgot(true)}
          >
            שכחתי את הסיסמה
          </button>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              התחברות
            </button>
            {loading && <Loadbar small />}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            עדיין אין משתמש?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              to={{ pathname: "/register" }}
              state={location.state}
            >
              להרשמה
            </Link>
          </p>
        </form>
      </div>

      <ForgotPasswordModal display={showForgot} toggleModal={setShowForgot} />
    </div>
  );
};

export default LoginForm;
