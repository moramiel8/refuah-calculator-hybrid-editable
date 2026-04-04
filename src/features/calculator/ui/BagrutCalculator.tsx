import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GraduationCap, Info } from "lucide-react";
import { toast } from "sonner";
import {
  bagrutUniversities,
  educationTypes,
  bagrutUniversityConfigs,
  examTypeExam,
  examTypeGemer,
} from "@/features/calculator/lib/bagrut-config";
import { calculateBagrutAverage, type BagrutRow } from "@/features/calculator/lib/bagrut-engine";

const HEB_DEFAULTS = [
  { subject: 'תנ"ך', units: 2 },
  { subject: "ספרות", units: 2 },
  { subject: "עברית", units: 2 },
  { subject: "היסטוריה", units: 2 },
  { subject: "אזרחות", units: 2 },
  { subject: "אנגלית", units: 5 },
  { subject: "מתמטיקה", units: 5 },
];

/** מתחת לתנ״ך — ספרות / מחשבת ישראל (בחירה) */
const RELIGIOUS_LITERATURE_OPTIONS = [
  "ספרות ומחשבת ישראל",
  "ספרות",
  "מחשבת ישראל",
] as const;

/** תושב״ע — תושבע״פ או תלמוד (כמו במחשבון הרשמי) */
const RELIGIOUS_TOSHBA_OPTIONS = ['תושבע"פ', "תלמוד"] as const;

/** ברירת מחדל לממלכתי-דתי — תואם טבלת ברירת מחדל מקובלת */
const RELIGIOUS_STATE_DEFAULTS = [
  { subject: 'תנ"ך', units: 3 },
  { subject: RELIGIOUS_LITERATURE_OPTIONS[0], units: 2 },
  { subject: RELIGIOUS_TOSHBA_OPTIONS[0], units: 3 },
  { subject: "עברית", units: 2 },
  { subject: "היסטוריה", units: 2 },
  { subject: "אזרחות", units: 2 },
  { subject: "אנגלית", units: 5 },
  { subject: "מתמטיקה", units: 5 },
];

/** סעיפי תרבות/דת במסלול ערבי — בחירה במקום שם מקצוע חופשי */
const ARAB_CULTURE_SUBJECT_OPTIONS = [
  "תרבות ומורשת איסלאם",
  "מורשת ודת נוצרית",
] as const;

/** ברירת מחדל למסלול ערבי — תואם טבלת מחשבון מקובלת */
const ARAB_DEFAULTS = [
  { subject: "ערבית", units: 3 },
  { subject: "עברית", units: 3 },
  { subject: "היסטוריה", units: 2 },
  { subject: ARAB_CULTURE_SUBJECT_OPTIONS[0], units: 1 },
  { subject: "אזרחות", units: 2 },
  { subject: "אנגלית", units: 5 },
  { subject: "מתמטיקה", units: 5 },
];

let rowIdCounter = 0;
const makeRow = (subject = "", units = 0, subjectSlot?: BagrutRow["subjectSlot"]): BagrutRow => ({
  id: `row-${++rowIdCounter}`,
  subject,
  units,
  grade: 0,
  examType: examTypeExam,
  bonus: 0,
  included: false,
  ...(subjectSlot ? { subjectSlot } : {}),
});

function rowsForEducationType(eduType: string): BagrutRow[] {
  const defaults =
    eduType === "ARAB-STATE-EDUCATION"
      ? ARAB_DEFAULTS
      : eduType === "RELIGIOUS-STATE-EDUCATION"
        ? RELIGIOUS_STATE_DEFAULTS
        : HEB_DEFAULTS;
  const newRows = defaults.map((s, i) => {
    if (eduType === "ARAB-STATE-EDUCATION" && i === 3) {
      return makeRow(s.subject, s.units, "arab-culture");
    }
    if (eduType === "RELIGIOUS-STATE-EDUCATION") {
      if (i === 1) return makeRow(s.subject, s.units, "religious-literature");
      if (i === 2) return makeRow(s.subject, s.units, "religious-toshba");
    }
    return makeRow(s.subject, s.units);
  });
  return newRows;
}

const BagrutCalculator: React.FC = () => {
  const [education, setEducation] = useState("RELIGIOUS-STATE-EDUCATION");
  const [university, setUniversity] = useState("");
  const [rows, setRows] = useState<BagrutRow[]>(() => rowsForEducationType("RELIGIOUS-STATE-EDUCATION"));
  const [showInfo, setShowInfo] = useState(false);
  const [glowColor, setGlowColor] = useState<string | null>(null);

  const liveResult = useMemo(() => {
    if (!university || !education) return null;
    return calculateBagrutAverage(rows, education, university);
  }, [rows, education, university]);

  const displayRows = liveResult?.rows ?? rows;

  const prevAvgRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    const avg = liveResult?.isValid ? liveResult.avg : undefined;
    if (avg !== undefined && prevAvgRef.current !== avg) {
      setGlowColor("primary");
      const t = window.setTimeout(() => setGlowColor(null), 1200);
      prevAvgRef.current = avg;
      return () => window.clearTimeout(t);
    }
    prevAvgRef.current = avg;
  }, [liveResult?.avg, liveResult?.isValid]);

  const uniConfig = useMemo(() => (university ? bagrutUniversityConfigs[university] : null), [university]);
  const selectedUniversityLabel = useMemo(
    () => bagrutUniversities.find((u) => u.id === university)?.label ?? "",
    [university]
  );

  const handleEducationChange = useCallback((eduType: string) => {
    setEducation(eduType);
    setUniversity("");
    setShowInfo(false);
    setRows(rowsForEducationType(eduType));
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
    <div className="w-full min-w-0 space-y-6" dir="rtl">
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
          <div className="w-full min-w-0 overflow-x-hidden">
            {/* Table Header */}
            <div className="grid w-full grid-cols-[minmax(0,1fr)_48px_48px_64px_40px_32px] items-center gap-x-1 gap-y-1 border-b border-border bg-muted/30 px-2 py-3 text-[11px] font-medium text-muted-foreground sm:grid-cols-[minmax(0,1fr)_52px_52px_72px_44px_36px] sm:gap-x-2 sm:px-4 sm:text-xs">
              <span className="min-w-0">מקצוע</span>
              <span className="text-center">יח"ל</span>
              <span className="text-center">ציון</span>
              <span className="text-center">סוג</span>
              <span className="text-center">בונוס</span>
              <span />
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/50">
              {displayRows.map((row) => (
                <div
                  key={row.id}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_48px_48px_64px_40px_32px] items-center gap-x-1 gap-y-1 px-2 py-2.5 transition-colors sm:grid-cols-[minmax(0,1fr)_52px_52px_72px_44px_36px] sm:gap-x-2 sm:px-4 ${
                    row.included ? "bg-primary/5" : ""
                  }`}
                >
                  {education === "ARAB-STATE-EDUCATION" && row.subjectSlot === "arab-culture" ? (
                    <select
                      dir="rtl"
                      value={
                        ARAB_CULTURE_SUBJECT_OPTIONS.includes(row.subject as (typeof ARAB_CULTURE_SUBJECT_OPTIONS)[number])
                          ? row.subject
                          : ARAB_CULTURE_SUBJECT_OPTIONS[0]
                      }
                      onChange={(e) => {
                        handleRowChange(row.id, "subject", e.target.value);
                      }}
                      className="min-w-0 w-full rounded-md border border-input bg-background px-1.5 py-1.5 text-right text-xs text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:px-2 sm:text-sm"
                    >
                      {ARAB_CULTURE_SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : education === "RELIGIOUS-STATE-EDUCATION" && row.subjectSlot === "religious-literature" ? (
                    <select
                      dir="rtl"
                      value={
                        RELIGIOUS_LITERATURE_OPTIONS.includes(row.subject as (typeof RELIGIOUS_LITERATURE_OPTIONS)[number])
                          ? row.subject
                          : RELIGIOUS_LITERATURE_OPTIONS[0]
                      }
                      onChange={(e) => {
                        handleRowChange(row.id, "subject", e.target.value);
                      }}
                      className="min-w-0 w-full rounded-md border border-input bg-background px-1.5 py-1.5 text-right text-xs text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:px-2 sm:text-sm"
                    >
                      {RELIGIOUS_LITERATURE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : education === "RELIGIOUS-STATE-EDUCATION" && row.subjectSlot === "religious-toshba" ? (
                    <select
                      dir="rtl"
                      value={
                        RELIGIOUS_TOSHBA_OPTIONS.includes(row.subject as (typeof RELIGIOUS_TOSHBA_OPTIONS)[number])
                          ? row.subject
                          : RELIGIOUS_TOSHBA_OPTIONS[0]
                      }
                      onChange={(e) => {
                        handleRowChange(row.id, "subject", e.target.value);
                      }}
                      className="min-w-0 w-full rounded-md border border-input bg-background px-1.5 py-1.5 text-right text-xs text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:px-2 sm:text-sm"
                    >
                      {RELIGIOUS_TOSHBA_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      dir="rtl"
                      value={row.subject}
                      onChange={(e) => handleRowChange(row.id, "subject", e.target.value)}
                      placeholder="שם מקצוע"
                      className="min-w-0 w-full rounded-md border border-input bg-background px-1.5 py-1.5 text-right text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:px-2 sm:text-sm"
                    />
                  )}
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

      {/* Refuah actions */}
      {university && education && (
        <div className="space-y-2">
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch sm:justify-center">
            <button
              onClick={() =>
                sendToParent("REFUAH_SAVE_BAGRUT_TO_PROFILE", {
                  bagrutAverage: liveResult?.isValid ? liveResult.avg : null,
                  universityCode: university.replace("-BAGRUT", ""),
                  universityName: selectedUniversityLabel,
                })
              }
              disabled={!liveResult?.isValid}
              className="inline-flex min-h-[42px] min-w-0 flex-1 items-center justify-center whitespace-normal rounded-full border border-border bg-background px-3 py-2.5 text-center text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              שמירה לפרופיל באיזור האישי
            </button>
            <button
              onClick={() =>
                sendToParent("REFUAH_SHARE_ANON_DATA", {
                  bagrutAverage: liveResult?.isValid ? liveResult.avg : null,
                  universityCode: university.replace("-BAGRUT", ""),
                  universityName: selectedUniversityLabel,
                })
              }
              disabled={!liveResult?.isValid}
              className="inline-flex min-h-[42px] min-w-0 flex-1 items-center justify-center whitespace-normal rounded-full bg-primary px-3 py-2.5 text-center text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              שיתוף נתונים אנונימי בטבלת המועמדים באתר
            </button>
          </div>
          {!liveResult?.isValid && (
            <p className="text-center text-xs text-muted-foreground">הכפתורים יופעלו כשהחישוב יהיה תקין (הזנת ציונים וכו׳).</p>
          )}
        </div>
      )}

      {/* Live results */}
      <AnimatePresence>
        {university && education && liveResult && (
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
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">ממוצע בגרות מיטבי</p>
                <motion.p
                  key={String(liveResult.avg)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold tracking-tight text-foreground"
                >
                  {liveResult.avg}
                </motion.p>
                {liveResult.cappedAt && <p className="text-xs text-amber-600 mt-1">תקרה: {liveResult.cappedAt}</p>}
              </div>
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">יח"ל בחישוב</p>
                <p className="text-2xl font-bold text-foreground">{liveResult.totalUnitsInCalc}</p>
              </div>
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">סה"כ יח"ל שהוזנו</p>
                <p className="text-2xl font-bold text-foreground">{liveResult.totalUnitsEntered}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BagrutCalculator;
