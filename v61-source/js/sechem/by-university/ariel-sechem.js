// ~~~~~~~~~~~ \\
// HUJI SECHEM \\
// ~~~~~~~~~~~ \\

import {
	checkBagrutSechemGrades,
	checkGradesValidity,
} from "../utils/handle-grades-validity.js";
import { arielFinal, arielFirst, bagrutAC } from "../sechem-config.js";
import { calcRequiredStatsByMath } from "../utils/calc-required-stats.js";
import calculateSechemByFormula from "../utils/calc-sechem-by-formula.js";
import { buildFirstSechemStatsArr } from "../utils/build-sechem-stats-array.js";
import { getUniversityConfig } from "../utils/config-wrappers.js";
import { uniThresholdOption } from "../../configs/google-sheet-config.js";
import getUniSechemThreshold from "../utils/handle-google-sheet.js";

// Sechem Thresholds
const arielFirstSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	arielFirst
);
const arielFinalSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	arielFinal
);

// Initiates calculation of ARIEL BAGRUT SECHEM, checks if it's higher than current year's threshold
// Checks if the bagrut & psycho grades are valid according to ARIEL minimum & maximums values
export const calcArielBagrutSechem = function (bagrut, psycho) {
	// Extracts ARIEL BAGRUT SECHEM Config
	const selectedUniConfig = getUniversityConfig(bagrutAC, arielFirst);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const arielCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		bagrut,
		psycho,
		arielFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkBagrutSechemGrades, arielCheckGradesArr);
};
