// ~~~~~~~~~~~ \\
// TECH SECHEM \\
// ~~~~~~~~~~~ \\

import getUniSechemThreshold from "../utils/handle-google-sheet.js";
import {
	checkActGrades,
	checkBagrutSechemGrades,
	checkFinalSechemGrades,
	checkGradesValidity,
	checkPrepSechemGrades,
	checkSatGrades,
} from "../utils/handle-grades-validity.js";
import {
	altAC,
	bagrutAC,
	finalAC,
	prepAC,
	techAct,
	techAlt,
	techFinal,
	techFirst,
	techPrep,
	techSat,
} from "../sechem-config.js";
import { calcRequiredStatsByMath } from "../utils/calc-required-stats.js";
import calculateSechemByFormula from "../utils/calc-sechem-by-formula.js";
import { getSelectedOption } from "../../utils/general-methods.js";
import {
	displayChooseAcLog,
	displayChooseConvCalcLog,
	displayNoFormulaLog,
} from "../utils/update-sechem-results.js";
import {
	buildAlternativeStatsArr,
	buildFinalSechemStatsArr,
	buildFirstSechemStatsArr,
} from "../utils/build-sechem-stats-array.js";
import {
	getSubchannelConfig,
	getUniversityConfig,
} from "../utils/config-wrappers.js";
import { uniThresholdOption } from "../../configs/google-sheet-config.js";
import { sechemExtraInfoID } from "../../configs/html-config.js";

// Sechem Thresholds
const techFirstSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	techFirst
);
const techFinalSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	techFinal
);

// Initiates calculation of TECH BAGRUT SECHEM, checks if it's higher than current year's threshold
// Checks if the bagrut & psycho grades are valid according to TECH minimum & maximums values
export const calcTechBagrutSechem = function (bagrut, psycho) {
	// Extracts TECH BAGRUT SECHEM Config
	const selectedUniConfig = getUniversityConfig(bagrutAC, techFirst);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const techCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		bagrut,
		psycho,
		techFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkBagrutSechemGrades, techCheckGradesArr);
};

// Initiates calculation of TECH PREP SECHEM, checks if it's higher than current year's threshold
// Checks if the bagrut & psycho grades are valid according to TECH minimum & maximums values
export const calcTechPrepSechem = function (bagrut, prep, psycho) {
	// Extracts TECH BAGRUT SECHEM Config
	const selectedUniConfig = getUniversityConfig(prepAC, techPrep);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const techCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		prep,
		psycho,
		techFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula,
		bagrut
	);

	// Checks validity and displays results
	checkGradesValidity(checkPrepSechemGrades, techCheckGradesArr);
};

// Calculates TECH ALTERNATIVE grades (SAT/ACT etc...)
export const calcTechAlternatives = function (args) {
	// Extracts TECH ALT SCORES Config
	const selectedAlternative = getSelectedOption(sechemExtraInfoID);
	const subchannelConfig = getSubchannelConfig(
		altAC,
		techAlt,
		selectedAlternative
	);

	// Checks if the defaultUni option is selected (no alt subchannel is chosen)
	if (!subchannelConfig) {
		displayChooseConvCalcLog();
		return;
	}

	// Builds an array with the relevant data to be used for ALT SCORE calculation purposes
	const [input1, input2] = args;
	const techAltCheckGradesArr = buildAlternativeStatsArr(
		subchannelConfig,
		input1,
		input2
	);

	// Checks validity and displays results
	switch (selectedAlternative) {
		case techSat:
			checkGradesValidity(checkSatGrades, techAltCheckGradesArr);
			break;
		case techAct:
			checkGradesValidity(checkActGrades, techAltCheckGradesArr);
			break;
		default:
			displayChooseConvCalcLog();
			break;
	}
};

// Initiates calculation of TECH FINAL SECHEM, checks if it's higher than current year's threshold
// Checks if the MOR grade is valid according to TECH scheme
export const calcTechFinalSechem = function (NAN, mor) {
	// Extracts TECH FINAL SECHEM Config
	const selectedSubchannel = getSelectedOption(sechemExtraInfoID);
	const subchannelConfig = getSubchannelConfig(
		finalAC,
		techFinal,
		selectedSubchannel
	);

	// Checks if the defaultUni option is selected (no alt subchannel is chosen)
	if (!subchannelConfig) {
		displayChooseAcLog();
		return;
	}

	// Checks if techDegFinal option is selected (there isn't any known formula for that subchannel yet)
	const isTechDegFinal = !subchannelConfig.calculation;
	if (isTechDegFinal) {
		displayNoFormulaLog();
		return;
	}

	// Builds an array with the relevant data to be used for FINAL SECHEM calculation purposes
	const techCheckGradesArr = buildFinalSechemStatsArr(
		subchannelConfig,
		techFinalSechemThreshold,
		null,
		mor,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkFinalSechemGrades, techCheckGradesArr);
};
