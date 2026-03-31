import React from "react";

const CardStatsIcon: React.FC<{ className?: string }> = ({ className = "h-32 w-32" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background circle */}
    <circle cx="60" cy="60" r="52" fill="hsl(var(--primary) / 0.06)" />
    
    {/* Table container */}
    <rect x="26" y="30" rx="6" width="68" height="60" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
    
    {/* Header row */}
    <rect x="26" y="30" rx="6" width="68" height="14" fill="hsl(var(--primary) / 0.08)" />
    <rect x="26" y="44" width="68" height="0" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Header cells */}
    <rect x="32" y="35" rx="2" width="14" height="4" fill="hsl(var(--foreground) / 0.5)" />
    <rect x="52" y="35" rx="2" width="12" height="4" fill="hsl(var(--foreground) / 0.5)" />
    <rect x="72" y="35" rx="2" width="16" height="4" fill="hsl(var(--foreground) / 0.5)" />
    
    {/* Row dividers */}
    <line x1="26" y1="44" x2="94" y2="44" stroke="hsl(var(--border))" strokeWidth="0.75" />
    <line x1="26" y1="56" x2="94" y2="56" stroke="hsl(var(--border))" strokeWidth="0.75" />
    <line x1="26" y1="68" x2="94" y2="68" stroke="hsl(var(--border))" strokeWidth="0.75" />
    <line x1="26" y1="80" x2="94" y2="80" stroke="hsl(var(--border))" strokeWidth="0.75" />
    
    {/* Row 1 */}
    <rect x="32" y="48" rx="2" width="12" height="3.5" fill="hsl(var(--foreground) / 0.3)" />
    <rect x="52" y="48" rx="2" width="10" height="3.5" fill="hsl(var(--foreground) / 0.3)" />
    <rect x="72" y="47" rx="3" width="18" height="6" fill="hsl(var(--primary) / 0.12)" />
    <rect x="74" y="48.5" rx="1.5" width="14" height="3" fill="hsl(var(--primary))" />
    
    {/* Row 2 - highlighted */}
    <rect x="26" y="56" width="68" height="12" fill="hsl(var(--primary) / 0.04)" />
    <rect x="32" y="60" rx="2" width="14" height="3.5" fill="hsl(var(--foreground) / 0.3)" />
    <rect x="52" y="60" rx="2" width="8" height="3.5" fill="hsl(var(--foreground) / 0.3)" />
    <rect x="72" y="59" rx="3" width="18" height="6" fill="hsl(var(--primary) / 0.12)" />
    <rect x="74" y="60.5" rx="1.5" width="11" height="3" fill="hsl(var(--primary) / 0.7)" />
    
    {/* Row 3 */}
    <rect x="32" y="72" rx="2" width="10" height="3.5" fill="hsl(var(--foreground) / 0.3)" />
    <rect x="52" y="72" rx="2" width="12" height="3.5" fill="hsl(var(--foreground) / 0.3)" />
    <rect x="72" y="71" rx="3" width="18" height="6" fill="hsl(var(--primary) / 0.12)" />
    <rect x="74" y="72.5" rx="1.5" width="8" height="3" fill="hsl(var(--primary) / 0.5)" />
    
    {/* Row 4 */}
    <rect x="32" y="83" rx="2" width="11" height="3.5" fill="hsl(var(--foreground) / 0.2)" />
    <rect x="52" y="83" rx="2" width="9" height="3.5" fill="hsl(var(--foreground) / 0.2)" />
    <rect x="74" y="83" rx="1.5" width="6" height="3" fill="hsl(var(--primary) / 0.35)" />
  </svg>
);

export default CardStatsIcon;
