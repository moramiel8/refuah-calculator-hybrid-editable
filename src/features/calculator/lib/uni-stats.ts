// University statistics configuration - exact port from uni-stats-config.js

export interface AvgRange {
  min: number;
  max?: number;
  round?: number;
}

export interface ChannelStats {
  avg?: AvgRange;
  psycho?: { min: number };
  cognitive?: { min: number; max: number };
  ishiuti?: { min: number; max: number; threshold: number };
  eng?: { min: number };
  math?: { min: number | string };
}

export interface UniStats {
  eng: { min: number };
  heb: { min: number };
  math: { min: string };
  BAGRUT?: ChannelStats;
  PREP?: ChannelStats;
  PD?: ChannelStats;
  FD?: ChannelStats;
  FINAL?: ChannelStats;
  SAT?: { eng: { min: number } };
  ACT?: { math: { min: number }; eng: { min: number } };
  HUL?: {
    prep: { min: number; max: number };
    psycho: { min: number };
    french: { min: number; max: number };
  };
}

export const uniStats: Record<string, UniStats> = {
  TAU: {
    eng: { min: 120 },
    heb: { min: 105 },
    math: { min: '4 יח"ל ציון עובר+' },
    BAGRUT: { avg: { min: 55, max: 117, round: 2 }, psycho: { min: 700 } },
    PREP: { avg: { min: 90, max: 100 }, psycho: { min: 700 } },
    PD: { avg: { min: 80 }, psycho: { min: 700 } },
    FD: { avg: { min: 80 }, psycho: { min: 700 } },
    FINAL: { cognitive: { min: 200, max: 800 }, ishiuti: { min: 150, max: 250, threshold: 150 } },
  },
  HUJI: {
    eng: { min: 120 },
    heb: { min: 105 },
    math: { min: '4 יח"ל ציון 80+ או 5 יח"ל ציון 70+ או קורס בשנה א' },
    BAGRUT: { avg: { min: 60, max: 127, round: 1 }, psycho: { min: 700 } },
    PREP: { avg: { min: 60, max: 113 }, psycho: { min: 700 } },
    PD: { avg: { min: 60 }, psycho: { min: 700 } },
    FD: { avg: { min: 60 }, psycho: { min: 700 } },
    HUL: {
      prep: { min: 65, max: 107 },
      psycho: { min: 700 },
      french: { min: 7, max: 20 },
    },
    FINAL: { cognitive: { min: 16, max: 30 }, ishiuti: { min: 150, max: 250, threshold: 175 } },
  },
  TECH: {
    eng: { min: 120 },
    heb: { min: 121 },
    math: { min: '5 יח"ל ציון 70+ או 4+ יח"ל ובחינת סיווג ציון 70+' },
    BAGRUT: { avg: { min: 0, max: 119, round: 2 }, psycho: { min: 200 } },
    PREP: { avg: { min: 0, max: 119 }, psycho: { min: 200 } },
    PD: { avg: { min: 80 }, psycho: { min: 700 }, cognitive: { min: 90, max: 100 } },
    FD: { avg: { min: 80 }, psycho: { min: 700 } },
    SAT: { eng: { min: 600 } },
    ACT: { math: { min: 12 }, eng: { min: 11 } },
    FINAL: { cognitive: { min: 0, max: 100.5 }, ishiuti: { min: 150, max: 250, threshold: 190 } },
  },
  BGU: {
    eng: { min: 120 },
    heb: { min: 116 },
    math: { min: "כל ציון" },
    BAGRUT: { avg: { min: 0, max: 120, round: 2 }, psycho: { min: 680 } },
    PREP: { avg: { min: 0, max: 100 }, psycho: { min: 680 } },
    PD: { avg: { min: 95 }, psycho: { min: 660 } },
    FD: { avg: { min: 90 }, psycho: { min: 660 } },
  },
  BIU: {
    eng: { min: 120 },
    heb: { min: 120 },
    math: { min: '4 יח"ל ציון 85+ או 5 יח"ל ציון 80+' },
    BAGRUT: { avg: { min: 101, max: 126, round: 2 }, psycho: { min: 680 } },
    PREP: { avg: { min: 101, max: 114 }, psycho: { min: 680 } },
    FINAL: { ishiuti: { min: 200, max: 800, threshold: 200 } },
  },
  HAIFA: {
    eng: { min: 120 },
    heb: { min: 120 },
    math: { min: '4 יח"ל ציון 80+ או 5 יח"ל ציון 70+' },
    BAGRUT: { avg: { min: 101, max: 125, round: 2 }, psycho: { min: 680 } },
    PREP: { avg: { min: 90, max: 100 }, psycho: { min: 680 } },
    FD: { avg: { min: 85 }, psycho: { min: 680 } },
    SAT: { eng: { min: 600 } },
  },
  ARIEL: {
    eng: { min: 50 },
    heb: { min: 50 },
    math: { min: "?" },
    BAGRUT: { avg: { min: 0, max: 126, round: 2 }, psycho: { min: 200 } },
    FINAL: { cognitive: { min: 0, max: 1 }, ishiuti: { min: 150, max: 250, threshold: 150 } },
  },
  TZAMERET: {
    eng: { min: 120 },
    heb: { min: 105 },
    math: { min: '4 יח"ל ציון 80+ או 5 יח"ל ציון 70+ או קורס בשנה א' },
    BAGRUT: { avg: { min: 60, max: 127, round: 1 }, psycho: { min: 675 } },
    PREP: { avg: { min: 60, max: 113 }, psycho: { min: 675 } },
    FINAL: { cognitive: { min: 16, max: 30 }, ishiuti: { min: 150, max: 250, threshold: 175 } },
  },
};

// All admission channels
export type AdmissionChannel =
  | "BAGRUT" | "PREP" | "PD" | "FD" | "ALT" | "TZAMERET"
  | "FINAL" | "MORKAM"
  | "SAT";

// ======================== INITIAL MODE CHANNELS ========================
// These appear under "סכם ראשוני" toggle
export const INITIAL_CHANNELS = ["BAGRUT", "PREP", "PD", "FD", "ALT", "TZAMERET"] as const;
export type InitialChannel = typeof INITIAL_CHANNELS[number];

export const initialChannelLabels: Record<string, string> = {
  BAGRUT: "בגרויות",
  PREP: "מכינה אקדמית",
  PD: "רקע אקדמי חלקי",
  FD: "רקע אקדמי מלא",
  ALT: 'חלופות לציונים מחו"ל',
  TZAMERET: "צמרת",
};

// ======================== FINAL MODE CHANNELS ========================
// These appear under "סכם סופי" toggle
export const FINAL_CHANNELS = ["FINAL", "MORKAM"] as const;
export type FinalChannel = typeof FINAL_CHANNELS[number];

export const finalChannelLabels: Record<string, string> = {
  FINAL: "חישוב סכם קבלה",
  MORKAM: "חישוב ציון אישיותי",
};

// Combined labels for backward compatibility
export const admissionChannelLabels: Record<string, string> = {
  ...initialChannelLabels,
  ...finalChannelLabels,
  SAT: "SAT",
};

// Which universities support which channels in INITIAL mode
export const uniChannelsInitial: Record<string, string[]> = {
  BAGRUT: ["TAU", "HUJI", "TECH", "BGU", "BIU", "HAIFA", "ARIEL"],
  PREP: ["TAU", "HUJI", "TECH", "BGU", "BIU", "HAIFA"],
  PD: ["TAU", "HUJI", "TECH", "BGU"],
  FD: ["TAU", "HUJI", "TECH", "BGU", "HAIFA"],
  ALT: ["HUJI", "TECH", "HAIFA"],
  TZAMERET: ["TZAMERET"],
};

// Sub-channels for ALT
export const altSubChannels: Record<string, { id: string; label: string }[]> = {
  HUJI: [
    { id: "HUJI-HUL-PREP", label: "מכינת רוטברג" },
    { id: "HUJI-HUL-PSYCHO", label: "פסיכומטרי בלבד" },
    { id: "HUJI-HUL-FRENCH", label: "Baccalauréat Général" },
  ],
  TECH: [
    { id: "TECH-SAT", label: "SAT" },
    { id: "TECH-ACT", label: "ACT" },
  ],
  HAIFA: [
    { id: "HAIFA-SAT", label: "SAT" },
  ],
};

// Which universities support which channels in FINAL mode
export const uniChannelsFinal: Record<string, string[]> = {
  FINAL: ["TAU", "HUJI", "TECH", "ARIEL", "TZAMERET"],
};

// Sub-channels for TECH FINAL
export const techFinalSubChannels = [
  { id: "TECH-BP-FINAL", label: "בגרויות/מכינה" },
  { id: "TECH-DEG-FINAL", label: "רקע אקדמי חלקי/מלא" },
];

// Sub-channels for HUJI PREP
export const hujiPrepSubChannels = [
  { id: "HUJI-PREP-NEW", label: 'העברית תשפ"א ואילך' },
  { id: "HUJI-PREP-OLD", label: 'העברית עד תש"ף ואחרות' },
];

// Sub-channels for BGU PREP
export const bguPrepSubChannels = [
  { id: "BGU-PREP-ONLY", label: "מכינה בלבד" },
  { id: "BGU-PREP-BAGRUT", label: "מכינה + בגרות" },
];

// Sub-channels for BGU PD
export const bguPDSubChannels = [
  { id: "BGU-PD-3", label: "בדיוק 3 סמסטרים" },
  { id: "BGU-PD-4+", label: "4+ סמסטרים" },
];

// Legacy: channel → university mapping
export const uniChannels: Record<string, AdmissionChannel[]> = {
  TAU: ["BAGRUT", "PREP", "PD", "FD", "FINAL"],
  HUJI: ["BAGRUT", "PREP", "PD", "FD", "FINAL"],
  TECH: ["BAGRUT", "PREP", "SAT", "FINAL"],
  BGU: ["BAGRUT", "PREP", "PD", "FD"],
  BIU: ["BAGRUT", "PREP"],
  HAIFA: ["BAGRUT", "PREP", "FD", "SAT"],
  ARIEL: ["BAGRUT"],
  TZAMERET: ["BAGRUT", "PREP", "FINAL"],
};

// University display names (Hebrew)
export const uniDisplayNames: Record<string, string> = {
  TAU: "תל אביב",
  HUJI: "העברית",
  TECH: "טכניון",
  BGU: "בן גוריון",
  BIU: "בר אילן",
  HAIFA: "חיפה",
  ARIEL: "אריאל",
  TZAMERET: "צמרת",
};
