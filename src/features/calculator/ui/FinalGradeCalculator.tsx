import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { subjectsConfig, calculateFinalGrade, type SubjectConfig } from "@/features/calculator/lib/final-grade-config";

/** Extract unique base subject names (without unit suffixes) */
const uniqueSubjects = Array.from(
  new Set(
    subjectsConfig.map((s) => {
      // Strip " (X יח״ל)" suffix to get the base name
      const match = s.subject.match(/^(.+?)\s*\(\d+\s*יח[״"]ל\)$/);
      return match ? match[1] : s.subject;
    }),
  ),
);

/** Get available unit options for a given base subject */
function getUnitOptions(baseSubject: string): SubjectConfig[] {
  return subjectsConfig.filter((s) => {
    const match = s.subject.match(/^(.+?)\s*\(\d+\s*יח[״"]ל\)$/);
    const name = match ? match[1] : s.subject;
    return name === baseSubject;
  });
}

const FinalGradeCalculator: React.FC = () => {
  const [selectedBaseSubject, setSelectedBaseSubject] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<number | null>(null);
  const [inputs, setInputs] = useState<Record<string, number | undefined>>({});
  const [glowActive, setGlowActive] = useState(false);

  const unitOptions = useMemo(
    () => (selectedBaseSubject ? getUnitOptions(selectedBaseSubject) : []),
    [selectedBaseSubject],
  );

  // If subject has only one unit option, auto-select it
  const hasMultipleUnits = unitOptions.length > 1;

  const config = useMemo((): SubjectConfig | null => {
    if (!selectedBaseSubject) return null;
    if (hasMultipleUnits) {
      if (selectedUnits === null) return null;
      return unitOptions.find((o) => o.units === selectedUnits) ?? null;
    }
    return unitOptions[0] ?? null;
  }, [selectedBaseSubject, selectedUnits, unitOptions, hasMultipleUnits]);

  const finalGrade = useMemo(() => {
    if (!config) return null;
    return calculateFinalGrade(inputs, config.exams);
  }, [config, inputs]);

  const allFilled = useMemo(() => {
    if (!config) return false;
    return config.exams.every((ex) => {
      const v = inputs[ex.id];
      return v !== undefined && !isNaN(v);
    });
  }, [config, inputs]);

  // Trigger glow when grade appears / changes
  const prevGradeRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (finalGrade !== null && finalGrade !== prevGradeRef.current) {
      setGlowActive(true);
      const t = setTimeout(() => setGlowActive(false), 1200);
      prevGradeRef.current = finalGrade;
      return () => clearTimeout(t);
    }
  }, [finalGrade]);

  const handleSubjectChange = useCallback((value: string) => {
    setSelectedBaseSubject(value);
    setSelectedUnits(null);
    setInputs({});
  }, []);

  const handleUnitsChange = useCallback((units: number) => {
    setSelectedUnits(units);
    setInputs({});
  }, []);

  const handleInput = useCallback((examId: string, raw: string) => {
    const num = raw === "" ? undefined : parseFloat(raw);
    // Clamp to 0-100
    const clamped = num !== undefined && !isNaN(num) ? Math.min(100, Math.max(0, num)) : num;
    setInputs((prev) => ({ ...prev, [examId]: clamped }));
  }, []);

  const handleClear = useCallback(() => {
    setInputs({});
  }, []);

  return (
    <div className="w-full min-w-0 space-y-6" dir="rtl">
      <h2 className="text-xl font-bold tracking-tight text-foreground">מחשבון ציון סופי לבגרות</h2>

      {/* Step 1: Subject Selector */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-foreground">בחר מקצוע</label>
        <select
          value={selectedBaseSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">— בחר מקצוע —</option>
          {uniqueSubjects.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Units Selector (only if multiple options) */}
      <AnimatePresence mode="wait">
        {selectedBaseSubject && hasMultipleUnits && (
          <motion.div
            key={`units-${selectedBaseSubject}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <label className="mb-2 block text-sm font-medium text-foreground">בחר מספר יחידות</label>
            <div className="flex flex-wrap gap-2">
              {unitOptions.map((opt) => (
                <button
                  key={opt.units}
                  onClick={() => handleUnitsChange(opt.units)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedUnits === opt.units
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {opt.units} יח״ל
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam Inputs */}
      <AnimatePresence mode="wait">
        {config && (
          <motion.div
            key={config.subject}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4"
          >
            <div className="flex min-w-0 items-center justify-between gap-2">
              <h3 className="min-w-0 break-words text-base font-semibold text-foreground">
                חישוב ציון סופי ב{selectedBaseSubject} ({config.units} יח״ל)
              </h3>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                נקה
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              הזנת את הציון לכל שאלון (0-100) — הציון הסופי יחושב אוטומטית לפי המשקלים.
            </p>

            <div className="space-y-3">
              {config.exams.map((exam) => {
                const pct = Math.round(exam.weight * 100);
                return (
                  <div key={exam.id}>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      שאלון {exam.id} <span className="text-muted-foreground">({pct}%)</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      dir="rtl"
                      value={inputs[exam.id] ?? ""}
                      onChange={(e) => handleInput(exam.id, e.target.value)}
                      placeholder={`ציון ${exam.id} (${pct}%)`}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground text-right placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {config && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border p-6 shadow-sm transition-all duration-500 ${
              finalGrade !== null
                ? `border-primary/30 bg-primary/5 ${glowActive ? "shadow-[0_0_20px_hsl(var(--primary)/0.3)]" : ""}`
                : "border-border bg-card"
            }`}
          >
            {!allFilled ? (
              <p className="text-center text-sm text-muted-foreground">יש להשלים את כל הציונים כדי לחשב ציון סופי</p>
            ) : finalGrade !== null ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">ציון סופי</p>
                  <motion.p
                    key={String(finalGrade)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-bold tracking-tight text-foreground"
                  >
                    {finalGrade}
                  </motion.p>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalGradeCalculator;
