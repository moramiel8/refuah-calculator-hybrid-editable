import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Copy, Info, Save } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  calculateSechem,
  getInputLabels,
  getUniInfo,
  type CalcResult,
} from "@/features/calculator/lib/engine";
import {
  uniDisplayNames,
  admissionChannelLabels,
  INITIAL_CHANNELS,
  FINAL_CHANNELS,
  initialChannelLabels,
  finalChannelLabels,
  uniChannelsInitial,
  uniChannelsFinal,
  altSubChannels,
  hujiPrepSubChannels,
  bguPrepSubChannels,
  bguPDSubChannels,
  techFinalSubChannels,
  type AdmissionChannel,
} from "@/features/calculator/lib/uni-stats";
import { toast } from "sonner";

type CalcMode = "initial" | "final";

const sectionAnim = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" as const },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

const SechemCalculator: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [localSavedResults, setLocalSavedResults] = useState<any[]>([]);

  const [mode, setMode] = useState<CalcMode>("initial");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [selectedUni, setSelectedUni] = useState("");
  const [selectedSubChannel, setSelectedSubChannel] = useState("");

  const [topValue, setTopValue] = useState("");
  const [bottomValue, setBottomValue] = useState("");
  const [extValue, setExtValue] = useState("");

  const [result, setResult] = useState<CalcResult | null>(null);
  const [lastInitialSechem, setLastInitialSechem] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showUniInfo, setShowUniInfo] = useState(false);
  const [resultGlow, setResultGlow] = useState(false);
  

  const channels = mode === "initial" ? INITIAL_CHANNELS : FINAL_CHANNELS;
  const channelLabels = mode === "initial" ? initialChannelLabels : finalChannelLabels;

  const availableUnis = useMemo(() => {
    if (!selectedChannel) return [];
    if (selectedChannel === "MORKAM") return [];
    if (selectedChannel === "TZAMERET") return ["TZAMERET"];
    if (mode === "initial") return uniChannelsInitial[selectedChannel] ?? [];
    if (selectedChannel === "FINAL") return uniChannelsFinal.FINAL ?? [];
    return [];
  }, [selectedChannel, mode]);

  const subChannels = useMemo(() => {
    if (!selectedUni || !selectedChannel) return [];
    if (selectedChannel === "ALT") return altSubChannels[selectedUni] ?? [];
    if (selectedChannel === "PREP" && selectedUni === "HUJI") return hujiPrepSubChannels;
    if (selectedChannel === "PREP" && selectedUni === "BGU") return bguPrepSubChannels;
    if (selectedChannel === "PD" && selectedUni === "BGU") return bguPDSubChannels;
    if (selectedChannel === "FINAL" && selectedUni === "TECH") return techFinalSubChannels;
    return [];
  }, [selectedUni, selectedChannel]);

  // Whether we need a sub-channel selection before showing inputs
  const requiresSubChannel = subChannels.length > 0;

  const effectiveChannel = useMemo((): AdmissionChannel => {
    if (selectedChannel === "ALT") {
      if (selectedSubChannel === "HUJI-HUL-PREP" || selectedSubChannel === "HUJI-HUL-PSYCHO" || selectedSubChannel === "HUJI-HUL-FRENCH") {
        return "ALT" as AdmissionChannel;
      }
      if (selectedSubChannel === "TECH-SAT" || selectedSubChannel === "HAIFA-SAT") return "SAT";
      if (selectedSubChannel === "TECH-ACT") return "ACT" as AdmissionChannel;
      return selectedChannel as AdmissionChannel;
    }
    if (selectedChannel === "TZAMERET") return "BAGRUT" as AdmissionChannel;
    return selectedChannel as AdmissionChannel;
  }, [selectedChannel, selectedSubChannel]);

  const effectiveUniKey = useMemo(() => {
    if (selectedChannel === "TZAMERET") return "TZAMERET";
    if (selectedSubChannel === "TECH-SAT" || selectedSubChannel === "TECH-ACT") return "TECH";
    if (selectedSubChannel === "HAIFA-SAT") return "HAIFA";
    return selectedUni;
  }, [selectedChannel, selectedSubChannel, selectedUni]);

  // Determine if inputs should be shown
  const shouldShowInputs = useMemo(() => {
    if (!selectedChannel) return false;
    if (selectedChannel === "MORKAM") return true;
    if (selectedChannel === "TZAMERET") return !!selectedSubChannel;
    if (!selectedUni) return false;
    if (requiresSubChannel && !selectedSubChannel) return false;
    return true;
  }, [selectedChannel, selectedUni, selectedSubChannel, requiresSubChannel]);

  // Detect threshold-only paths that have no inputs
  const isThresholdOnlyPath = useMemo(() => {
    if (!selectedChannel) return false;
    if (selectedChannel === "FINAL" && selectedUni === "TECH" && selectedSubChannel === "TECH-BP-FINAL") return true;
    return false;
  }, [selectedChannel, selectedUni, selectedSubChannel]);


  const inputLabels = useMemo(() => {
    if (!shouldShowInputs) return null;
    if (selectedChannel === "MORKAM") return getInputLabels("", "MORKAM");

    // ALT sub-channel specific labels
    if (selectedChannel === "ALT" && selectedSubChannel) {
      if (selectedSubChannel === "HUJI-HUL-PREP") {
        return {
          topLabel: "ממוצע מכינה (65 - 107):",
          bottomLabel: "פסיכומטרי (700 - 800):",
          topMin: 0, topMax: 107, bottomMin: 0, bottomMax: 800,
          topAllowDecimal: true, bottomAllowDecimal: false,
        };
      }
      if (selectedSubChannel === "HUJI-HUL-PSYCHO") {
        return {
          topLabel: "",
          bottomLabel: "פסיכומטרי (700 - 800):",
          topMin: 0, topMax: 0, bottomMin: 0, bottomMax: 800,
          topAllowDecimal: true, bottomAllowDecimal: false,
        };
      }
      if (selectedSubChannel === "HUJI-HUL-FRENCH") {
        return {
          topLabel: "ממוצע בגרות (7 - 20):",
          bottomLabel: "פסיכומטרי (700 - 800):",
          topMin: 0, topMax: 20, bottomMin: 0, bottomMax: 800,
          topAllowDecimal: true, bottomAllowDecimal: false,
        };
      }
      if (selectedSubChannel === "TECH-SAT") {
        return {
          topLabel: "SAT אנגלית (200 - 800):",
          bottomLabel: "SAT מתמטיקה (200 - 800):",
          topMin: 200, topMax: 800, bottomMin: 200, bottomMax: 800,
          topAllowDecimal: false, bottomAllowDecimal: false,
        };
      }
      if (selectedSubChannel === "TECH-ACT") {
        return {
          topLabel: "ACT אנגלית (11 - 36):",
          bottomLabel: "ACT מתמטיקה (12 - 36):",
          topMin: 11, topMax: 36, bottomMin: 12, bottomMax: 36,
          topAllowDecimal: false, bottomAllowDecimal: false,
        };
      }
      if (selectedSubChannel === "HAIFA-SAT") {
        return {
          topLabel: "SAT אנגלית (200 - 800):",
          bottomLabel: "SAT מתמטיקה (200 - 800):",
          topMin: 200, topMax: 800, bottomMin: 200, bottomMax: 800,
          topAllowDecimal: false, bottomAllowDecimal: false,
        };
      }
    }

    if (selectedChannel === "TZAMERET") {
      if (selectedSubChannel === "TZAMERET-BAGRUT") return getInputLabels("TZAMERET", "BAGRUT");
      if (selectedSubChannel === "TZAMERET-PREP") return getInputLabels("TZAMERET", "PREP");
      return null;
    }

    // TECH FINAL sub-channels
    if (selectedChannel === "FINAL" && selectedUni === "TECH") {
      if (selectedSubChannel === "TECH-DEG-FINAL") {
        return {
          topLabel: "ממוצע אקדמי חלקי/מלא (80 - 100):",
          bottomLabel: 'מו"ר (190 - 250):',
          topMin: 0, topMax: 100, bottomMin: 0, bottomMax: 250,
          topAllowDecimal: true, bottomAllowDecimal: false,
        };
      }
      // TECH-BP-FINAL - no formula in original
      return null;
    }

    // BGU PREP: only show ext (bagrut) field for "prep+bagrut" sub
    const labels = getInputLabels(selectedUni, selectedChannel as AdmissionChannel);
    if (selectedChannel === "PREP" && selectedUni === "BGU" && selectedSubChannel === "BGU-PREP-ONLY") {
      // Remove ext label for prep-only
      return { ...labels, extLabel: undefined };
    }
    if (selectedChannel === "PREP" && selectedUni === "BGU" && selectedSubChannel === "BGU-PREP-BAGRUT") {
      return {
        ...labels,
        extLabel: `ממוצע בגרות (0 - 120):`,
        extMin: 0,
        extMax: 120,
        extAllowDecimal: true,
      };
    }

    return labels;
  }, [shouldShowInputs, selectedChannel, selectedUni, selectedSubChannel]);

  const isMorkam = selectedChannel === "MORKAM";

  // University info
  const uniInfo = useMemo(() => {
    if (!selectedUni) return null;
    return getUniInfo(selectedUni);
  }, [selectedUni]);

  // Load saved simulations
  const { data: savedResults } = useQuery({
    queryKey: ["simulations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("simulations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
    enabled: !!user,
  });

  React.useEffect(() => {
    if (user) return;
    try {
      const raw = localStorage.getItem("sechemeter-local-simulations");
      const parsed = raw ? JSON.parse(raw) : [];
      setLocalSavedResults(Array.isArray(parsed) ? parsed : []);
    } catch {
      setLocalSavedResults([]);
    }
  }, [user]);

  const saveResult = useMutation({
    mutationFn: async (entry: { uniKey: string; channel: string; result: CalcResult }) => {
      if (!user) throw new Error("לא מחובר");
      const { error } = await supabase.from("simulations").insert({
        user_id: user.id,
        university: entry.uniKey,
        path: entry.channel,
        score: typeof entry.result.sechem === "number" ? entry.result.sechem : null,
        result: {
          sechem: entry.result.sechem,
          label: entry.result.label,
          details: entry.result.details,
          topValue, bottomValue, extValue,
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("התוצאה נשמרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
    },
    onError: () => toast.error("שגיאה בשמירת התוצאה"),
  });

  const handleCalculate = useCallback(async () => {
    if (!selectedChannel) return;
    if (!isMorkam && !selectedUni && selectedChannel !== "TZAMERET") return;
    setIsCalculating(true);
    try {
      let engineChannel = effectiveChannel;
      let engineUni = effectiveUniKey;
      let subCh = selectedSubChannel;

      // Handle ALT sub-channels
      if (selectedChannel === "ALT") {
        if (selectedSubChannel === "TECH-SAT" || selectedSubChannel === "HAIFA-SAT") {
          engineChannel = "SAT";
          engineUni = selectedSubChannel === "TECH-SAT" ? "TECH" : "HAIFA";
        } else if (selectedSubChannel === "TECH-ACT") {
          engineChannel = "ACT" as AdmissionChannel;
          engineUni = "TECH";
        } else {
          engineChannel = "ALT" as AdmissionChannel;
          engineUni = selectedUni;
        }
      }

      // Handle TZAMERET sub-channels
      if (selectedChannel === "TZAMERET") {
        engineUni = "TZAMERET";
        if (selectedSubChannel === "TZAMERET-BAGRUT") engineChannel = "BAGRUT" as AdmissionChannel;
        else if (selectedSubChannel === "TZAMERET-PREP") engineChannel = "PREP" as AdmissionChannel;
        else return;
      }

      // Map sub-channels for engine
      if (selectedChannel === "PREP" && selectedUni === "HUJI") {
        subCh = selectedSubChannel === "HUJI-PREP-NEW" ? "new" : selectedSubChannel === "HUJI-PREP-OLD" ? "old" : "";
      }
      if (selectedChannel === "PREP" && selectedUni === "BGU") {
        subCh = selectedSubChannel === "BGU-PREP-ONLY" ? "only" : selectedSubChannel === "BGU-PREP-BAGRUT" ? "bagrut" : "";
      }

      const res = await calculateSechem(
        isMorkam ? "MORKAM" : engineUni,
        engineChannel,
        {
          topValue: parseFloat(topValue) || 0,
          bottomValue: parseFloat(bottomValue) || 0,
          extValue: extValue ? parseFloat(extValue) : undefined,
          subChannel: subCh || undefined,
        },
      );
      setResult(res);
      if (res.isValid) {
        if (mode === "initial" && typeof res.sechem === "number") {
          setLastInitialSechem(res.sechem);
        }
        setResultGlow(true);
        setTimeout(() => setResultGlow(false), 1200);
      }
    } finally {
      setIsCalculating(false);
    }
  }, [selectedChannel, selectedUni, selectedSubChannel, effectiveChannel, effectiveUniKey, topValue, bottomValue, extValue, isMorkam, mode]);

  const handleModeChange = (newMode: CalcMode) => {
    setMode(newMode);
    setSelectedChannel("");
    setSelectedUni("");
    setSelectedSubChannel("");
    setResult(null);
    setTopValue("");
    setBottomValue("");
    setExtValue("");
    setShowUniInfo(false);
  };

  const handleChannelChange = (ch: string) => {
    setSelectedChannel(ch);
    setSelectedUni("");
    setSelectedSubChannel("");
    setResult(null);
    setTopValue("");
    setBottomValue("");
    setExtValue("");
    setShowUniInfo(false);
  };

  const handleUniChange = (uni: string) => {
    setSelectedUni(uni);
    setSelectedSubChannel("");
    setResult(null);
    const shouldAutofillInitialSechem =
      mode === "final" &&
      selectedChannel === "FINAL" &&
      uni === "TAU" &&
      lastInitialSechem !== null;
    setTopValue(shouldAutofillInitialSechem ? String(lastInitialSechem) : "");
    setBottomValue("");
    setExtValue("");
    setShowUniInfo(false);
  };

  const handleSubChannelChange = (sub: string) => {
    setSelectedSubChannel(sub);
    setResult(null);
    setTopValue("");
    setBottomValue("");
    setExtValue("");
  };

  const canCalculate = selectedChannel && (isMorkam || selectedUni || selectedChannel === "TZAMERET");
  const showSubChannels = subChannels.length > 0;
  const tzameretSubChannels = [
    { id: "TZAMERET-BAGRUT", label: "בגרויות" },
    { id: "TZAMERET-PREP", label: "מכינה" },
  ];

  return (
    <div className="space-y-4" dir="rtl">
      {/* Mode Toggle */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        <button
          onClick={() => handleModeChange("initial")}
          className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
            mode === "initial"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <div className="text-base">סכם ראשוני</div>
          <div className={`text-[11px] mt-0.5 ${mode === "initial" ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
            חישוב ציונים ראשוניים
          </div>
        </button>
        <button
          onClick={() => handleModeChange("final")}
          className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
            mode === "final"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <div className="text-base">סכם סופי</div>
          <div className={`text-[11px] mt-0.5 ${mode === "final" ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
            חישוב ציונים סופיים
          </div>
        </button>
      </div>

      {/* Channel Selection */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <label className="mb-2 block text-sm font-medium text-foreground">
          {mode === "initial" ? "אפיק קבלה" : "סוג חישוב"}
        </label>
        <div className="flex flex-wrap gap-2">
          {channels.map((key) => (
            <button
              key={key}
              onClick={() => handleChannelChange(key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedChannel === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {channelLabels[key]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* University Selection */}
      <AnimatePresence>
        {selectedChannel && !isMorkam && selectedChannel !== "TZAMERET" && availableUnis.length > 0 && (
          <motion.div {...sectionAnim} className="overflow-hidden">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">מוסד לימודים</label>
                {uniInfo && (
                  <button
                    onClick={() => setShowUniInfo(!showUniInfo)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Info className="h-3.5 w-3.5" />
                    מידע נוסף
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableUnis.map((uniKey) => (
                  <button
                    key={uniKey}
                    onClick={() => handleUniChange(uniKey)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      selectedUni === uniKey
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {uniDisplayNames[uniKey]}
                  </button>
                ))}
              </div>

              {/* University Info */}
              <AnimatePresence>
                {showUniInfo && uniInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden rounded-lg border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground"
                  >
                    <p className="font-medium text-foreground mb-1">{uniInfo.title}</p>
                    <p>{uniInfo.text}</p>
                    {uniInfo.ref && (
                      <a
                        href={uniInfo.ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        קישור למידע נוסף ←
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TZAMERET sub-channels */}
      <AnimatePresence>
        {selectedChannel === "TZAMERET" && (
          <motion.div {...sectionAnim} className="overflow-hidden">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <label className="mb-2 block text-sm font-medium text-foreground">אפיק צמרת</label>
              <div className="flex flex-wrap gap-2">
                {tzameretSubChannels.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubChannelChange(sub.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      selectedSubChannel === sub.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-channel Selection */}
      <AnimatePresence>
        {showSubChannels && selectedUni && (
          <motion.div {...sectionAnim} className="overflow-hidden">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <label className="mb-2 block text-sm font-medium text-foreground">
                {selectedChannel === "ALT" ? "אפיק חלופי" : "בחירה"}
              </label>
              <div className="flex flex-wrap gap-2">
                {subChannels.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubChannelChange(sub.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      selectedSubChannel === sub.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Fields — only shown after all selections are made */}
      <AnimatePresence>
        {inputLabels && shouldShowInputs && (
          <motion.div {...sectionAnim} className="overflow-hidden">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                {inputLabels.topLabel && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">{inputLabels.topLabel}</label>
                    <input
                      type="number"
                      value={topValue}
                      onChange={(e) => { setTopValue(e.target.value); setResult(null); }}
                      min={inputLabels.topMin}
                      max={inputLabels.topMax}
                      step={inputLabels.topAllowDecimal ? "any" : "1"}
                      dir="rtl"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring text-right"
                      placeholder="הזנת ערך"
                    />
                  </div>
                )}
                {inputLabels.bottomLabel && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">{inputLabels.bottomLabel}</label>
                    <input
                      type="number"
                      value={bottomValue}
                      onChange={(e) => { setBottomValue(e.target.value); setResult(null); }}
                      min={inputLabels.bottomMin}
                      max={inputLabels.bottomMax}
                      step={inputLabels.bottomAllowDecimal ? "any" : "1"}
                      dir="rtl"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring text-right"
                      placeholder="הזנת ערך"
                    />
                  </div>
                )}
                {inputLabels.extLabel && (
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">{inputLabels.extLabel}</label>
                    <input
                      type="number"
                      value={extValue}
                      onChange={(e) => { setExtValue(e.target.value); setResult(null); }}
                      min={inputLabels.extMin}
                      max={inputLabels.extMax}
                      step={inputLabels.extAllowDecimal ? "any" : "1"}
                      dir="rtl"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring text-right"
                      placeholder="הזנת ערך"
                    />
                  </div>
                )}
              </div>

              <div className="mt-5">
                <button
                  onClick={handleCalculate}
                  disabled={!canCalculate || isCalculating || (!topValue && !bottomValue)}
                  className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? "מחשב..." : mode === "initial" ? "חישוב סכם ראשוני" : "חישוב סכם סופי"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Threshold-only path message (no inputs needed) */}
      <AnimatePresence>
        {isThresholdOnlyPath && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-sm font-medium text-foreground">
                מסלול זה מבוסס על תנאי סף בלבד – אין חישוב סכם
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl border p-5 shadow-sm transition-shadow duration-500 ${
              result.thresholdOnly
                ? "border-amber-500/30 bg-amber-500/5"
                : result.isValid
                  ? `border-primary/30 bg-primary/5 ${resultGlow ? "shadow-[0_0_20px_hsl(var(--primary)/0.3)]" : ""}`
                  : "border-destructive/30 bg-destructive/5"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-full">
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">{result.label}</h3>
                {result.thresholdOnly ? (
                  <div className="flex items-center justify-center gap-2">
                    <Info className="h-5 w-5 text-amber-500 shrink-0" />
                    <p className="text-sm font-medium text-foreground">{result.details}</p>
                  </div>
                ) : result.isValid ? (
                  <motion.p
                    key={String(result.sechem)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold tracking-tight text-foreground"
                  >
                    {result.sechem}
                  </motion.p>
                ) : (
                  <div className="space-y-1">
                    {result.errors.map((err, i) => (
                      <p key={i} className="text-sm text-destructive">{err}</p>
                    ))}
                  </div>
                )}
                {!result.thresholdOnly && result.details && (
                  <p className="mt-1 text-sm text-muted-foreground">{result.details}</p>
                )}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {result.warnings.map((w, i) => (
                      <p key={i} className="text-xs text-amber-600">⚠ {w}</p>
                    ))}
                  </div>
                )}
              </div>
              {result.isValid && !result.thresholdOnly && user && (
                <div />
              )}
              {result.isValid && !result.thresholdOnly && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(String(result.sechem));
                        toast.success("הסכם הועתק");
                      } catch {
                        toast.error("שגיאה בהעתקה");
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-all hover:bg-accent"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    העתקה
                  </button>
                  <button
                    onClick={() => {
                      if (user) {
                        saveResult.mutate({
                          uniKey: isMorkam ? "MORKAM" : effectiveUniKey,
                          channel: selectedChannel,
                          result,
                        });
                        return;
                      }

                      const entry = {
                        id: `local-${Date.now()}`,
                        university: isMorkam ? "MORKAM" : effectiveUniKey,
                        path: selectedChannel,
                        score: typeof result.sechem === "number" ? result.sechem : null,
                      };
                      const next = [entry, ...localSavedResults].slice(0, 10);
                      setLocalSavedResults(next);
                      localStorage.setItem("sechemeter-local-simulations", JSON.stringify(next));
                      toast.success("התוצאה נשמרה מקומית");
                    }}
                    disabled={saveResult.isPending}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {saveResult.isPending ? "שומר..." : "שמירה"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Results */}
      {((user && savedResults && savedResults.length > 0) || (!user && localSavedResults.length > 0)) && (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex w-full items-center justify-between p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">
              תוצאות שנשמרו ({user ? savedResults?.length ?? 0 : localSavedResults.length})
            </h3>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showInfo ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {showInfo && (
              <motion.div {...sectionAnim} className="overflow-hidden">
                <div className="border-t border-border px-4 pb-4">
                  <div className="divide-y divide-border/50">
                    {(user ? savedResults ?? [] : localSavedResults).map((sim: any) => (
                      <div key={sim.id} className="flex items-center justify-between py-2.5 text-sm">
                        <div>
                          <span className="font-medium text-foreground">
                            {uniDisplayNames[sim.university] ?? sim.university}
                          </span>
                          <span className="mx-2 text-muted-foreground">·</span>
                          <span className="text-muted-foreground">{admissionChannelLabels[sim.path] ?? sim.path}</span>
                        </div>
                        <span className="font-mono font-medium text-foreground">{sim.score ?? "-"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SechemCalculator;
