import React from "react";

const CardLibraryIcon: React.FC<{ className?: string }> = ({ className = "h-32 w-32" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background circle */}
    <circle cx="60" cy="60" r="52" fill="hsl(var(--primary) / 0.06)" />
    
    {/* Book 1 - back */}
    <rect x="32" y="32" rx="4" width="40" height="52" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary) / 0.25)" strokeWidth="1.5" transform="rotate(-6 52 58)" />
    
    {/* Book 2 - middle */}
    <rect x="36" y="30" rx="4" width="40" height="52" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" transform="rotate(2 56 56)" />
    
    {/* Book 3 - front */}
    <rect x="38" y="32" rx="5" width="44" height="54" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Book spine accent */}
    <rect x="38" y="32" rx="5" width="6" height="54" fill="hsl(var(--primary) / 0.1)" />
    
    {/* Title lines on front book */}
    <rect x="50" y="42" rx="2" width="24" height="4" fill="hsl(var(--foreground) / 0.5)" />
    <rect x="50" y="49" rx="1.5" width="18" height="3" fill="hsl(var(--muted-foreground) / 0.3)" />
    
    {/* Decorative element on cover */}
    <rect x="50" y="58" rx="3" width="26" height="16" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
    <line x1="54" y1="64" x2="72" y2="64" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.75" />
    <line x1="54" y1="68" x2="68" y2="68" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.75" />
    
    {/* Bookmark ribbon */}
    <path d="M74 32 L74 26 L78 29 L82 26 L82 32" fill="hsl(var(--primary))" />
    
    {/* Small floating badge */}
    <circle cx="86" cy="36" r="8" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" />
    <text x="86" y="39" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif">★</text>
  </svg>
);

export default CardLibraryIcon;
