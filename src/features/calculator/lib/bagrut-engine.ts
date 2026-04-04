// ============================================================
// Bagrut Average Calculator — exact port of bagrut-avg-calc.js
// ============================================================

import { roundDigits } from "./formulas";
import {
  bagrutUniversityConfigs,
  type UniBagrutConfig,
  type SubjectInput,
  isFiveUnitsMath,
  isFourUnitsMath,
  getMandatorySubjects,
  math,
} from "./bagrut-config";

export interface BagrutRow {
  id: string;
  subject: string;
  units: number;
  grade: number;
  examType: string; // "בחינה" | "עבודה"
  bonus: number;
  included: boolean; // whether this row is included in average
  /** שורות עם בחירת מקצוע מתפריט (ערבי / ממלכתי-דתי) */
  subjectSlot?: "arab-culture" | "religious-literature" | "religious-toshba";
}

export interface BagrutResult {
  avg: number;
  totalUnitsInCalc: number;
  totalUnitsEntered: number;
  isValid: boolean;
  rows: BagrutRow[];
  cappedAt?: number;
}

// Calculate bonus for a single row, exactly as original
function calculateBonus(input: SubjectInput, config: UniBagrutConfig): number {
  for (const rule of config.bonusRules) {
    if (rule.condition(input, config)) {
      return rule.bonus;
    }
  }
  return 0;
}

// Check if subject is a mandatory subject for this university
function isMandatorySubject(subject: string, educationType: string, uniId: string): boolean {
  const config = bagrutUniversityConfigs[uniId];
  if (!config) return true; // default: include all
  const mandatory = getMandatorySubjects(educationType);
  return mandatory.includes(subject);
}

// Check if subject should be included in average as additional (non-mandatory) subject
function shouldIncludeInAvg(
  grade: number,
  bonus: number,
  currentAvg: number
): boolean {
  return (grade + bonus) > currentAvg;
}

// Main calculation function — exact port of updateAvg from bagrut-avg-calc.js
export function calculateBagrutAverage(
  rows: BagrutRow[],
  educationType: string,
  universityId: string
): BagrutResult {
  const config = bagrutUniversityConfigs[universityId];
  if (!config) {
    return { avg: 0, totalUnitsInCalc: 0, totalUnitsEntered: 0, isValid: false, rows };
  }

  // Step 1: Calculate bonus for each row
  const processedRows = rows.map(row => {
    if (!row.subject || row.grade <= 0 || row.units <= 0) {
      return { ...row, bonus: 0, included: false };
    }
    const input: SubjectInput = {
      subject: row.subject,
      units: row.units,
      grade: row.grade,
      examType: row.examType,
    };
    const bonus = calculateBonus(input, config);
    return { ...row, bonus };
  });

  // Step 2: Separate mandatory and non-mandatory subjects
  const mandatorySubjects = getMandatorySubjects(educationType);
  let sum = 0;
  let unitsNum = 0;
  let totalUnitsNum = 0;
  let deltaUnits = 0;

  interface NonMandatoryEntry {
    row: BagrutRow;
    gradeWithBonus: number;
  }

  const nonMandatorySubjects: NonMandatoryEntry[] = [];
  const resultRows: BagrutRow[] = [];

  for (const row of processedRows) {
    if (!row.subject || row.grade <= 0 || row.units <= 0) {
      resultRows.push({ ...row, included: false });
      continue;
    }

    totalUnitsNum += row.units;

    // TECH: 5 units math → doubled weight (10 units)
    if (isFiveUnitsMath(row.subject, row.units) && universityId === "TECH-BAGRUT") {
      sum += 10 * (row.grade + row.bonus);
      unitsNum += 10;
      deltaUnits += row.units;
      resultRows.push({ ...row, included: true });
    }
    // TECH: 4 units math → doubled weight (8 units)
    else if (isFourUnitsMath(row.subject, row.units) && universityId === "TECH-BAGRUT") {
      sum += 8 * (row.grade + row.bonus);
      unitsNum += 8;
      deltaUnits += row.units;
      resultRows.push({ ...row, included: true });
    }
    // Mandatory subject or default university
    else if (mandatorySubjects.includes(row.subject) || universityId === "") {
      sum += row.units * (row.grade + row.bonus);
      unitsNum += row.units;
      resultRows.push({ ...row, included: true });
    }
    // Non-mandatory — check later
    else {
      nonMandatorySubjects.push({
        row: { ...row },
        gradeWithBonus: row.grade + row.bonus,
      });
      resultRows.push({ ...row, included: false }); // placeholder
    }
  }

  // Step 3: Sort non-mandatory by impact (descending)
  let avg = unitsNum > 0 ? sum / unitsNum : 0;
  nonMandatorySubjects.sort((a, b) => {
    const impactA = (a.gradeWithBonus - avg) * a.row.units;
    const impactB = (b.gradeWithBonus - avg) * b.row.units;
    return impactB - impactA;
  });

  // Step 4: Include non-mandatory subjects that improve avg or if below min units
  for (const entry of nonMandatorySubjects) {
    const row = entry.row;
    if (
      isNaN(avg) ||
      shouldIncludeInAvg(row.grade, row.bonus, avg) ||
      unitsNum < config.minUnitsRequired
    ) {
      sum += row.units * (row.grade + row.bonus);
      unitsNum += row.units;
      avg = sum / unitsNum;
      // Update the corresponding row in resultRows
      const idx = resultRows.findIndex(r => r.id === row.id);
      if (idx >= 0) resultRows[idx] = { ...resultRows[idx], included: true };
    }
  }

  avg = unitsNum > 0 ? roundDigits(sum / unitsNum, 2) : 0;

  // Apply max cap per university
  let cappedAt: number | undefined;
  if (config.maxAvg && avg > config.maxAvg) {
    cappedAt = config.maxAvg;
    avg = config.maxAvg;
  }

  return {
    avg,
    totalUnitsInCalc: unitsNum,
    totalUnitsEntered: totalUnitsNum,
    isValid: unitsNum > 0,
    rows: resultRows,
    cappedAt,
  };
}
