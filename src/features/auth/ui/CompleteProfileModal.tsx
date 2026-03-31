import React, { useState } from "react";
import { useAuthStore, useEditUser } from "@/features/auth";
import { toast } from "sonner";
import {
  buildUsernameFromName,
  USERNAME_ALLOWED_REGEX,
  normalizeUsernameInput,
  USERNAME_MAX_LENGTH,
} from "../lib/username";

const NAME_REGEX = /^[\u0590-\u05FFa-zA-Z\s]+$/;

function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) return "שם חייב להכיל לפחות 2 תווים";
  if (!NAME_REGEX.test(trimmed)) return "שם יכול להכיל רק אותיות בעברית או באנגלית";
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2 || !parts[1]) return "יש להזין שם פרטי ושם משפחה";
  if (parts[0].length < 2) return "שם פרטי חייב להכיל לפחות 2 תווים";
  if (parts[parts.length - 1].length < 2) return "שם משפחה חייב להכיל לפחות 2 תווים";
  return null;
}

const CompleteProfileModal: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const editUser = useEditUser();
  const [fullName, setFullName] = useState(() => `${user?.firstName || ""} ${user?.lastName || ""}`.trim());
  const [username, setUsername] = useState(() => user?.username || "");
  const [errors, setErrors] = useState<{ name?: string; username?: string }>({});

  const needsName =
    isAuthenticated &&
    user &&
    (!user.firstName?.trim() || !user.lastName?.trim() || !user.username?.trim());

  if (!needsName) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; username?: string } = {};
    const trimmed = fullName.trim();
    const parts = trimmed.split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ");

    const nameError = validateName(fullName);
    if (nameError) newErrors.name = nameError;

    const trimmedUsername = normalizeUsernameInput(username) || buildUsernameFromName(firstName, lastName);
    if (!trimmedUsername) {
      newErrors.username = "לא הצלחנו לייצר שם משתמש. אפשר לכתוב אחד ידנית.";
    } else if (!USERNAME_ALLOWED_REGEX.test(trimmedUsername)) {
      newErrors.username = "שם משתמש יכול להכיל רק אותיות, מספרים, נקודה וקו תחתון";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      await editUser.mutateAsync({
        first_name: firstName,
        last_name: lastName,
        username: trimmedUsername,
      });
      toast.success("הפרופיל עודכן בהצלחה");
    } catch (error) {
      const message = error instanceof Error ? error.message : "שגיאה בשמירה, נסה שוב";
      if (message.includes("שם המשתמש כבר קיים")) {
        setErrors({ username: message });
        return;
      }
      setErrors({ name: message });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg animate-slide-up">
        <h2 className="mb-2 text-center text-xl font-bold text-foreground">
          היי! ברוכים הבאים
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          שנכיר קצת יותר? מלאו את הפרטים הבאים
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              שם מלא
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="שם פרטי ושם משפחה"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary"
              autoFocus
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>
            )}
            <p className="mt-1 text-[10px] text-muted-foreground">אותיות בעברית או באנגלית בלבד, לפחות 2 תווים לכל שם</p>
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              שם משתמש
            </label>
            <input
              type="text"
              value={username}
              maxLength={USERNAME_MAX_LENGTH}
              onChange={(e) => {
                setUsername(normalizeUsernameInput(e.target.value));
                setErrors((prev) => ({ ...prev, username: undefined }));
              }}
              placeholder={buildUsernameFromName(user?.firstName || "", user?.lastName || "") || "username"}
              dir="ltr"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary"
            />
            {errors.username && (
              <p className="mt-1.5 text-xs text-destructive">{errors.username}</p>
            )}
            <p className="mt-1 text-[10px] text-muted-foreground">אם תשאיר ריק, ניצור שם משתמש אוטומטי מהשם המלא ללא רווחים</p>
          </div>
          <button
            type="submit"
            disabled={editUser.isPending}
            className="w-full rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {editUser.isPending ? "שומר..." : "שמירה והמשך"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
