import React from "react";

interface FormInputProps {
  type: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  limit?: string;
  placeholder?: string;
  variant?: "default" | "admin";
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  label,
  name,
  value,
  onChange,
  error,
  limit,
  placeholder,
  variant = "default",
}) => {
  const inputClassName =
    variant === "admin"
      ? "w-full rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm text-foreground shadow-inner placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
      : "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary";

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={limit ? parseInt(limit) : undefined}
        placeholder={placeholder}
        className={inputClassName}
      />
      {error && (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
