import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GraduationCap, Info, Save } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bagrutUniversities,
  educationTypes,
  bagrutUniversityConfigs,
  examTypeExam,
  examTypeGemer,
  getMandatorySubjects,
} from "@/features/calculator/lib/bagrut-config";
import { calculateBagrutAverage, type BagrutRow, type BagrutResult } from "@/features/calculator/lib/bagrut-engine";

const HEB_DEFAULTS = [
  { subject: 'תנ"ך', units: 2 },
  { subject: "עברית", units: 2 },
  { subject: "אנגלית", units: 3 },
  { subject: "היסטוריה", units: 2 },
  { subject: "אזרחות", units: 2 },
  { subject: "מתמטיקה", units: 3 },
  { subject: "ספרות", units: 2 },
];

const ARAB_DEFAULTS = [
  { subject: "ערבית", units: 2 },
  { subject: "אנגלית", units: 3 },
  { subject: "היסטוריה", units: 2 },
  { subject: "אזרחות", units: 2 },
  { subject: "מתמטיקה", units: 3 },
];

let rowIdCounter = 0;
const makeRow = (subject = "", units = 0): BagrutRow => ({
  id: `row-${++rowIdCounter}`,
  subject,
  units,
  grade: 0,
  examType: examTypeExam,
  bonus: 0,
  included: false,
});

const BagrutCalculator: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [education, setEducation] = useState("");
  const [university, setUniversity] = useState("");
  const [rows, setRows] = useState<BagrutRow[]>(() => Array.from({ length: 5 }, () => makeRow()));
  const [result, setResult] = useState<BagrutResult | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [glowColor, setGlowColor] = useState<string | null>(null);

  const uniConfig = useMemo(() => (university ? bagrutUniversityConfigs[university] : null), [university]);
  const selectedUniversityLabel = useMemo(
    () => bagrutUniversities.find((u) => u.id === university)?.label ?? "",
    [university]
  );

  const handleEducationChange = useCallback((eduType: string) => {
    setEducation(eduType);
    setUniversity("");
    setResult(null);
    setShowInfo(false);
    const defaults = eduType === "ARAB-STATE-EDUCATION" ? ARAB_DEFAULTS : HEB_DEFAULTS;
    const newRows = defaults.map((s) => makeRow(s.subject, s.units));
    newRows.push(makeRow(), makeRow());
    setRows(newRows);
  }, []);

  const handleAddRow = useCallback(() => {
    setRows((prev) => [...prev, makeRow()]);
  }, []);

  const handleRemoveRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleRowChange = useCallback((id: string, field: keyof BagrutRow, value: string | number) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  const handleCalculate = useCallback(() => {
    if (!university || !education) return;
    const res = calculateBagrutAverage(rows, education, university);
    setResult(res);
    setRows(res.rows);
    if (res.isValid && res.avg) {
      setGlowColor("primary");
      setTimeout(() => setGlowColor(null), 1200);
    }
  }, [rows, university, education]);

  const saveBagrutResult = useMutation({
    mutationFn: async () => {
      if (!user || !result || !result.isValid) throw new Error("Missing data");
      const { error } = await supabase.from("simulations").insert({
        user_id: user.id,
        university,
        path: education,
        score: result.avg,
        result: {
          avg: result.avg,
          totalUnitsInCalc: result.totalUnitsInCalc,
          totalUnitsEntered: result.totalUnitsEntered,
          type: "bagrut",
        },
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("תוצאת הבגרות נשמרה");
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
    },
    onError: () => toast.error("שגיאה בשמירה"),
  });

  const sendToParent = useCallback(
    async (
      type: "REFUAH_SAVE_BAGRUT_TO_PROFILE" | "REFUAH_SHARE_ANON_DATA",
      payload: Record<string, unknown>
    ) => {
      if (typeof window === "undefined" || window.parent === window) {
        toast.error("הכפתור פעיל רק כאשר המחשבון נטען בתוך Refuah (iframe)");
        return;
      }

      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const ack = new Promise<{ ok: boolean; error?: string }>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          window.removeEventListener("message", onMessage);
          reject(new Error("לא התקבלה תגובה מ-Refuah"));
        }, 5000);

        const onMessage = (event: MessageEvent) => {
          const data = event.data as any;
          if (!data || data.source !== "refuah-parent" || data.type !== "REFUAH_IFRAME_ACK" || data.requestId !== requestId) {
            return;
          }
          window.clearTimeout(timeout);
          window.removeEventListener("message", onMessage);
          resolve({ ok: !!data.ok, error: data.error ? String(data.error) : undefined });
        };

        window.addEventListener("message", onMessage);
      });

      window.parent.postMessage(
        {
          source: "sechemeter-iframe",
          type,
          requestId,
          payload,
        },
        "*"
      );

      try {
        const response = await ack;
        if (!response.ok) {
          toast.error(response.error || "Refuah דחה את הבקשה");
          return;
        }
        toast.success("הנתונים נשלחו ל-Refuah בהצלחה");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "שגיאה בשליחת נתונים");
      }
    },
    []
  );

  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="text-xl font-bold tracking-tight text-foreground">מחשבון ממוצע בגרות</h2>

      {/* Education Type */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-foreground">סוג תעודת בגרות</label>
        <div className="flex flex-wrap gap-2">
          {educationTypes.map((ed) => (
            <button
              key={ed.id}
              onClick={() => handleEducationChange(ed.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                education === ed.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {ed.label}
            </button>
          ))}
        </div>
      </div>

      {/* University Selection */}
      {education && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">מוסד לימודים</label>
            {uniConfig && (
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="h-3.5 w-3.5" />
                מידע נוסף
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {bagrutUniversities.map((uni) => (
              <button
                key={uni.id}
                onClick={() => {
                  setUniversity(uni.id);
                  setResult(null);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  university === uni.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {uni.label}
              </button>
            ))}
          </div>

          {/* Info Section */}
          <AnimatePresence>
            {showInfo && uniConfig && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden rounded-lg border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground space-y-2"
              >
                <p className="font-medium text-foreground">{uniConfig.dialogTitle}</p>
                <p>{uniConfig.dialogText}</p>
                {uniConfig.maxAvg && (
                  <p className="text-xs">
                    <span className="font-medium text-foreground">תקרה מקסימלית:</span> {uniConfig.maxAvg}
                  </p>
                )}
                {uniConfig.ref && (
                  <a
                    href={uniConfig.ref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-primary hover:underline text-xs"
                  >
                    קישור למידע נוסף ←
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Subjects Table */}
      {university && education && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-[minmax(100px,1fr)_60px_60px_80px_50px_36px] min-w-[440px] gap-2 border-b border-border bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground">
              <span>מקצוע</span>
              <span>יח"ל</span>
              <span>ציון</span>
              <span>סוג</span>
              <span>בונוס</span>
              <span></span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/50">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className={`grid grid-cols-[minmax(100px,1fr)_60px_60px_80px_50px_36px] min-w-[440px] items-center gap-2 px-4 py-2.5 transition-colors ${
                    row.included ? "bg-primary/5" : ""
                  }`}
                >
                  <input
                    type="text"
                    dir="rtl"
                    value={row.subject}
                    onChange={(e) => handleRowChange(row.id, "subject", e.target.value)}
                    placeholder="שם מקצוע"
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-right text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <input
                    type="number"
                    value={row.units || ""}
                    onChange={(e) => handleRowChange(row.id, "units", parseInt(e.target.value) || 0)}
                    min={1}
                    max={10}
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground text-center focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <input
                    type="number"
                    value={row.grade || ""}
                    onChange={(e) => handleRowChange(row.id, "grade", parseInt(e.target.value) || 0)}
                    min={0}
                    max={100}
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground text-center focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <select
                    value={row.examType}
                    onChange={(e) => handleRowChange(row.id, "examType", e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-1 py-1.5 text-xs text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value={examTypeExam}>בחינה</option>
                    <option value={examTypeGemer}>עבודה</option>
                  </select>
                  <span className="text-center text-sm font-mono text-foreground">{row.bonus || 0}</span>
                  <button
                    onClick={() => handleRemoveRow(row.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="מחק מקצוע"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Row Button */}
          <div className="border-t border-border px-4 py-3">
            <button
              onClick={handleAddRow}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="h-4 w-4" />
              הוספת מקצוע
            </button>
          </div>
        </motion.div>
      )}

      {/* Calculate Button */}
      {university && education && (
        <div className="space-y-2">
          <button
            onClick={handleCalculate}
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90"
          >
            חישוב ממוצע בגרות
          </button>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() =>
                sendToParent("REFUAH_SAVE_BAGRUT_TO_PROFILE", {
                  bagrutAverage: result?.isValid ? result.avg : null,
                  universityCode: university.replace("-BAGRUT", ""),
                    universityName: selectedUniversityLabel,
                })
              }
              disabled={!result?.isValid}
              className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              שמירה לפרופיל ב-Refuah
            </button>
            <button
              onClick={() =>
                sendToParent("REFUAH_SHARE_ANON_DATA", {
                  bagrutAverage: result?.isValid ? result.avg : null,
                  universityCode: university.replace("-BAGRUT", ""),
                    universityName: selectedUniversityLabel,
                })
              }
              disabled={!result?.isValid}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              שיתוף נתונים אנונימי ב-Refuah
            </button>
          </div>
          {!result?.isValid && <p className="text-center text-xs text-muted-foreground">הכפתורים יופעלו אחרי חישוב תוצאה תקינה.</p>}
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && result.isValid && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm transition-shadow duration-500 ${
              glowColor ? "shadow-[0_0_20px_hsl(var(--primary)/0.3)]" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">תוצאות חישוב</h3>
              </div>
              {user && (
                <button
                  onClick={() => saveBagrutResult.mutate()}
                  disabled={saveBagrutResult.isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saveBagrutResult.isPending ? "שומר..." : "שמירת תוצאה"}
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">ממוצע בגרות מיטבי</p>
                <motion.p
                  key={String(result.avg)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold tracking-tight text-foreground"
                >
                  {result.avg}
                </motion.p>
                {result.cappedAt && <p className="text-xs text-amber-600 mt-1">תקרה: {result.cappedAt}</p>}
              </div>
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">יח"ל בחישוב</p>
                <p className="text-2xl font-bold text-foreground">{result.totalUnitsInCalc}</p>
              </div>
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">סה"כ יח"ל שהוזנו</p>
                <p className="text-2xl font-bold text-foreground">{result.totalUnitsEntered}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BagrutCalculator;
