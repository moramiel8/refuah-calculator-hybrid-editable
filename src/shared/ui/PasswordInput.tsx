import React, { useState, useMemo } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showStrength?: boolean;
  placeholder?: string;
}

interface StrengthRule {
  label: string;
  test: (v: string) => boolean;
}

const rules: StrengthRule[] = [
  { label: "לפחות 8 תווים", test: (v) => v.length >= 8 },
  { label: "אות גדולה", test: (v) => /[A-Z]/.test(v) },
  { label: "מספר", test: (v) => /[0-9]/.test(v) },
  { label: "תו מיוחד", test: (v) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v) },
];

function getStrength(value: string): { score: number; label: string; color: string } {
  if (!value) return { score: 0, label: "", color: "" };
  const passed = rules.filter((r) => r.test(value)).length;
  if (passed <= 1) return { score: 25, label: "חלש", color: "bg-destructive" };
  if (passed <= 2) return { score: 50, label: "בינוני", color: "bg-yellow-500" };
  if (passed <= 3) return { score: 75, label: "טוב", color: "bg-yellow-400" };
  return { score: 100, label: "חזק", color: "bg-green-500" };
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  showStrength = false,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);
  const strength = useMemo(() => getStrength(value), [value]);

  return (
    <div className="mb-4" dir="rtl">
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          maxLength={64}
          placeholder={placeholder}
          className="w-full rounded-xl border border-input bg-background pe-10 ps-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={visible ? "הסתרת סיסמה" : "הצגת סיסמה"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}

      {showStrength && value.length > 0 && (
        <div className="mt-2 rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Progress value={strength.score} className="h-1.5 bg-muted" />
            </div>
            <span
              className={`text-xs font-medium ${
                strength.score <= 25
                  ? "text-destructive"
                  : strength.score <= 50
                    ? "text-yellow-500"
                    : strength.score <= 75
                      ? "text-yellow-400"
                      : "text-green-500"
              }`}
            >
              {strength.label}
            </span>
          </div>
          <ul className="mt-2 space-y-1">
            {rules.map((rule) => {
              const passed = rule.test(value);
              return (
                <li
                  key={rule.label}
                  className={`flex items-center justify-end gap-1.5 text-xs transition-colors ${
                    passed ? "text-green-500" : "text-muted-foreground"
                  }`}
                >
                  {rule.label}
                  {passed ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
