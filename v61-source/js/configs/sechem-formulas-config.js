// ~~~~~~~~~~~~~~~~~~~~~~ \\
// SECHEM Formulas Config \\
// ~~~~~~~~~~~~~~~~~~~~~~ \\

import { getCurrentYear, roundDigits } from "../utils/general-methods.js";

///////////////////////////////////////////////////////////////////
////////////////////////////// TAU ////////////////////////////////
///////////////////////////////////////////////////////////////////

// Partial Degree Sechem
export const tauPDFormula = (pdAvg, psycho) => {
	return roundDigits(
		0.52 * ((810004 * pdAvg - 10004746) / 100000 + psycho),
		2
	);
};

// Full Degree Sechem
export const tauFDFormula = (fdAvg, psycho) => {
	return roundDigits(
		0.52 * ((810004 * fdAvg - 10004746) / 100000 + psycho),
		2
	);
};

// Final Sechem
export const tauFinalFormula = (firstSechem, mor) =>
	firstSechem * 0.300037023286799 +
	mor * 0.405979413383785 +
	434.194011398824;

///////////////////////////////////////////////////////////////////
////////////////////////////// HUJI ///////////////////////////////
///////////////////////////////////////////////////////////////////

// Bagrut Sechem
export const hujiBagrutFormula = (bagrut, psycho) => {
	let decBagrut = bagrut / 10;
	let normalizedBagrut = 3.963 * decBagrut - 20.0621;
	let normalizedPsycho = 0.032073 * psycho + 0.3672;
	let weightedCognitiveSechem =
		0.3 * normalizedBagrut + 0.7 * normalizedPsycho;
	let cognitiveSechem =
		Math.floor(
			(1.2235 * weightedCognitiveSechem - 4.4598 + 0.0005) * 1000
		) / 1000;
	return cognitiveSechem;
};

// New Preparatory Sechem
export const hujiNewPrepFormula = (prep, psycho) => {
	let decPrep = prep / 10;
	let normalizedPrep = 3.9261 * decPrep - 15.9285;
	let normalizedPsycho = 0.032073 * psycho + 0.3672;
	let weightedCognitiveSechem = 0.5 * normalizedPrep + 0.5 * normalizedPsycho;
	let cognitiveSechem =
		Math.floor(
			(1.2422 * weightedCognitiveSechem - 4.7609 + 0.0005) * 1000
		) / 1000;
	return cognitiveSechem;
};

// Old Preparatory Sechem
export const hujiOldPrepFormula = (prep, psycho) => {
	let decPrep = prep / 10;
	let normalizedPrep = 3.6201 * decPrep - 12.1296;
	let normalizedPsycho = 0.032073 * psycho + 0.3672;
	let weightedCognitiveSechem = 0.5 * normalizedPrep + 0.5 * normalizedPsycho;
	let cognitiveSechem =
		Math.floor(
			(1.2422 * weightedCognitiveSechem - 4.7609 + 0.0005) * 1000
		) / 1000;
	return cognitiveSechem;
};

// Partial Degree Sechem
export const hujiPDFormula = (pdAvg, psycho) => {
	let cognitiveSechem =
		Math.floor(
			(0.01992054 * psycho + 0.338350436 * pdAvg - 20.390012) * 1000
		) / 1000;
	return cognitiveSechem;
};

// Full Degree Sechem
export const hujiFDFormula = (fdAvg, psycho) => {
	let cognitiveSechem =
		Math.floor(
			(0.01992054 * psycho + 0.338350436 * fdAvg - 20.390012) * 1000
		) / 1000;
	return cognitiveSechem;
};

// Rothberg Preparatory Sechem
export const hujiHulPrepFormula = (prep, psycho) => {
	let cognitiveSechem =
		Math.floor(
			(0.01992054 * psycho + 0.241061332 * prep - 13.36083693) * 1000
		) / 1000;
	return cognitiveSechem;
};

// Direct Psycho Sechem
export const hujiHulPsychoFormula = (psycho) => {
	let cognitiveSechem =
		Math.floor((0.0392413155 * psycho - 4.0105308) * 1000) / 1000;
	return cognitiveSechem;
};

// Baccalauréat Général Sechem
export const hujiHulFrenchFormula = (bagrut, psycho) => {
	let cognitiveSechem =
		Math.floor(
			(0.027468921 * psycho + 0.81822786 * bagrut - 7.920677745) * 1000
		) / 1000;
	return cognitiveSechem;
};

// Final Sechem
export const hujiFinalFormula = (cognitive, morkam) => {
	// Mor/Mirkam Standardization (Tiknun) -->
	let normalizedMorkam = 0.0286 * morkam + 20.1149;

	// Personal Grade (Tziun Ishiuty): -->
	let finalSechem =
		Math.floor((0.6 * normalizedMorkam + 0.4 * cognitive + 0.0005) * 1000) /
		1000;

	return finalSechem;
};

///////////////////////////////////////////////////////////////////
////////////////////////////// TECH ///////////////////////////////
///////////////////////////////////////////////////////////////////

// Bagrut Sechem
export const techBagrutFormula = (bagrut, psycho) =>
	0.5 * bagrut + 0.075 * psycho - 19;

// Preparatory Sechem
export const techPrepFormula = (prep, psycho, bagrut) =>
	0.5 * roundDigits((bagrut + prep) / 2, 2) + 0.075 * psycho - 19;

// Sat2Psycho Converter
export const techSat2PsychoFormula = (satENG, satMATH) =>
	Math.floor(satENG * 0.33 + satMATH * 0.67);

// Act2Psycho Converter
const techACT2SAT = {
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
export const techAct2PsychoFormula = (actENG, actMATH) =>
	techSat2PsychoFormula(
		techACT2SAT[actENG].english,
		techACT2SAT[actMATH].math
	);

// Final Sechem
export const techFinalFormula = (mor) => mor;

//////////////////////////////////////////////////////////////////
//////////////////////////// HAIFA ///////////////////////////////
//////////////////////////////////////////////////////////////////

// Bagrut Sechem
export const haifaBagrutFormula = (bagrut, psycho, bagrutYear) => {
	// Gets current Year
	const currentYear = getCurrentYear();
	if (bagrutYear <= currentYear && bagrutYear >= currentYear - 6) {
		// Full Weight Bagrut
		return ((bagrut * 10 - 330) * 3 + psycho * 7) / 10;
	} else if (
		bagrutYear <= currentYear - 7 &&
		bagrutYear >= currentYear - 10
	) {
		// Half Weight Bagrut
		return ((bagrut * 10 - 330) * 3 + psycho * 17) / 20;
	} else if (bagrutYear < currentYear - 10) {
		// No Bagrut Weight
		return psycho;
	}
};

// Full Degree Sechem
export const haifaFDFormula = (fdAvg, psycho) =>
	((fdAvg * 1.1 * 10 - 330) * 1 + psycho * 1) / 2;

// Sat2Psycho Converter
export const haifaSat2PsychoFormula = (satENG, satMATH) =>
	roundDigits((satENG + satMATH) / 2, 0);

///////////////////////////////////////////////////////////////////
///////////////////////////// Ariel ///////////////////////////////
///////////////////////////////////////////////////////////////////

// Bagrut Sechem
export const arielBagrutFormula = (bagrut, psycho) =>
	Math.floor(((6.666 * bagrut + psycho) / 2) * 10) / 10;

//////////////////////////////////////////////////////////////////
//////////////////////////// ISHIUTI /////////////////////////////
//////////////////////////////////////////////////////////////////

// Morkam Final Score
export const morkamFormula = (bio, stations, comp) => {
	let preNormalizedGrade = roundDigits(
		0.3 * bio + 0.55 * stations + 0.15 * comp,
		2
	);

	if (preNormalizedGrade >= 150 && preNormalizedGrade < 177) {
		return roundDigits(preNormalizedGrade * 0.68 + 48, 0);
	} else if (preNormalizedGrade >= 177 && preNormalizedGrade < 224) {
		return roundDigits(preNormalizedGrade * 1.34 - 68.2, 0);
	} else if (preNormalizedGrade >= 224 && preNormalizedGrade <= 250) {
		return roundDigits(preNormalizedGrade * 0.72 + 70, 0);
	}
};
