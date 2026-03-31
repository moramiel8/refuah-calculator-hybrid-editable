// ~~~~~~~~~~~~~ \\
// ISHIUTI CALCS \\
// ~~~~~~~~~~~~~ \\

import {
	checkGradesValidity,
	checkIshiutiGrades,
} from "../utils/handle-grades-validity.js";
import { ishiutiAC, morkamCalc } from "../sechem-config.js";
import { getUniversityConfig } from "../utils/config-wrappers.js";
import { buildIshiutiStatsArr } from "../utils/build-sechem-stats-array.js";

// Initiates calculation of MOR/MORKAM grade.
// Checks if the partial grades are valid.
export const calcMorkamGrade = function (bio, stations, comp) {
	// Extracts MORKAM SCORE Config
	const selectedIshiutiConfig = getUniversityConfig(ishiutiAC, morkamCalc);

	// Builds an array with the relevant data to be used for MORKAM SCORE calculation purposes
	const morkamCheckGradesArr = buildIshiutiStatsArr(
		selectedIshiutiConfig,
		bio,
		stations,
		comp
	);

	// Checks validity and displays results
	checkGradesValidity(checkIshiutiGrades, morkamCheckGradesArr);
};
