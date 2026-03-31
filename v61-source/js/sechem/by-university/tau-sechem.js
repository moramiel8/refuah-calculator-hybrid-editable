// ~~~~~~~~~~ \\
// TAU SECHEM \\
// ~~~~~~~~~~ \\

import getUniSechemThreshold from "../utils/handle-google-sheet.js";
import {
	checkBagrutSechemGrades,
	checkDegreeSechemGrades,
	checkFinalSechemGrades,
	checkGradesValidity,
	checkPrepSechemGrades,
} from "../utils/handle-grades-validity.js";
import sendPostRequest from "../utils/send-post-request.js";
import {
	bagrutAC,
	fdAC,
	finalAC,
	pdAC,
	prepAC,
	tauFD,
	tauFinal,
	tauFirst,
	tauPD,
	tauPrep,
} from "../sechem-config.js";
import {
	calcRequiredStatsByApi,
	calcRequiredStatsByMath,
} from "../utils/calc-required-stats.js";
import {
	buildFinalSechemStatsArr,
	buildFirstSechemStatsArr,
} from "../utils/build-sechem-stats-array.js";
import calculateSechemByFormula from "../utils/calc-sechem-by-formula.js";
import { getUniversityConfig } from "../utils/config-wrappers.js";
import { uniThresholdOption } from "../../configs/google-sheet-config.js";

// Sechem Thresholds
const tauFirstSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	tauFirst
);
const tauFinalSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	tauFinal
);

// Initiates calculation of TAU BAGRUT SECHEM, checks if it's higher than current year's threshold
// Checks if the bagrut & psycho grades are valid according to TAU minimum & maximums values
export const calcTauBagrutSechem = function (bagrut, psycho) {
	// Extracts TAU BAGRUT SECHEM Config
	const selectedUniConfig = getUniversityConfig(bagrutAC, tauFirst);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const tauCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		bagrut,
		psycho,
		tauFirstSechemThreshold,
		calcRequiredStatsByApi,
		sendPostRequest
	);

	// Checks validity and displays results
	checkGradesValidity(checkBagrutSechemGrades, tauCheckGradesArr);
};

// Initiates calculation of TAU PREP SECHEM, checks if it's higher than current year's threshold
// Checks if the prep & psycho grades are valid according to TAU minimum & maximums values
export const calcTauPrepSechem = function (prep, psycho) {
	// Extracts TAU PREP SECHEM Config
	const selectedUniConfig = getUniversityConfig(prepAC, tauPrep);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const tauCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		prep,
		psycho,
		tauFirstSechemThreshold,
		calcRequiredStatsByApi,
		sendPostRequest
	);

	// Checks validity and displays results
	checkGradesValidity(checkPrepSechemGrades, tauCheckGradesArr);
};

// Initiates calculation of TAU PARTIAL DEGREE SECHEM, checks if it's higher than current year's threshold
// Checks if the full degree & psycho grades are valid according to TAU minimum & maximums values
export const calcTauPDSechem = function (pdAvg, psycho) {
	// Extracts TAU PD SECHEM Config
	const selectedUniConfig = getUniversityConfig(pdAC, tauPD);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const tauCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		pdAvg,
		psycho,
		tauFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkDegreeSechemGrades, tauCheckGradesArr);
};

// Initiates calculation of TAU FULL DEGREE SECHEM, checks if it's higher than current year's threshold
// Checks if the full degree & psycho grades are valid according to TAU minimum & maximums values
export const calcTauFDSechem = function (fdAvg, psycho) {
	// Extracts TAU FD SECHEM Config
	const selectedUniConfig = getUniversityConfig(fdAC, tauFD);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const tauCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		fdAvg,
		psycho,
		tauFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkDegreeSechemGrades, tauCheckGradesArr);
};

// Initiates calculation of TAU FINAL SECHEM, checks if it's higher than current year's threshold
// Checks if the Base SECHEM & MOR grades are valid according to TAU scheme
export const calcTauFinalSechem = async function (firstSechem, mor) {
	// Extracts TAU FINAL SECHEM Config
	const selectedUniConfig = getUniversityConfig(finalAC, tauFinal);

	// Builds an array with the relevant data to be used for FINAL SECHEM calculation purposes
	const tauCheckGradesArr = buildFinalSechemStatsArr(
		selectedUniConfig,
		tauFinalSechemThreshold,
		firstSechem,
		mor,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkFinalSechemGrades, tauCheckGradesArr);
};
