import React from "react";

const CardStepsIcon: React.FC<{ className?: string }> = ({ className = "h-32 w-32" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background circle */}
    <circle cx="60" cy="60" r="52" fill="hsl(var(--primary) / 0.06)" />
    
    {/* Vertical line connecting steps */}
    <line x1="42" y1="30" x2="42" y2="92" stroke="hsl(var(--primary) / 0.15)" strokeWidth="2" strokeDasharray="4 3" />
    
    {/* Step 1 - completed */}
    <circle cx="42" cy="34" r="8" fill="hsl(var(--primary))" />
    <path d="M38 34L41 37L46 31" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="56" y="29" rx="3" width="28" height="5" fill="hsl(var(--foreground) / 0.7)" />
    <rect x="56" y="36" rx="2" width="18" height="3" fill="hsl(var(--muted-foreground) / 0.3)" />
    
    {/* Step 2 - completed */}
    <circle cx="42" cy="56" r="8" fill="hsl(var(--primary))" />
    <path d="M38 56L41 59L46 53" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="56" y="51" rx="3" width="24" height="5" fill="hsl(var(--foreground) / 0.7)" />
    <rect x="56" y="58" rx="2" width="20" height="3" fill="hsl(var(--muted-foreground) / 0.3)" />
    
    {/* Step 3 - active */}
    <circle cx="42" cy="78" r="8" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="2" />
    <circle cx="42" cy="78" r="3" fill="hsl(var(--primary))" />
    <rect x="56" y="73" rx="3" width="26" height="5" fill="hsl(var(--foreground) / 0.4)" />
    <rect x="56" y="80" rx="2" width="16" height="3" fill="hsl(var(--muted-foreground) / 0.2)" />
    
    {/* Subtle glow on active step */}
    <circle cx="42" cy="78" r="12" fill="hsl(var(--primary) / 0.06)" />
  </svg>
);

export default CardStepsIcon;
