// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exact port of sechem-formulas-config.js to TypeScript
// ALL formulas preserved exactly as-is
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const roundDigits = (num: number, digits: number): number => {
  if (digits === undefined) digits = 0;
  let negative = false;
  let n = num;
  if (n < 0) {
    negative = true;
    n = n * -1;
  }
  const multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = Math.round(n) / multiplicator;
  let result = parseFloat(n.toFixed(digits));
  if (negative) result = parseFloat((result * -1).toFixed(digits));
  return result;
};

export const getCurrentYear = (): number => new Date().getFullYear();

// ======================== TAU ========================

export const tauPDFormula = (pdAvg: number, psycho: number): number =>
  roundDigits(0.52 * ((810004 * pdAvg - 10004746) / 100000 + psycho), 2);

export const tauFDFormula = (fdAvg: number, psycho: number): number =>
  roundDigits(0.52 * ((810004 * fdAvg - 10004746) / 100000 + psycho), 2);

export const tauFinalFormula = (firstSechem: number, mor: number): number =>
  firstSechem * 0.300037023286799 + mor * 0.405979413383785 + 434.194011398824;

// TAU conversion functions
export const tauPrep2BagrutConvFunc = (prep: number): number => {
  if (prep <= 94.22) return (1185 / 962) * prep - 9429 / 962;
  return (880 / 481) * prep - 31805 / 481;
};
export const tauBagrut2PrepConvFunc = (bagrut: number): number => {
  if (bagrut <= 106.26) return (962 * bagrut + 9429) / 1185;
  return (481 * bagrut + 31805) / 880;
};

// ======================== HUJI ========================

export const hujiBagrutFormula = (bagrut: number, psycho: number): number => {
  const decBagrut = bagrut / 10;
  const normalizedBagrut = 3.963 * decBagrut - 20.0621;
  const normalizedPsycho = 0.032073 * psycho + 0.3672;
  const weightedCognitiveSechem = 0.3 * normalizedBagrut + 0.7 * normalizedPsycho;
  const cognitiveSechem =
    Math.floor((1.2235 * weightedCognitiveSechem - 4.4598 + 0.0005) * 1000) / 1000;
  return cognitiveSechem;
};

export const hujiNewPrepFormula = (prep: number, psycho: number): number => {
  const decPrep = prep / 10;
  const normalizedPrep = 3.9261 * decPrep - 15.9285;
  const normalizedPsycho = 0.032073 * psycho + 0.3672;
  const weightedCognitiveSechem = 0.5 * normalizedPrep + 0.5 * normalizedPsycho;
  const cognitiveSechem =
    Math.floor((1.2422 * weightedCognitiveSechem - 4.7609 + 0.0005) * 1000) / 1000;
  return cognitiveSechem;
};

export const hujiOldPrepFormula = (prep: number, psycho: number): number => {
  const decPrep = prep / 10;
  const normalizedPrep = 3.6201 * decPrep - 12.1296;
  const normalizedPsycho = 0.032073 * psycho + 0.3672;
  const weightedCognitiveSechem = 0.5 * normalizedPrep + 0.5 * normalizedPsycho;
  const cognitiveSechem =
    Math.floor((1.2422 * weightedCognitiveSechem - 4.7609 + 0.0005) * 1000) / 1000;
  return cognitiveSechem;
};

export const hujiPDFormula = (pdAvg: number, psycho: number): number => {
  const cognitiveSechem =
    Math.floor((0.01992054 * psycho + 0.338350436 * pdAvg - 20.390012) * 1000) / 1000;
  return cognitiveSechem;
};

export const hujiFDFormula = (fdAvg: number, psycho: number): number => {
  const cognitiveSechem =
    Math.floor((0.01992054 * psycho + 0.338350436 * fdAvg - 20.390012) * 1000) / 1000;
  return cognitiveSechem;
};

export const hujiHulPrepFormula = (prep: number, psycho: number): number => {
  const cognitiveSechem =
    Math.floor((0.01992054 * psycho + 0.241061332 * prep - 13.36083693) * 1000) / 1000;
  return cognitiveSechem;
};

export const hujiHulPsychoFormula = (psycho: number): number => {
  const cognitiveSechem =
    Math.floor((0.0392413155 * psycho - 4.0105308) * 1000) / 1000;
  return cognitiveSechem;
};

export const hujiHulFrenchFormula = (bagrut: number, psycho: number): number => {
  const cognitiveSechem =
    Math.floor((0.027468921 * psycho + 0.81822786 * bagrut - 7.920677745) * 1000) / 1000;
  return cognitiveSechem;
};

export const hujiFinalFormula = (cognitive: number, morkam: number): number => {
  const normalizedMorkam = 0.0286 * morkam + 20.1149;
  const finalSechem =
    Math.floor((0.6 * normalizedMorkam + 0.4 * cognitive + 0.0005) * 1000) / 1000;
  return finalSechem;
};

// ======================== TECH ========================

export const techBagrutFormula = (bagrut: number, psycho: number): number =>
  0.5 * bagrut + 0.075 * psycho - 19;

export const techPrepFormula = (prep: number, psycho: number, bagrut: number): number =>
  0.5 * roundDigits((bagrut + prep) / 2, 2) + 0.075 * psycho - 19;

export const techSat2PsychoFormula = (satENG: number, satMATH: number): number =>
  Math.floor(satENG * 0.33 + satMATH * 0.67);

const techACT2SAT: Record<number, { math: number | null; english: number }> = {
  11: { math: null, english: 305 },
  12: { math: 255, english: 325 },
  13: { math: 285, english: 350 },
  14: { math: 325, english: 375 },
  15: { math: 360, english: 395 },
  16: { math: 385, english: 415 },
  17: { math: 410, english: 435 },
  18: { math: 440, english: 450 },
  19: { math: 465, english: 465 },
  20: { math: 485, english: 485 },
  21: { math: 505, english: 505 },
  22: { math: 525, english: 520 },
  23: { math: 545, english: 535 },
  24: { math: 560, english: 555 },
  25: { math: 575, english: 575 },
  26: { math: 595, english: 595 },
  27: { math: 615, english: 615 },
  28: { math: 635, english: 635 },
  29: { math: 655, english: 660 },
  30: { math: 675, english: 685 },
  31: { math: 700, english: 705 },
  32: { math: 725, english: 725 },
  33: { math: 750, english: 745 },
  34: { math: 775, english: 770 },
  35: { math: 790, english: 790 },
  36: { math: 800, english: 800 },
};

export const techAct2PsychoFormula = (actENG: number, actMATH: number): number =>
  techSat2PsychoFormula(
    techACT2SAT[actENG]?.english ?? 0,
    techACT2SAT[actMATH]?.math ?? 0
  );

export const techFinalFormula = (mor: number): number => mor;

// ======================== HAIFA ========================

export const haifaBagrutFormula = (bagrut: number, psycho: number, bagrutYear: number): number => {
  const currentYear = getCurrentYear();
  if (bagrutYear <= currentYear && bagrutYear >= currentYear - 6) {
    return ((bagrut * 10 - 330) * 3 + psycho * 7) / 10;
  } else if (bagrutYear <= currentYear - 7 && bagrutYear >= currentYear - 10) {
    return ((bagrut * 10 - 330) * 3 + psycho * 17) / 20;
  } else if (bagrutYear < currentYear - 10) {
    return psycho;
  }
  return psycho;
};

export const haifaFDFormula = (fdAvg: number, psycho: number): number =>
  ((fdAvg * 1.1 * 10 - 330) * 1 + psycho * 1) / 2;

export const haifaSat2PsychoFormula = (satENG: number, satMATH: number): number =>
  roundDigits((satENG + satMATH) / 2, 0);

// ======================== ARIEL ========================

export const arielBagrutFormula = (bagrut: number, psycho: number): number =>
  Math.floor(((6.666 * bagrut + psycho) / 2) * 10) / 10;

// ======================== MORKAM ========================

export const morkamFormula = (bio: number, stations: number, comp: number): number | undefined => {
  const preNormalizedGrade = roundDigits(0.3 * bio + 0.55 * stations + 0.15 * comp, 2);
  if (preNormalizedGrade >= 150 && preNormalizedGrade < 177) {
    return roundDigits(preNormalizedGrade * 0.68 + 48, 0);
  } else if (preNormalizedGrade >= 177 && preNormalizedGrade < 224) {
    return roundDigits(preNormalizedGrade * 1.34 - 68.2, 0);
  } else if (preNormalizedGrade >= 224 && preNormalizedGrade <= 250) {
    return roundDigits(preNormalizedGrade * 0.72 + 70, 0);
  }
  return undefined;
};

// BGU conversion functions
export const bguPrep2BagrutConvFunc = (prep: number): number => prep * 1.3;
export const bguBagrut2PrepConvFunc = (bagrut: number): number => bagrut / 1.3;
