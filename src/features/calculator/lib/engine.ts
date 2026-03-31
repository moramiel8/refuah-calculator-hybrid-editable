// Calculator engine - exact port of original logic
// Uses IDENTICAL formulas, rounding, and validation from the original project

import {
  roundDigits,
  getCurrentYear,
  tauPDFormula,
  tauFDFormula,
  tauFinalFormula,
  tauPrep2BagrutConvFunc,
  hujiBagrutFormula,
  hujiNewPrepFormula,
  hujiOldPrepFormula,
  hujiPDFormula,
  hujiFDFormula,
  hujiFinalFormula,
  hujiHulPrepFormula,
  hujiHulPsychoFormula,
  hujiHulFrenchFormula,
  techBagrutFormula,
  techPrepFormula,
  techFinalFormula,
  techSat2PsychoFormula,
  techAct2PsychoFormula,
  haifaBagrutFormula,
  haifaFDFormula,
  haifaSat2PsychoFormula,
  arielBagrutFormula,
  morkamFormula,
  bguPrep2BagrutConvFunc,
} from "./formulas";
import { uniStats, type AdmissionChannel } from "./uni-stats";

export interface CalcInput {
  topValue: number;
  bottomValue: number;
  extValue?: number;
  subChannel?: string;
}

export interface CalcResult {
  sechem: number | string | undefined;
  label: string;
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  details?: string;
  isApiResult?: boolean;
  thresholdOnly?: boolean;
}

// Message for channels with no formula (threshold-only)
const THRESHOLD_ONLY_MSG = "אין חישוב סכם למסלול זה – קיימים תנאי סף בלבד";

function thresholdOnlyResult(label: string): CalcResult {
  return {
    sechem: undefined,
    label,
    isValid: true,
    errors: [],
    details: THRESHOLD_ONLY_MSG,
    thresholdOnly: true,
  };
}

// ===================== API CALLS (v6.1-compatible) =====================

const DEFAULT_HTTP_TIMEOUT_MS = 5000;
const HTTP_TIMEOUT_ERROR = "HttpTimeoutError";
const HTTP_UNEXPECTED_ERROR = "HttpUnexpectedError";

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeout = DEFAULT_HTTP_TIMEOUT_MS): Promise<string> {
  const controller = new AbortController();
  const id = window.setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (response.status !== 200) {
      throw new Error(HTTP_UNEXPECTED_ERROR);
    }
    return await response.text();
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error(HTTP_TIMEOUT_ERROR);
    }
    throw error;
  } finally {
    window.clearTimeout(id);
  }
}

async function calcTauByApi(bagrut: number, psycho: number): Promise<number> {
  const payload = {
    operationName: "getLastScore",
    variables: {
      scoresData: {
        prog: "calctziun",
        out: "json",
        reali10: 1,
        psicho: psycho,
        bagrut,
      },
    },
    query:
      "query getLastScore($scoresData: JSON!) {\n  getLastScore(scoresData: $scoresData) {\n    body\n    __typename\n  }\n}\n",
  };
  const text = await fetchWithTimeout("https://go.tau.ac.il/graphql", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const parsed = JSON.parse(text);
  const value = parsed?.data?.getLastScore?.body?.hatama_refua;
  return Number.parseFloat(String(value));
}

async function calcTauBagrutViaApi(bagrut: number, psycho: number): Promise<number | null> {
  try {
    const value = await calcTauByApi(bagrut, psycho);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

async function calcTauPrepViaApi(prep: number, psycho: number): Promise<number | null> {
  try {
    const convBagrut = tauPrep2BagrutConvFunc(prep);
    const value = await calcTauByApi(convBagrut, psycho);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

async function calcBguBagrutViaApi(bagrut: number, psycho: number): Promise<number | null> {
  try {
    const url = `https://bgucr4u.bgu.ac.il/ords/sc/calculators/GetSekem?p_bagrut_average=${roundDigits(
      bagrut,
      2
    )}&p_psychometry=${psycho}&`;
    const text = await fetchWithTimeout(url, {
      method: "GET",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    });
    const value = JSON.parse(text)?.p_final_sekem;
    const parsed = Number.parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function calcBguPrepOnlyViaApi(prep: number, psycho: number): Promise<number | null> {
  try {
    const url = `https://bgucr4u.bgu.ac.il/ords/sc/calculators/GetSekemPrep/?p_prep_average=${prep}&p_prep_psychometry=${psycho}&`;
    const text = await fetchWithTimeout(url, {
      method: "GET",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    });
    const value = JSON.parse(text)?.p_sekem_prep;
    const parsed = Number.parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function calcBguPrepBagrutViaApi(prep: number, psycho: number, _bagrut: number): Promise<number | null> {
  const convBagrut = bguPrep2BagrutConvFunc(prep);
  const bagrutSechem = await calcBguBagrutViaApi(convBagrut, psycho);
  const prepSechem = await calcBguPrepOnlyViaApi(prep, psycho);
  if (bagrutSechem == null || prepSechem == null) return null;
  return Math.floor((bagrutSechem + prepSechem) / 2);
}

// ===================== Synchronous Math-Based Calculations =====================

function calculateSechemByFormula(
  formula: (...args: number[]) => number,
  sechemArgs: number[],
  roundPar: number | null,
): string {
  if (!formula) return "undefined";
  const result = formula(...sechemArgs);
  if (roundPar !== null && roundPar !== undefined) {
    return roundDigits(result, roundPar).toString();
  }
  return result.toString();
}

// ===================== Main Calculator =====================

export async function calculateSechem(
  uniKey: string,
  channel: AdmissionChannel,
  input: CalcInput,
): Promise<CalcResult> {
  // MORKAM is standalone - no university needed
  if (channel === "MORKAM") {
    const { topValue, bottomValue, extValue } = input;
    const bio = topValue;
    const stations = extValue ?? 0;
    const comp = bottomValue;
    const errors: string[] = [];

    if (bio < 150 || bio > 250) errors.push("ציון ביוגרפי חייב להיות בין 150-250");
    if (stations < 150 || stations > 250) errors.push("ציון תחנות חייב להיות בין 150-250");
    if (comp < 150 || comp > 250) errors.push("ציון שאו״ל חייב להיות בין 150-250");
    if (!Number.isInteger(bio)) errors.push("ציון ביוגרפי חייב להיות מספר שלם");
    if (!Number.isInteger(stations)) errors.push("ציון תחנות חייב להיות מספר שלם");
    if (!Number.isInteger(comp)) errors.push("ציון שאו״ל חייב להיות מספר שלם");

    if (errors.length) return { sechem: undefined, label: 'מרק"ם', isValid: false, errors };

    const result = morkamFormula(bio, stations, comp);
    return {
      sechem: result,
      label: 'ציון מרק"ם',
      isValid: result !== undefined,
      errors: result === undefined ? ["הציון מחוץ לטווח הנורמליזציה"] : [],
    };
  }

  const stats = uniStats[uniKey];
  if (!stats) return { sechem: undefined, label: "", isValid: false, errors: ["אוניברסיטה לא נמצאה"] };

  const errors: string[] = [];
  const { topValue, bottomValue, extValue, subChannel } = input;

  switch (channel) {
    // ======================== BAGRUT ========================
    case "BAGRUT": {
      const ch = stats.BAGRUT;
      if (!ch) return { sechem: undefined, label: "סכם ראשוני", isValid: false, errors: ["אפיק לא נתמך"] };

      if (ch.avg && topValue < ch.avg.min) errors.push(`ממוצע בגרות נמוך מהמינימום הנדרש (${ch.avg.min})`);
      if (ch.avg?.max && topValue > ch.avg.max) errors.push(`ממוצע בגרות גבוה מהמקסימום (${ch.avg.max})`);
      // Psychometric threshold is a warning, not a hard block — still calculate
      const psychoWarnings: string[] = [];
      if (ch.psycho && bottomValue < ch.psycho.min)
        psychoWarnings.push(`ציון פסיכומטרי נמוך מהמינימום הנדרש לקבלה (${ch.psycho.min})`);
      if (bottomValue < 200 || bottomValue > 800) errors.push("ציון פסיכומטרי חייב להיות בין 200-800");
      if (!Number.isInteger(bottomValue)) errors.push("ציון פסיכומטרי חייב להיות מספר שלם");
      if (errors.length) return { sechem: undefined, label: "סכם ראשוני", isValid: false, errors };

      let sechem: number | string | null;
      switch (uniKey) {
        case "TAU": {
          sechem = await calcTauBagrutViaApi(topValue, bottomValue);
          if (sechem != null) {
            return { sechem, label: "סכם ראשוני", isValid: true, errors: [], warnings: psychoWarnings, isApiResult: true };
          }
          return { sechem: undefined, label: "סכם ראשוני", isValid: false, errors: ["שגיאה בחיבור לשרת תל אביב"] };
        }
        case "HUJI":
          sechem = calculateSechemByFormula(hujiBagrutFormula, [topValue, bottomValue], 3);
          return { sechem: parseFloat(sechem), label: "סכם ראשוני", isValid: true, errors: [], warnings: psychoWarnings };
        case "TECH":
          sechem = calculateSechemByFormula(techBagrutFormula, [topValue, bottomValue], 3);
          return { sechem: parseFloat(sechem), label: "סכם ראשוני", isValid: true, errors: [], warnings: psychoWarnings };
        case "BGU": {
          sechem = await calcBguBagrutViaApi(topValue, bottomValue);
          if (sechem != null) {
            return { sechem, label: "סכם ראשוני", isValid: true, errors: [], warnings: psychoWarnings, isApiResult: true };
          }
          return { sechem: undefined, label: "סכם ראשוני", isValid: false, errors: ["שגיאה בחיבור לשרת בן גוריון"] };
        }
        case "BIU":
          // No formula in original (calculateNoSechem)
          return thresholdOnlyResult("סכם ראשוני");
        case "HAIFA": {
          const bagrutYear = extValue ?? getCurrentYear();
          if (bagrutYear < 1928) {
            return {
              sechem: undefined,
              label: "סכם ראשוני",
              isValid: false,
              errors: ["יש להזין שנת זכאות לבגרות תקינה"],
            };
          }
          sechem = calculateSechemByFormula(haifaBagrutFormula, [topValue, bottomValue, bagrutYear], 0);
          return { sechem: parseFloat(sechem), label: "סכם ראשוני", isValid: true, errors: [], warnings: psychoWarnings };
        }
        case "ARIEL":
          sechem = calculateSechemByFormula(arielBagrutFormula, [topValue, bottomValue], 1);
          return { sechem: parseFloat(sechem), label: "סכם ראשוני", isValid: true, errors: [], warnings: psychoWarnings };
        case "TZAMERET":
          sechem = calculateSechemByFormula(hujiBagrutFormula, [topValue, bottomValue], 3);
          return { sechem: parseFloat(sechem), label: "סכם ראשוני", isValid: true, errors: [], warnings: psychoWarnings };
        default:
          return { sechem: undefined, label: "סכם ראשוני", isValid: false, errors: ["נוסחה לא נמצאה"] };
      }
    }

    // ======================== PREP ========================
    case "PREP": {
      const ch = stats.PREP;
      if (!ch) return { sechem: undefined, label: "סכם מכינה", isValid: false, errors: ["אפיק לא נתמך"] };

      if (ch.avg && topValue < ch.avg.min) errors.push(`ממוצע מכינה נמוך מהמינימום (${ch.avg.min})`);
      if (ch.avg?.max && topValue > ch.avg.max) errors.push(`ממוצע מכינה גבוה מהמקסימום (${ch.avg.max})`);
      // Psychometric threshold is a warning, not a hard block
      if (ch.psycho && bottomValue < ch.psycho.min) { /* warning only */ }
      if (bottomValue < 200 || bottomValue > 800) errors.push("ציון פסיכומטרי חייב להיות בין 200-800");
      if (!Number.isInteger(bottomValue)) errors.push("ציון פסיכומטרי חייב להיות מספר שלם");
      if (errors.length) return { sechem: undefined, label: "סכם מכינה", isValid: false, errors };

      let sechem: number | string | null;
      switch (uniKey) {
        case "TAU": {
          sechem = await calcTauPrepViaApi(topValue, bottomValue);
          if (sechem != null) {
            return { sechem, label: "סכם מכינה", isValid: true, errors: [], isApiResult: true };
          }
          return { sechem: undefined, label: "סכם מכינה", isValid: false, errors: ["שגיאה בחיבור לשרת תל אביב"] };
        }
        case "HUJI": {
          const sub = subChannel ?? "new";
          const formula = sub === "old" ? hujiOldPrepFormula : hujiNewPrepFormula;
          sechem = calculateSechemByFormula(formula, [topValue, bottomValue], 3);
          return { sechem: parseFloat(sechem), label: "סכם מכינה", isValid: true, errors: [] };
        }
        case "TECH": {
          const bagrutAvg = extValue ?? 0;
          sechem = calculateSechemByFormula(techPrepFormula, [topValue, bottomValue, bagrutAvg], 3);
          return { sechem: parseFloat(sechem), label: "סכם מכינה", isValid: true, errors: [] };
        }
        case "BGU": {
          const sub = subChannel ?? "only";
          if (sub === "bagrut") {
            const bagrutAvg = extValue ?? 0;
            sechem = await calcBguPrepBagrutViaApi(topValue, bottomValue, bagrutAvg);
          } else {
            // Prep only - no bagrut field needed
            sechem = await calcBguPrepOnlyViaApi(topValue, bottomValue);
          }
          if (sechem != null) {
            return { sechem, label: "סכם מכינה", isValid: true, errors: [], isApiResult: true };
          }
          return { sechem: undefined, label: "סכם מכינה", isValid: false, errors: ["שגיאה בחיבור לשרת בן גוריון"] };
        }
        case "BIU":
          // No formula in original (calculateNoSechem)
          return thresholdOnlyResult("סכם מכינה");
        case "HAIFA":
          // No formula in original
          return thresholdOnlyResult("סכם מכינה");
        case "TZAMERET":
          sechem = calculateSechemByFormula(hujiNewPrepFormula, [topValue, bottomValue], 3);
          return { sechem: parseFloat(sechem), label: "סכם מכינה", isValid: true, errors: [] };
        default:
          return { sechem: undefined, label: "סכם מכינה", isValid: false, errors: ["נוסחה לא נמצאה"] };
      }
    }

    // ======================== PD ========================
    case "PD": {
      const ch = stats.PD;
      if (!ch) return { sechem: undefined, label: "סכם תואר חלקי", isValid: false, errors: ["אפיק לא נתמך"] };

      if (ch.avg && topValue < ch.avg.min) errors.push(`ממוצע אקדמי נמוך מהמינימום (${ch.avg.min})`);
      if (topValue > 100) errors.push("ממוצע אקדמי מקסימלי: 100");
      // Psychometric threshold is a warning, not a hard block
      if (ch.psycho && bottomValue < ch.psycho.min) { /* warning only */ }
      if (bottomValue < 200 || bottomValue > 800) errors.push("ציון פסיכומטרי חייב להיות בין 200-800");
      if (!Number.isInteger(bottomValue)) errors.push("ציון פסיכומטרי חייב להיות מספר שלם");
      if (errors.length) return { sechem: undefined, label: "סכם תואר חלקי", isValid: false, errors };

      let sechem: string;
      switch (uniKey) {
        case "TAU":
          sechem = calculateSechemByFormula(tauPDFormula, [topValue, bottomValue], 2);
          return { sechem: parseFloat(sechem), label: "סכם תואר חלקי", isValid: true, errors: [] };
        case "HUJI":
          sechem = calculateSechemByFormula(hujiPDFormula, [topValue, bottomValue], 3);
          return { sechem: parseFloat(sechem), label: "סכם תואר חלקי", isValid: true, errors: [] };
        case "BGU":
          // No formula in original (calculateNoSechem)
          return thresholdOnlyResult("סכם תואר חלקי");
        default:
          return { sechem: undefined, label: "סכם תואר חלקי", isValid: false, errors: ["נוסחה לא נמצאה"] };
      }
    }

    // ======================== FD ========================
    case "FD": {
      const ch = stats.FD;
      if (!ch) return { sechem: undefined, label: "סכם תואר מלא", isValid: false, errors: ["אפיק לא נתמך"] };

      if (ch.avg && topValue < ch.avg.min) errors.push(`ממוצע אקדמי נמוך מהמינימום (${ch.avg.min})`);
      if (topValue > 100) errors.push("ממוצע אקדמי מקסימלי: 100");
      // Psychometric threshold is a warning, not a hard block
      if (ch.psycho && bottomValue < ch.psycho.min) { /* warning only */ }
      if (bottomValue < 200 || bottomValue > 800) errors.push("ציון פסיכומטרי חייב להיות בין 200-800");
      if (!Number.isInteger(bottomValue)) errors.push("ציון פסיכומטרי חייב להיות מספר שלם");
      if (errors.length) return { sechem: undefined, label: "סכם תואר מלא", isValid: false, errors };

      let sechem: string;
      switch (uniKey) {
        case "TAU":
          sechem = calculateSechemByFormula(tauFDFormula, [topValue, bottomValue], 2);
          return { sechem: parseFloat(sechem), label: "סכם תואר מלא", isValid: true, errors: [] };
        case "HUJI":
          sechem = calculateSechemByFormula(hujiFDFormula, [topValue, bottomValue], 3);
          return { sechem: parseFloat(sechem), label: "סכם תואר מלא", isValid: true, errors: [] };
        case "HAIFA":
          sechem = calculateSechemByFormula(haifaFDFormula, [topValue, bottomValue], 0);
          return { sechem: parseFloat(sechem), label: "סכם תואר מלא", isValid: true, errors: [] };
        case "BGU":
          // No formula in original (calculateNoSechem)
          return thresholdOnlyResult("סכם תואר מלא");
        default:
          return { sechem: undefined, label: "סכם תואר מלא", isValid: false, errors: ["נוסחה לא נמצאה"] };
      }
    }

    // ======================== FINAL ========================
    case "FINAL": {
      const ch = stats.FINAL;
      if (!ch) return { sechem: undefined, label: "סכם סופי", isValid: false, errors: ["אפיק לא נתמך"] };

      // Validate cognitive
      if (ch.cognitive) {
        if (topValue < ch.cognitive.min) errors.push(`סכם קוגניטיבי נמוך מהמינימום (${ch.cognitive.min})`);
        if (topValue > ch.cognitive.max) errors.push(`סכם קוגניטיבי גבוה מהמקסימום (${ch.cognitive.max})`);
      }
      // Validate ishiuti
      if (ch.ishiuti) {
        if (bottomValue < ch.ishiuti.min) errors.push(`ציון אישיותי נמוך מהמינימום (${ch.ishiuti.min})`);
        if (bottomValue > ch.ishiuti.max) errors.push(`ציון אישיותי גבוה מהמקסימום (${ch.ishiuti.max})`);
        if (!Number.isInteger(bottomValue)) errors.push("ציון אישיותי חייב להיות מספר שלם");
        if (ch.ishiuti.threshold && bottomValue < ch.ishiuti.threshold) {
          errors.push(`ציון אישיותי נמוך מהסף המינימלי (${ch.ishiuti.threshold})`);
        }
      }
      if (errors.length) return { sechem: undefined, label: "סכם סופי", isValid: false, errors };

      let sechem: string;
      switch (uniKey) {
        case "TAU":
          sechem = calculateSechemByFormula(tauFinalFormula, [topValue, bottomValue], 2);
          return { sechem: parseFloat(sechem), label: "סכם סופי", isValid: true, errors: [] };
        case "HUJI":
          sechem = calculateSechemByFormula(hujiFinalFormula, [topValue, bottomValue], 3);
          return { sechem: parseFloat(sechem), label: "סכם סופי", isValid: true, errors: [] };
        case "TECH":
          // No formula in original (commented out)
          return thresholdOnlyResult("סכם סופי");
        case "ARIEL":
          // No formula in original
          return thresholdOnlyResult("סכם סופי");
        case "TZAMERET":
          sechem = calculateSechemByFormula(hujiFinalFormula, [topValue, bottomValue], 3);
          return { sechem: parseFloat(sechem), label: "סכם סופי", isValid: true, errors: [] };
        case "BIU":
          // BIU FINAL: only the sechem value (ishiuti IS the sechem)
          return {
            sechem: bottomValue,
            label: "סכם סופי",
            isValid: true,
            errors: [],
          };
        default:
          return { sechem: undefined, label: "סכם סופי", isValid: false, errors: ["נוסחה לא נמצאה"] };
      }
    }

    // ======================== ALT (HUL/SAT/ACT) ========================
    case "ALT": {
      if (subChannel === "HUJI-HUL-PREP") {
        const sechem = calculateSechemByFormula(hujiHulPrepFormula, [topValue, bottomValue], 3);
        return { sechem: parseFloat(sechem), label: "סכם קוגניטיבי", isValid: true, errors: [] };
      }
      if (subChannel === "HUJI-HUL-PSYCHO") {
        const sechem = calculateSechemByFormula(hujiHulPsychoFormula, [bottomValue], 3);
        return { sechem: parseFloat(sechem), label: "סכם קוגניטיבי", isValid: true, errors: [] };
      }
      if (subChannel === "HUJI-HUL-FRENCH") {
        const sechem = calculateSechemByFormula(hujiHulFrenchFormula, [topValue, bottomValue], 3);
        return { sechem: parseFloat(sechem), label: "סכם קוגניטיבי", isValid: true, errors: [] };
      }
      return { sechem: undefined, label: "חלופי", isValid: false, errors: ["יש לבחור אפיק חלופי"] };
    }

    // ======================== SAT ========================
    case "SAT": {
      const satENG = topValue;
      const satMATH = bottomValue;
      if (satENG < 200 || satENG > 800) errors.push("ציון SAT אנגלית חייב להיות בין 200-800");
      if (satMATH < 200 || satMATH > 800) errors.push("ציון SAT מתמטיקה חייב להיות בין 200-800");
      if (errors.length) return { sechem: undefined, label: "ציון פסיכומטרי משוקלל", isValid: false, errors };

      let result: number;
      if (uniKey === "TECH") {
        result = techSat2PsychoFormula(satENG, satMATH);
      } else if (uniKey === "HAIFA") {
        result = haifaSat2PsychoFormula(satENG, satMATH);
      } else {
        return { sechem: undefined, label: "ציון פסיכומטרי משוקלל", isValid: false, errors: ["אוניברסיטה לא תומכת ב-SAT"] };
      }
      return { sechem: result, label: "ציון פסיכומטרי משוקלל", isValid: true, errors: [] };
    }

    // ======================== ACT ========================
    case "ACT" as AdmissionChannel: {
      const actENG = topValue;
      const actMATH = bottomValue;
      if (actENG < 11 || actENG > 36) errors.push("ציון ACT אנגלית חייב להיות בין 11-36");
      if (actMATH < 12 || actMATH > 36) errors.push("ציון ACT מתמטיקה חייב להיות בין 12-36");
      if (!Number.isInteger(actENG)) errors.push("ציון ACT אנגלית חייב להיות מספר שלם");
      if (!Number.isInteger(actMATH)) errors.push("ציון ACT מתמטיקה חייב להיות מספר שלם");
      if (errors.length) return { sechem: undefined, label: "ציון פסיכומטרי משוקלל", isValid: false, errors };

      const result = techAct2PsychoFormula(actENG, actMATH);
      return { sechem: result, label: "ציון פסיכומטרי משוקלל (ACT)", isValid: true, errors: [] };
    }

    default:
      return { sechem: undefined, label: "", isValid: false, errors: ["אפיק קבלה לא נתמך"] };
  }
}

// ===================== Info Content per University =====================

export function getUniInfo(uniKey: string): { title: string; text: string; ref?: string } | null {
  const stats = uniStats[uniKey];
  if (!stats) return null;
  const info: Record<string, { title: string; text: string; ref?: string }> = {
    TAU: {
      title: "תל אביב – תנאי סף",
      text: `אנגלית: ${stats.eng.min} | עברית: ${stats.heb.min} | מתמטיקה: ${stats.math.min}`,
      ref: "https://go.tau.ac.il/he/ba/how-to-calculate",
    },
    HUJI: {
      title: "העברית – תנאי סף",
      text: `אנגלית: ${stats.eng.min} | עברית: ${stats.heb.min} | מתמטיקה: ${stats.math.min}`,
      ref: "https://info.huji.ac.il/reception-components",
    },
    TECH: {
      title: "טכניון – תנאי סף",
      text: `אנגלית: ${stats.eng.min} | עברית: ${stats.heb.min} | מתמטיקה: ${stats.math.min}`,
      ref: "https://admissions.technion.ac.il/",
    },
    BGU: {
      title: "בן גוריון – תנאי סף",
      text: `אנגלית: ${stats.eng.min} | עברית: ${stats.heb.min} | מתמטיקה: ${stats.math.min}`,
      ref: "https://www.bgu.ac.il/",
    },
    BIU: {
      title: "בר אילן – תנאי סף",
      text: `אנגלית: ${stats.eng.min} | עברית: ${stats.heb.min} | מתמטיקה: ${stats.math.min}`,
      ref: "https://www.biu.ac.il/",
    },
    HAIFA: {
      title: "חיפה – תנאי סף",
      text: `אנגלית: ${stats.eng.min} | עברית: ${stats.heb.min} | מתמטיקה: ${stats.math.min}`,
      ref: "https://www.haifa.ac.il/",
    },
    ARIEL: {
      title: "אריאל – תנאי סף",
      text: `אנגלית: ${stats.eng.min} | עברית: ${stats.heb.min} | מתמטיקה: ${stats.math.min}`,
    },
    TZAMERET: {
      title: "צמרת – תנאי סף",
      text: `אנגלית: ${stats.eng.min} | עברית: ${stats.heb.min} | מתמטיקה: ${stats.math.min}`,
    },
  };
  return info[uniKey] ?? null;
}

// Get input labels for a given channel
export function getInputLabels(
  uniKey: string,
  channel: AdmissionChannel,
): {
  topLabel: string;
  bottomLabel: string;
  extLabel?: string;
  topMin?: number;
  topMax?: number;
  bottomMin?: number;
  bottomMax?: number;
  extMin?: number;
  extMax?: number;
  topAllowDecimal?: boolean;
  bottomAllowDecimal?: boolean;
  extAllowDecimal?: boolean;
} {
  const stats = uniStats[uniKey];
  const ch = stats?.[channel as keyof typeof stats] as Record<string, any> | undefined;

  switch (channel) {
    case "BAGRUT": {
      const result: ReturnType<typeof getInputLabels> = {
        topLabel: `ממוצע בגרות (${ch?.avg?.min ?? 0} - ${ch?.avg?.max ?? 127}):`,
        bottomLabel: `פסיכומטרי (${ch?.psycho?.min ?? 200} - 800):`,
        topMin: 0,
        topMax: ch?.avg?.max ?? 127,
        bottomMin: 0,
        bottomMax: 800,
        topAllowDecimal: true,
        bottomAllowDecimal: false,
      };
      if (uniKey === "HAIFA") {
        result.extLabel = "שנת תעודת הבגרות:";
        result.extMin = 0;
        result.extMax = getCurrentYear();
        result.extAllowDecimal = false;
      }
      return result;
    }
    case "PREP": {
      const result: ReturnType<typeof getInputLabels> = {
        topLabel: `ממוצע מכינה (${ch?.avg?.min ?? 0} - ${ch?.avg?.max ?? 100}):`,
        bottomLabel: `פסיכומטרי (${ch?.psycho?.min ?? 200} - 800):`,
        topMin: 0,
        topMax: ch?.avg?.max ?? 100,
        bottomMin: 0,
        bottomMax: 800,
        topAllowDecimal: true,
        bottomAllowDecimal: false,
      };
      if (uniKey === "TECH") {
        result.extLabel = `ממוצע בגרות (0 - ${uniStats.TECH.BAGRUT?.avg?.max ?? 119}):`;
        result.extMin = 0;
        result.extMax = uniStats.TECH.BAGRUT?.avg?.max ?? 119;
        result.extAllowDecimal = true;
      }
      // BGU prep+bagrut gets ext field only when sub=bagrut
      return result;
    }
    case "PD":
      return {
        topLabel: `ממוצע אקדמי חלקי (${ch?.avg?.min ?? 0} - 100):`,
        bottomLabel: `פסיכומטרי (${ch?.psycho?.min ?? 200} - 800):`,
        topMin: 0,
        topMax: 100,
        bottomMin: 0,
        bottomMax: 800,
        topAllowDecimal: true,
        bottomAllowDecimal: false,
      };
    case "FD":
      return {
        topLabel: `ממוצע אקדמי מלא (${ch?.avg?.min ?? 0} - 100):`,
        bottomLabel: `פסיכומטרי (${ch?.psycho?.min ?? 200} - 800):`,
        topMin: 0,
        topMax: 100,
        bottomMin: 0,
        bottomMax: 800,
        topAllowDecimal: true,
        bottomAllowDecimal: false,
      };
    case "FINAL": {
      const cogLabel = ch?.cognitive ? `סכם קוגניטיבי (${ch.cognitive.min} - ${ch.cognitive.max}):` : "סכם ראשוני:";
      const ishLabel = ch?.ishiuti ? `ציון אישיותי (${ch.ishiuti.min} - ${ch.ishiuti.max}):` : 'מו"ר / מרק"ם:';
      return {
        topLabel: cogLabel,
        bottomLabel: ishLabel,
        topMin: 0,
        topMax: ch?.cognitive?.max ?? 800,
        bottomMin: 0,
        bottomMax: ch?.ishiuti?.max ?? 250,
        topAllowDecimal: true,
        bottomAllowDecimal: false,
      };
    }
    case "MORKAM":
      return {
        topLabel: "ציון ביוגרפי (150 - 250):",
        bottomLabel: "ציון שאו״ל (150 - 250):",
        extLabel: "ציון תחנות (150 - 250):",
        topMin: 0,
        topMax: 250,
        bottomMin: 0,
        bottomMax: 250,
        extMin: 0,
        extMax: 250,
        topAllowDecimal: false,
        bottomAllowDecimal: false,
        extAllowDecimal: false,
      };
    case "SAT":
      return {
        topLabel: "SAT אנגלית (200 - 800):",
        bottomLabel: "SAT מתמטיקה (200 - 800):",
        topMin: 200,
        topMax: 800,
        bottomMin: 200,
        bottomMax: 800,
        topAllowDecimal: false,
        bottomAllowDecimal: false,
      };
    default:
      return { topLabel: "", bottomLabel: "" };
  }
}
