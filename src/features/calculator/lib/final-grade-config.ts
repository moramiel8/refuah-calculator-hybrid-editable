/**
 * Subject exam configuration for final grade calculator.
 * Each subject has a list of exam parts (שאלונים) with IDs and weights.
 * Extendable — just add more entries to the array.
 */

export type ExamPart = {
  id: string;       // קוד שאלון
  weight: number;   // משקל (0–1)
  label?: string;   // תיאור אופציונלי
};

export type SubjectConfig = {
  subject: string;
  units: number;
  exams: ExamPart[];
};

export const subjectsConfig: SubjectConfig[] = [
  {
    subject: "היסטוריה",
    units: 2,
    exams: [
      { id: "22261", weight: 0.7 },
      { id: "22262", weight: 0.3 },
    ],
  },
  {
    subject: "ספרות",
    units: 2,
    exams: [
      { id: "22381", weight: 0.7 },
      { id: "22382", weight: 0.3 },
    ],
  },
  {
    subject: 'תנ"ך',
    units: 2,
    exams: [
      { id: "1261", weight: 0.5 },
      { id: "1262", weight: 0.5 },
    ],
  },
  {
    subject: "אזרחות",
    units: 2,
    exams: [
      { id: "34261", weight: 0.5 },
      { id: "34262", weight: 0.5 },
    ],
  },
  {
    subject: "עברית",
    units: 2,
    exams: [
      { id: "16281", weight: 0.5 },
      { id: "16282", weight: 0.5 },
    ],
  },
  {
    subject: "אנגלית (3 יח״ל)",
    units: 3,
    exams: [
      { id: "16381", weight: 0.5 },
      { id: "16382", weight: 0.5 },
    ],
  },
  {
    subject: "אנגלית (4 יח״ל)",
    units: 4,
    exams: [
      { id: "16481", weight: 0.4 },
      { id: "16482", weight: 0.3 },
      { id: "16483", weight: 0.3 },
    ],
  },
  {
    subject: "אנגלית (5 יח״ל)",
    units: 5,
    exams: [
      { id: "16581", weight: 0.35 },
      { id: "16582", weight: 0.35 },
      { id: "16583", weight: 0.3 },
    ],
  },
  {
    subject: "מתמטיקה (3 יח״ל)",
    units: 3,
    exams: [
      { id: "35182", weight: 0.25 },
      { id: "35381", weight: 0.35 },
      { id: "35382", weight: 0.4 },
    ],
  },
  {
    subject: "מתמטיקה (4 יח״ל)",
    units: 4,
    exams: [
      { id: "35481", weight: 0.65, label: "שאלון 804" },
      { id: "35482", weight: 0.35, label: "שאלון 805" },
    ],
  },
  {
    subject: "מתמטיקה (5 יח״ל)",
    units: 5,
    exams: [
      { id: "35581", weight: 0.6, label: "שאלון 806" },
      { id: "35582", weight: 0.4, label: "שאלון 807" },
    ],
  },
  {
    subject: "פיזיקה",
    units: 5,
    exams: [
      { id: "37581", weight: 0.25, label: "מכניקה" },
      { id: "37582", weight: 0.25, label: "חשמל" },
      { id: "37583", weight: 0.15, label: "מעבדה רגילה" },
      { id: "37584", weight: 0.15, label: "מעבדת חקר" },
      { id: "37585", weight: 0.2, label: "קרינה וחומר" },
    ],
  },
  {
    subject: "כימיה",
    units: 5,
    exams: [
      { id: "39581", weight: 0.6, label: "שאלון עיוני" },
      { id: "39582", weight: 0.4, label: "מעבדה / עבודה" },
    ],
  },
  {
    subject: "ביולוגיה",
    units: 5,
    exams: [
      { id: "43581", weight: 0.4, label: "שאלון עיוני" },
      { id: "43582", weight: 0.3, label: "מעבדת ניסוי" },
      { id: "43583", weight: 0.3, label: "ביוחקר" },
    ],
  },
  {
    subject: "מדעי המחשב",
    units: 5,
    exams: [
      { id: "42581", weight: 0.5 },
      { id: "42582", weight: 0.5 },
    ],
  },
];

/**
 * Calculate the weighted final grade for a subject.
 * Returns null if no valid inputs are provided.
 */
export function calculateFinalGrade(
  inputs: Record<string, number | undefined>,
  exams: ExamPart[]
): number | null {
  let totalWeight = 0;
  let weightedSum = 0;
  let hasAnyInput = false;

  for (const exam of exams) {
    const grade = inputs[exam.id];
    if (grade !== undefined && grade !== null && !isNaN(grade)) {
      hasAnyInput = true;
      weightedSum += grade * exam.weight;
      totalWeight += exam.weight;
    }
  }

  if (!hasAnyInput) return null;

  // All exams must have input for a valid final grade
  if (Math.abs(totalWeight - 1) > 0.01) return null;

  return Math.round(weightedSum * 100) / 100;
}
