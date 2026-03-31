// ~~~~~~~~~~~~ \\
// HAIFA SECHEM \\
// ~~~~~~~~~~~~ \\

import getUniSechemThreshold from "../utils/handle-google-sheet.js";
import {
	checkBagrutSechemGrades,
	checkDegreeSechemGrades,
	checkGradesValidity,
	checkSatGrades,
} from "../utils/handle-grades-validity.js";
import {
	altAC,
	bagrutAC,
	fdAC,
	haifaAlt,
	haifaDegreeSechemThreshold,
	haifaFD,
	haifaFinal,
	haifaFirst,
	haifaSat,
	ogBagrutYear,
} from "../sechem-config.js";
import { calcRequiredStatsByMath } from "../utils/calc-required-stats.js";
import calculateSechemByFormula from "../utils/calc-sechem-by-formula.js";
import {
	buildAlternativeStatsArr,
	buildFirstSechemStatsArr,
} from "../utils/build-sechem-stats-array.js";
import {
	displayChooseConvCalcLog,
	displayInvalidBagrutYearLog,
} from "../utils/update-sechem-results.js";
import {
	getSubchannelConfig,
	getUniversityConfig,
} from "../utils/config-wrappers.js";
import { uniThresholdOption } from "../../configs/google-sheet-config.js";
import { sechemExtraInfoID } from "../../configs/html-config.js";
import { getSelectedOption } from "../../utils/general-methods.js";

// Sechem Thresholds
const haifaFirstSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	haifaFirst
);
const haifaFinalSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	haifaFinal
);

// Initiates calculation of HAIFA BAGRUT SECHEM, checks if it's higher than current year's threshold
// Checks if the bagrut & psycho grades are valid according to HAIFA minimum & maximums values
export const calcHaifaBagrutSechem = function (bagrut, psycho, bagrutYear) {
	// Checks if the given bagrutYear is valid
	if (bagrutYear < ogBagrutYear) {
		// Invalid bagrutYear
		displayInvalidBagrutYearLog();
		return;
	}

	// Extracts HAIFA BAGRUT SECHEM Config
	const selectedUniConfig = getUniversityConfig(bagrutAC, haifaFirst);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const haifaCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		bagrut,
		psycho,
		haifaFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula,
		bagrutYear
	);

	// Checks validity and displays results
	checkGradesValidity(checkBagrutSechemGrades, haifaCheckGradesArr);
};

// Initiates calculation of HAIFA FULL DEGREE SECHEM, checks if it's higher than current year's threshold
// Checks if the full degree & psycho grades are valid according to HAIFA minimum & maximums values
export const calcHaifaFDSechem = function (fdAvg, psycho) {
	// Extracts HAIFA FD SECHEM Config
	const selectedUniConfig = getUniversityConfig(fdAC, haifaFD);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const haifaCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		fdAvg,
		psycho,
		haifaDegreeSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkDegreeSechemGrades, haifaCheckGradesArr);
};

// Calculates HAIFA ALTERNATIVE grades (SAT/ACT etc...)
export const calcHaifaAlternatives = function (args) {
	// Extracts HAIFA ALT SCORES Config
	const selectedAlternative = getSelectedOption(sechemExtraInfoID);
	const subchannelConfig = getSubchannelConfig(
		altAC,
		haifaAlt,
		selectedAlternative
	);

	// Checks if the defaultUni option is selected (no alt subchannel is chosen)
	if (!subchannelConfig) {
		displayChooseConvCalcLog();
		return;
	}

	// Builds an array with the relevant data to be used for ALT SCORE calculation purposes
	const [input1, input2] = args;
	const haifaAltCheckGradesArr = buildAlternativeStatsArr(
		subchannelConfig,
		input1,
		input2
	);

	// Checks validity and displays results
	switch (selectedAlternative) {
		case haifaSat:
			checkGradesValidity(checkSatGrades, haifaAltCheckGradesArr);
			break;
		// case haifaAct:
		// 	checkGradesValidity(checkActGrades, haifaAltCheckGradesArr);
		// 	break;
		default:
			displayChooseConvCalcLog();
			break;
	}
};
