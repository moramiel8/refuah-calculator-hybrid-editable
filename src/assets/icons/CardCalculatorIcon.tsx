import React from "react";

const CardCalculatorIcon: React.FC<{ className?: string }> = ({ className = "h-32 w-32" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background circle */}
    <circle cx="60" cy="60" r="52" fill="hsl(var(--primary) / 0.06)" />
    
    {/* Chart area background */}
    <rect x="28" y="28" rx="8" width="64" height="64" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Grid lines */}
    <line x1="36" y1="48" x2="84" y2="48" stroke="hsl(var(--border) / 0.5)" strokeWidth="0.75" />
    <line x1="36" y1="60" x2="84" y2="60" stroke="hsl(var(--border) / 0.5)" strokeWidth="0.75" />
    <line x1="36" y1="72" x2="84" y2="72" stroke="hsl(var(--border) / 0.5)" strokeWidth="0.75" />
    
    {/* Rising trend line with gradient */}
    <defs>
      <linearGradient id="calcGrad" x1="36" y1="80" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0" />
        <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    <path d="M36 74 L48 66 L56 68 L66 52 L76 44 L84 38" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M36 74 L48 66 L56 68 L66 52 L76 44 L84 38 L84 80 L36 80 Z" fill="url(#calcGrad)" />
    
    {/* Data points */}
    <circle cx="48" cy="66" r="3" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
    <circle cx="66" cy="52" r="3" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
    <circle cx="84" cy="38" r="3.5" fill="hsl(var(--primary))" />
    
    {/* Score badge */}
    <rect x="70" y="30" rx="4" width="20" height="12" fill="hsl(var(--primary))" />
    <text x="80" y="39" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="7" fontWeight="600" fontFamily="Inter, sans-serif">98</text>
  </svg>
);

export default CardCalculatorIcon;
