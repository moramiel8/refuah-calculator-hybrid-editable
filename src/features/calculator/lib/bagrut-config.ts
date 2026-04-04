// ============================================================
// Exact port of bagrut-config.js — ALL rules preserved as-is
// ============================================================

// Mandatory Subjects Lists by Education Types
export const hebMandatorySubjects = ["עברית", "אנגלית", "היסטוריה", "אזרחות", "מתמטיקה"];
export const arabMandatorySubjects = ["ערבית", "אנגלית", "היסטוריה", "אזרחות", "מתמטיקה"];

// Ivrit Kasha Safa — subject synonyms
const bible = ["תנך", 'תנ"ך'];
const physics = ["פיזיקה", "פיסיקה"];
const compSci = ["מדעי המחשב", "מחשבים", "מדמח", 'מדמ"ח'];
const toshba = ['תושב"ע', "תושבע", 'תורה שבע"פ', "תורה שבעפ", "תורה שבעל פה", 'תושבע"פ', "תושבעפ", "תלמוד"];

// Science & technology subjects
const sciSubjects = [...physics, "ביולוגיה", "כימיה"];
const techSubjects = [
  ...compSci,
  "בקרת מכונות",
  "אלקטרוניקה ומחשבים",
  "מדעי ההנדסה",
  "ביוטכנולוגיה",
  "מערכות ביוטכנולוגיה",
  "יישומי ביוטכנולוגיה",
];

// Mizraf subject — for Technion average calculations
export const mizrafTechSubjects = [...sciSubjects, ...techSubjects];

// Subjects with a very high bonus score (25+ for 5 units)
const bonusSubjects = [...sciSubjects, "אנגלית", "היסטוריה", "ספרות", "ספרות ומחשבת ישראל", ...bible];

// Bonus Constants
export const noBonus = 0;
export const thirtyFiveBonus = 35;
export const thirtyBonus = 30;
export const twentyFiveBonus = 25;
export const twentyBonus = 20;
export const fifteenBonus = 15;
export const twelvePlusHalfBonus = 12.5;
export const tenBonus = 10;
export const minBonusGrade = 60;

// Grades / Units constants
export const fiveUnits = 5;
export const fourUnits = 4;
export const gradeMinVal = 0;
export const gradeMaxVal = 100;
export const unitsMinVal = 1;
export const unitsMaxVal = 10;

// Exam types
export const examTypeGemer = "עבודה";
export const examTypeExam = "בחינה";

// Subject names
export const math = "מתמטיקה";
export const english = "אנגלית";
export const hebrew = "עברית";

// Min mizraf subjects for Technion
export const minMizrafSubjects = 2;

// ============== General Rules (ported from bagrut-general-rules.js) ==============

export const isFailureGrade = (grade: number): boolean => grade < minBonusGrade;

export const isGemer = (examType: string, _units: number): boolean =>
  examType === examTypeGemer;

export const isFiveUnitsSubject = (units: number): boolean => units >= fiveUnits;

export const isFourUnitsSubject = (units: number): boolean =>
  units === fourUnits;

export const isFiveUnitsMath = (subject: string, units: number, examType: string = examTypeExam, grade: number = minBonusGrade): boolean => {
  if (subject === math && examType === examTypeExam && (!isFiveUnitsSubject(units) || grade < minBonusGrade)) return false;
  if (subject === math && examType === examTypeExam && isFiveUnitsSubject(units) && grade >= minBonusGrade) return true;
  return false;
};

export const isFourUnitsMath = (subject: string, units: number): boolean =>
  subject === math && units === fourUnits;

export const isFourUnitsEnglish = (subject: string, units: number): boolean =>
  subject === english && units === fourUnits;

export const isFiveUnitsHebrew = (subject: string, units: number): boolean =>
  subject === hebrew && isFiveUnitsSubject(units);

export const isFiveUnitsBonusSubject = (subject: string, units: number, bonusList: string[]): boolean =>
  isFiveUnitsSubject(units) && bonusList.some(b => subject === b);

export const isFourUnitsBonusSubject = (subject: string, units: number, bonusList: string[]): boolean =>
  units === fourUnits && bonusList.some(b => subject === b);

export const isNoBonusSubject = (subject: string, noBonusList: string[]): boolean =>
  noBonusList.some(b => subject === b);

export const isMizrafSubject = (subject: string): boolean =>
  mizrafTechSubjects.some(m => subject === m);

// ============== Bonus Rule Type ==============

export interface SubjectInput {
  subject: string;
  units: number;
  grade: number;
  examType: string;
}

export interface BonusRule {
  name: string;
  condition: (input: SubjectInput, config: UniBagrutConfig) => boolean;
  bonus: number;
}

export interface UniBagrutConfig {
  id: string;
  name: string;
  minUnitsRequired: number;
  maxAvg?: number;
  mandatorySubjects: string[];
  bonusSubjects: string[];
  noBonusSubjects: string[];
  bonusRules: BonusRule[];
  ref?: string;
  dialogTitle?: string;
  dialogText?: string;
}

// ============== University Bagrut Configs (exact port) ==============

export const bagrutUniversityConfigs: Record<string, UniBagrutConfig> = {
  "TAU-BAGRUT": {
    id: "TAU-BAGRUT",
    name: "תל אביב",
    minUnitsRequired: 20,
    maxAvg: 117,
    mandatorySubjects: [...hebMandatorySubjects],
    bonusSubjects: [...bonusSubjects],
    noBonusSubjects: [],
    ref: "https://go.tau.ac.il/he/ba/how-to-calculate",
    dialogTitle: "ממוצע בגרות תל אביב",
    dialogText: 'דרישות: זכאות לבגרות, ציון עובר באנגלית 4 יח"ל+, 20 יח"ל לפחות',
    bonusRules: [
      { name: "Failing grade → no bonus", condition: ({ subject, grade }, config) => isNoBonusSubject(subject, config.noBonusSubjects) || isFailureGrade(grade), bonus: noBonus },
      { name: "Gemer → 20 bonus", condition: ({ examType, units }) => isGemer(examType, units), bonus: twentyBonus },
      { name: "5 units Math → 35 bonus", condition: ({ subject, units }) => isFiveUnitsMath(subject, units), bonus: thirtyFiveBonus },
      { name: "4 units Math or English → 12.5 bonus", condition: ({ subject, units }) => isFourUnitsMath(subject, units) || isFourUnitsEnglish(subject, units), bonus: twelvePlusHalfBonus },
      { name: "5 units bonus subject → 25 bonus", condition: ({ subject, units }, config) => isFiveUnitsBonusSubject(subject, units, config.bonusSubjects), bonus: twentyFiveBonus },
      { name: "General 5 units subject → 20 bonus", condition: ({ units }) => isFiveUnitsSubject(units), bonus: twentyBonus },
      { name: "General 4 units subject → 10 bonus", condition: ({ units }) => isFourUnitsSubject(units), bonus: tenBonus },
    ],
  },
  "HUJI-BAGRUT": {
    id: "HUJI-BAGRUT",
    name: "העברית",
    minUnitsRequired: 20,
    maxAvg: 120,
    mandatorySubjects: [...hebMandatorySubjects],
    bonusSubjects: [...bonusSubjects, ...compSci, "מחשבת ישראל", "ערבית", "אזרחות", "מתמטיקה"],
    noBonusSubjects: [],
    ref: "https://info.huji.ac.il/reception-components/bagrut-bonus",
    dialogTitle: "ממוצע בגרות העברית",
    dialogText: 'דרישות: זכאות לבגרות, ציון עובר באנגלית 4 יח"ל+, 20 יח"ל לפחות',
    bonusRules: [
      { name: "Failing grade → no bonus", condition: ({ subject, grade }, config) => isNoBonusSubject(subject, config.noBonusSubjects) || isFailureGrade(grade), bonus: noBonus },
      { name: "5 units Math → 35 bonus", condition: ({ subject, units, examType }) => isFiveUnitsMath(subject, units, examType), bonus: thirtyFiveBonus },
      { name: "4 units Math → 12.5 bonus", condition: ({ subject, units }) => isFourUnitsMath(subject, units), bonus: twelvePlusHalfBonus },
      { name: "5 units Hebrew → 15 bonus", condition: ({ subject, units }) => isFiveUnitsHebrew(subject, units), bonus: fifteenBonus },
      { name: "5 units bonus subject → 20 bonus", condition: ({ subject, units }, config) => isFiveUnitsBonusSubject(subject, units, config.bonusSubjects), bonus: twentyBonus },
      { name: "4 units bonus subject → 10 bonus", condition: ({ subject, units }, config) => isFourUnitsBonusSubject(subject, units, config.bonusSubjects), bonus: tenBonus },
      { name: "General 5 units subject → 10 bonus", condition: ({ units }) => isFiveUnitsSubject(units), bonus: tenBonus },
    ],
  },
  "TECH-BAGRUT": {
    id: "TECH-BAGRUT",
    name: "טכניון",
    minUnitsRequired: 21,
    maxAvg: 119,
    mandatorySubjects: [...hebMandatorySubjects],
    bonusSubjects: [...bonusSubjects, ...compSci],
    noBonusSubjects: [],
    ref: "https://admissions.technion.ac.il/calculation-of-the-median-grade/",
    dialogTitle: "ממוצע בגרות טכניון",
    dialogText: 'דרישות: 21 יח"ל לפחות, מתמטיקה 5 יח"ל 70+ או 4+ יח"ל ובחינת סיווג',
    bonusRules: [
      { name: "Failing grade → no bonus", condition: ({ subject, grade }, config) => isNoBonusSubject(subject, config.noBonusSubjects) || isFailureGrade(grade), bonus: noBonus },
      { name: "Gemer → 20 bonus", condition: ({ examType, units }) => isGemer(examType, units), bonus: twentyBonus },
      { name: "5 units Math → 35 bonus", condition: ({ subject, units }) => isFiveUnitsMath(subject, units), bonus: thirtyFiveBonus },
      { name: "4 units Math → 20 bonus", condition: ({ subject, units }) => isFourUnitsMath(subject, units), bonus: twentyBonus },
      { name: "4 units English → 12.5 bonus", condition: ({ subject, units }) => isFourUnitsEnglish(subject, units), bonus: twelvePlusHalfBonus },
      { name: "5 units bonus subject → 25 bonus", condition: ({ subject, units }, config) => isFiveUnitsBonusSubject(subject, units, config.bonusSubjects), bonus: twentyFiveBonus },
      { name: "General 5 units subject → 20 bonus", condition: ({ units }) => isFiveUnitsSubject(units), bonus: twentyBonus },
      { name: "General 4 units subject → 10 bonus", condition: ({ units }) => isFourUnitsSubject(units), bonus: tenBonus },
    ],
  },
  "BGU-BAGRUT": {
    id: "BGU-BAGRUT",
    name: "בן גוריון",
    minUnitsRequired: 20,
    maxAvg: 120,
    mandatorySubjects: [...hebMandatorySubjects],
    bonusSubjects: [...bonusSubjects, ...compSci],
    noBonusSubjects: [],
    ref: "https://www.bgu.ac.il/media/0p3ppz0n/ידיעון-תואר-ראשון.pdf",
    dialogTitle: "ממוצע בגרות בן גוריון",
    dialogText: 'דרישות: 20 יח"ל לפחות',
    bonusRules: [
      { name: "Failing grade → no bonus", condition: ({ subject, grade }, config) => isNoBonusSubject(subject, config.noBonusSubjects) || isFailureGrade(grade), bonus: noBonus },
      { name: "Gemer → 20 bonus", condition: ({ examType, units }) => isGemer(examType, units), bonus: twentyBonus },
      { name: "5 units Math → 35 bonus", condition: ({ subject, units }) => isFiveUnitsMath(subject, units), bonus: thirtyFiveBonus },
      { name: "4 units Math or English → 12.5 bonus", condition: ({ subject, units }) => isFourUnitsMath(subject, units) || isFourUnitsEnglish(subject, units), bonus: twelvePlusHalfBonus },
      { name: "5 units bonus subject → 25 bonus", condition: ({ subject, units }, config) => isFiveUnitsBonusSubject(subject, units, config.bonusSubjects), bonus: twentyFiveBonus },
      { name: "General 5 units subject → 20 bonus", condition: ({ units }) => isFiveUnitsSubject(units), bonus: twentyBonus },
      { name: "General 4 units subject → 10 bonus", condition: ({ units }) => isFourUnitsSubject(units), bonus: tenBonus },
    ],
  },
  "BIU-BAGRUT": {
    id: "BIU-BAGRUT",
    name: "בר אילן",
    minUnitsRequired: 20,
    maxAvg: 120,
    mandatorySubjects: [...hebMandatorySubjects],
    bonusSubjects: [...bonusSubjects, ...compSci, ...toshba, "מחשבת ישראל", "ספרות"],
    noBonusSubjects: [],
    ref: "https://www.biu.ac.il/registration-and-admission/information/general-admission-req/matriculation-calculation",
    dialogTitle: "ממוצע בגרות בר אילן",
    dialogText: 'דרישות: 20 יח"ל לפחות',
    bonusRules: [
      { name: "Failing grade → no bonus", condition: ({ subject, grade }, config) => isNoBonusSubject(subject, config.noBonusSubjects) || isFailureGrade(grade), bonus: noBonus },
      { name: "Gemer → 20 bonus", condition: ({ examType, units }) => isGemer(examType, units), bonus: twentyBonus },
      { name: "5 units Math → 30 bonus", condition: ({ subject, units }) => isFiveUnitsMath(subject, units), bonus: thirtyBonus },
      { name: "4 units Math → 12.5 bonus", condition: ({ subject, units }) => isFourUnitsMath(subject, units), bonus: twelvePlusHalfBonus },
      { name: "4 units English → 12.5 bonus", condition: ({ subject, units }) => isFourUnitsEnglish(subject, units), bonus: twelvePlusHalfBonus },
      { name: "5 units bonus subject → 20 bonus", condition: ({ subject, units }, config) => isFiveUnitsBonusSubject(subject, units, config.bonusSubjects), bonus: twentyBonus },
      { name: "General 5 units subject → 10 bonus", condition: ({ units }) => isFiveUnitsSubject(units), bonus: tenBonus },
      { name: "General 4 units subject → 10 bonus", condition: ({ units }) => isFourUnitsSubject(units), bonus: tenBonus },
    ],
  },
  "HAIFA-BAGRUT": {
    id: "HAIFA-BAGRUT",
    name: "חיפה",
    minUnitsRequired: 20,
    maxAvg: 120,
    mandatorySubjects: [...hebMandatorySubjects],
    bonusSubjects: [...bonusSubjects, ...compSci],
    noBonusSubjects: [],
    ref: "https://www.haifa.ac.il/חישוב-ציון-קבלה-סכם/",
    dialogTitle: "ממוצע בגרות חיפה",
    dialogText: 'דרישות: 20 יח"ל לפחות',
    bonusRules: [
      { name: "Failing grade → no bonus", condition: ({ subject, grade }, config) => isNoBonusSubject(subject, config.noBonusSubjects) || isFailureGrade(grade), bonus: noBonus },
      { name: "Gemer → 20 bonus", condition: ({ examType, units }) => isGemer(examType, units), bonus: twentyBonus },
      { name: "5 units Math → 35 bonus", condition: ({ subject, units }) => isFiveUnitsMath(subject, units), bonus: thirtyFiveBonus },
      { name: "4 units Math or English → 12.5 bonus", condition: ({ subject, units }) => isFourUnitsMath(subject, units) || isFourUnitsEnglish(subject, units), bonus: twelvePlusHalfBonus },
      { name: "5 units bonus subject → 25 bonus", condition: ({ subject, units }, config) => isFiveUnitsBonusSubject(subject, units, config.bonusSubjects), bonus: twentyFiveBonus },
      { name: "General 5 units subject → 20 bonus", condition: ({ units }) => isFiveUnitsSubject(units), bonus: twentyBonus },
      { name: "General 4 units subject → 10 bonus", condition: ({ units }) => isFourUnitsSubject(units), bonus: tenBonus },
    ],
  },
  "ARIEL-BAGRUT": {
    id: "ARIEL-BAGRUT",
    name: "אריאל",
    minUnitsRequired: 20,
    maxAvg: 120,
    mandatorySubjects: [...hebMandatorySubjects],
    bonusSubjects: [...bonusSubjects],
    noBonusSubjects: [],
    ref: "https://pniot.ariel.ac.il/projects/tzmm/NewCalcMark/CalcMark.asp",
    dialogTitle: "ממוצע בגרות אריאל",
    dialogText: 'דרישות: 20 יח"ל לפחות',
    bonusRules: [
      { name: "Failing grade → no bonus", condition: ({ subject, grade }, config) => isNoBonusSubject(subject, config.noBonusSubjects) || isFailureGrade(grade), bonus: noBonus },
      { name: "Gemer → 20 bonus", condition: ({ examType, units }) => isGemer(examType, units), bonus: twentyBonus },
      { name: "5 units Math → 35 bonus", condition: ({ subject, units }) => isFiveUnitsMath(subject, units), bonus: thirtyFiveBonus },
      { name: "4 units Math or English → 12.5 bonus", condition: ({ subject, units }) => isFourUnitsMath(subject, units) || isFourUnitsEnglish(subject, units), bonus: twelvePlusHalfBonus },
      { name: "5 units bonus subject → 25 bonus", condition: ({ subject, units }, config) => isFiveUnitsBonusSubject(subject, units, config.bonusSubjects), bonus: twentyFiveBonus },
      { name: "General 5 units subject → 20 bonus", condition: ({ units }) => isFiveUnitsSubject(units), bonus: twentyBonus },
      { name: "General 4 units subject → 10 bonus", condition: ({ units }) => isFourUnitsSubject(units), bonus: tenBonus },
    ],
  },
};

// Education types
export const educationTypes = [
  { id: "STATE-EDUCATION", label: "ממלכתי" },
  { id: "RELIGIOUS-STATE-EDUCATION", label: "ממלכתי-דתי" },
  { id: "ARAB-STATE-EDUCATION", label: "ערבי" },
] as const;

// Map education type to mandatory subjects
export function getMandatorySubjects(educationType: string): string[] {
  if (educationType === "ARAB-STATE-EDUCATION") return arabMandatorySubjects;
  return hebMandatorySubjects;
}

// Available universities for bagrut calculation
export const bagrutUniversities = [
  { id: "TAU-BAGRUT", label: "תל אביב" },
  { id: "HUJI-BAGRUT", label: "העברית" },
  { id: "TECH-BAGRUT", label: "טכניון" },
  { id: "BGU-BAGRUT", label: "בן גוריון" },
  { id: "BIU-BAGRUT", label: "בר אילן" },
  { id: "HAIFA-BAGRUT", label: "חיפה" },
  { id: "ARIEL-BAGRUT", label: "אריאל" },
] as const;
