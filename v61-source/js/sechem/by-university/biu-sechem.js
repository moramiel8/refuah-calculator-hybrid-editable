// ~~~~~~~~~~ \\
// BIU SECHEM \\
// ~~~~~~~~~~ \\

import getUniSechemThreshold from "../utils/handle-google-sheet.js";
import {
	checkBagrutSechemGrades,
	checkGradesValidity,
	checkPrepSechemGrades,
} from "../utils/handle-grades-validity.js";
import {
	bagrutAC,
	biuFinal,
	biuFirst,
	biuFirstSechemThreshold,
	biuPrep,
	prepAC,
} from "../sechem-config.js";
import { calculateNoSechem } from "../utils/calc-sechem-by-formula.js";
import { buildFirstSechemStatsArr } from "../utils/build-sechem-stats-array.js";
import { getUniversityConfig } from "../utils/config-wrappers.js";
import { uniThresholdOption } from "../../configs/google-sheet-config.js";

// Sechem Threshold
const biuFinalSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	biuFinal
);

// Checks if the bagrut & psycho grades are valid according to BIU minimum & maximums values
export const calcBiuBagrutSechem = function (bagrut, psycho) {
	// Extracts BIU BAGRUT SECHEM Config
	const selectedUniConfig = getUniversityConfig(bagrutAC, biuFirst);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const biuCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		bagrut,
		psycho,
		biuFirstSechemThreshold,
		null,
		calculateNoSechem
	);

	// Checks validity and displays results
	checkGradesValidity(checkBagrutSechemGrades, biuCheckGradesArr);
};

// Checks if the preparatory & psycho grades are valid according to BIU minimum & maximums values
export const calcBiuPrepSechem = function (prep, psycho) {
	// Extracts BIU PREP SECHEM Config
	const selectedUniConfig = getUniversityConfig(prepAC, biuPrep);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const biuCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		prep,
		psycho,
		biuFirstSechemThreshold,
		null,
		calculateNoSechem
	);

	// Checks validity and displays results
	checkGradesValidity(checkPrepSechemGrades, biuCheckGradesArr);
};
