// ~~~~~~~~~~~~~~~ \\
// TZAMERET SECHEM \\
// ~~~~~~~~~~~~~~~ \\

import getUniSechemThreshold from "../utils/handle-google-sheet.js";
import {
	checkBagrutSechemGrades,
	checkFinalSechemGrades,
	checkGradesValidity,
	checkPrepSechemGrades,
} from "../utils/handle-grades-validity.js";
import {
	finalAC,
	tzameretAC,
	tzameretFinal,
	tzameretFirst,
	tzameretPrep,
} from "../sechem-config.js";
import { calcRequiredStatsByMath } from "../utils/calc-required-stats.js";
import calculateSechemByFormula from "../utils/calc-sechem-by-formula.js";
import {
	buildFinalSechemStatsArr,
	buildFirstSechemStatsArr,
} from "../utils/build-sechem-stats-array.js";
import { getUniversityConfig } from "../utils/config-wrappers.js";
import { uniThresholdOption } from "../../configs/google-sheet-config.js";

// Sechem Thresholds
const tzameretFirstSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	tzameretFirst
);
const tzameretFinalSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	tzameretFinal
);

// Initiates calculation of TZAMERET BAGRUT SECHEM, checks if it's higher than current year's threshold
// Checks if the bagrut & psycho grades are valid according to TZAMERET minimum & maximums values
export const calcTzameretBagrutSechem = function (bagrut, psycho) {
	// Extracts TZAMERET BAGRUT SECHEM Config
	const selectedUniConfig = getUniversityConfig(tzameretAC, tzameretFirst);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const tzameretCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		bagrut,
		psycho,
		tzameretFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkBagrutSechemGrades, tzameretCheckGradesArr);
};

// Initiates calculation of TZAMERET PREP SECHEM, checks if it's higher than current year's threshold
// Checks if the preparatory & psycho grades are valid according to TZAMERET minimum & maximums values
export const calcTzameretPrepSechem = function (prep, psycho) {
	// Extracts TZAMERET PREP SECHEM Config
	const selectedUniConfig = getUniversityConfig(tzameretAC, tzameretPrep);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const tzameretCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		prep,
		psycho,
		tzameretFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkPrepSechemGrades, tzameretCheckGradesArr);
};

// Initiates calculation of TZAMERET FINAL SECHEM, checks if it's higher than current year's threshold
// Checks if the COGNITIVE SECHEM & MORKAM grades are valid according to TZAMERET scheme
export const calcTzameretFinalSechem = function (cognitive, morkam) {
	// Extracts TZAMERET FINAL SECHEM Config
	const selectedUniConfig = getUniversityConfig(finalAC, tzameretFinal);

	// Builds an array with the relevant data to be used for FINAL SECHEM calculation purposes
	const tzameretCheckGradesArr = buildFinalSechemStatsArr(
		selectedUniConfig,
		tzameretFinalSechemThreshold,
		cognitive,
		morkam,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkFinalSechemGrades, tzameretCheckGradesArr);
};
