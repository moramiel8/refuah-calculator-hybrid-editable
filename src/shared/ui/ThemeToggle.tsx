import React, { useEffect, useState } from "react";

interface ThemeToggleProps {
  variant?: "navbar" | "sidebar";
}

const safeThemeGet = () => {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
};

const safeThemeSet = (value: "dark" | "light") => {
  try {
    localStorage.setItem("theme", value);
  } catch {}
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = "navbar" }) => {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      safeThemeSet("dark");
    } else {
      document.documentElement.classList.remove("dark");
      safeThemeSet("light");
    }
  }, [dark]);

  useEffect(() => {
    const saved = safeThemeGet();
    if (saved === "dark") {
      setDark(true);
    } else if (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDark(true);
    }
  }, []);

  if (variant === "sidebar") {
    return (
      <button
        onClick={() => setDark((d) => !d)}
        className={`relative inline-flex items-center h-6 w-11 p-1 rounded-full transition-colors focus:outline-none ${
          dark ? "bg-primary" : "bg-slate-400/80 dark:bg-slate-600"
        }`}
        aria-label="Toggle dark mode"
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 left-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${
            dark ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    );
  }

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20"
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
