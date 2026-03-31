import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useBaseDataStore } from "@/entities/baseData";

const navItems = [
  { label: "שלבים", path: "/steps", priority: "high" },
  { label: "שאלות", path: "/questions", priority: "high" },
  { label: "ספרייה", path: "/library", priority: "high" },
  { label: "מחשבון", path: "/calculator", priority: "high" },
  { label: "קהילה", path: "/community", priority: "high" },
  { label: "טבלה", path: "/stats", priority: "low" },
  { label: "אודות", path: "/about", priority: "low" },
  { label: "יצירת קשר", path: "/contact", priority: "low" },
];

const NavLinks: React.FC = () => {
  const location = useLocation();
  const paths = useBaseDataStore((s) => s.paths);
  const firstPathId = paths[0]?.slug ?? paths[0]?._id ?? "regular";

  return (
    <ul className="hidden h-full items-center gap-0.5 md:flex">
      {navItems.map((item) => {
        const fullPath =
          item.path === "/steps" || item.path === "/questions" || item.path === "/library"
            ? `${item.path}/${firstPathId}`
            : item.path;

        const isActive = location.pathname.startsWith(item.path);

        return (
          <li key={item.path} className={item.priority === "low" ? "hidden lg:block" : undefined}>
            <Link
              to={fullPath}
              className={`relative whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground/90 transition-all lg:px-4 ${
                isActive
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
