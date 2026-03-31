// ~~~~~~~~~~~ \\
// HUJI SECHEM \\
// ~~~~~~~~~~~ \\

import getUniSechemThreshold from "../utils/handle-google-sheet.js";
import {
	checkBagrutSechemGrades,
	checkDegreeSechemGrades,
	checkFinalSechemGrades,
	checkGradesValidity,
	checkPrepSechemGrades,
} from "../utils/handle-grades-validity.js";
import {
	altAC,
	bagrutAC,
	fdAC,
	finalAC,
	hujiAlt,
	hujiFD,
	hujiFinal,
	hujiFirst,
	hujiHulFrench,
	hujiHulPrep,
	hujiHulPsycho,
	hujiPD,
	hujiPrep,
	pdAC,
	prepAC,
} from "../sechem-config.js";
import { calcRequiredStatsByMath } from "../utils/calc-required-stats.js";
import calculateSechemByFormula from "../utils/calc-sechem-by-formula.js";
import {
	buildFinalSechemStatsArr,
	buildFirstSechemStatsArr,
} from "../utils/build-sechem-stats-array.js";
import { getSelectedOption } from "../../utils/general-methods.js";
import {
	displayChooseAcLog,
	displayChoosePrepLog,
} from "../utils/update-sechem-results.js";
import {
	getSubchannelConfig,
	getUniversityConfig,
} from "../utils/config-wrappers.js";
import { uniThresholdOption } from "../../configs/google-sheet-config.js";
import { sechemExtraInfoID } from "../../configs/html-config.js";

// Sechem Thresholds
const hujiFirstSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	hujiFirst
);
const hujiFinalSechemThreshold = await getUniSechemThreshold(
	uniThresholdOption,
	hujiFinal
);

// Initiates calculation of HUJI BAGRUT SECHEM, checks if it's higher than current year's threshold
// Checks if the bagrut & psycho grades are valid according to HUJI minimum & maximums values
export const calcHujiBagrutSechem = function (bagrut, psycho) {
	// Extracts HUJI BAGRUT SECHEM Config
	const selectedUniConfig = getUniversityConfig(bagrutAC, hujiFirst);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const hujiCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		bagrut,
		psycho,
		hujiFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkBagrutSechemGrades, hujiCheckGradesArr);
};

// Initiates calculation of HUJI PREP SECHEM, checks if it's higher than current year's threshold
// Checks if the preparatory & psycho grades are valid according to HUJI minimum & maximums values
export const calcHujiPrepSechem = function (prep, psycho) {
	// EXtarcts the selected HUJI PREP SUBCHANNEL
	const selectedSubChannel = getSelectedOption(sechemExtraInfoID);

	// Extracts HUJI PREP SECHEM Config
	const selectedUniConfig = getSubchannelConfig(
		prepAC,
		hujiPrep,
		selectedSubChannel
	);

	// Checks if the defaultUni option is selected (no prep subchannel is chosen)
	if (!selectedUniConfig) {
		displayChoosePrepLog();
		return;
	}

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const hujiCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		prep,
		psycho,
		hujiFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkPrepSechemGrades, hujiCheckGradesArr);
};

// Initiates calculation of HUJI PARTIAL DEGREE SECHEM, checks if it's higher than current year's threshold
// Checks if the full degree & psycho grades are valid according to HUJI minimum & maximums values
export const calcHujiPDSechem = function (pdAvg, psycho) {
	// Extracts HUJI PD SECHEM Config
	const selectedUniConfig = getUniversityConfig(pdAC, hujiPD);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const hujiCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		pdAvg,
		psycho,
		hujiFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkDegreeSechemGrades, hujiCheckGradesArr);
};

// Initiates calculation of HUJI FULL DEGREE SECHEM, checks if it's higher than current year's threshold
// Checks if the full degree & psycho grades are valid according to HUJI minimum & maximums values
export const calcHujiFDSechem = function (fdAvg, psycho) {
	// Extracts HUJI FD SECHEM Config
	const selectedUniConfig = getUniversityConfig(fdAC, hujiFD);

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const hujiCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		fdAvg,
		psycho,
		hujiFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkDegreeSechemGrades, hujiCheckGradesArr);
};

// Calculates HUJI ALTERNATIVE grades (Rothberg, French etc...)
export const calcHujiAlternatives = function (mainScore, psycho) {
	// Extracts HUJI ALT SCORES Config
	const selectedAlternative = getSelectedOption(sechemExtraInfoID);
	const subchannelConfig = getSubchannelConfig(
		altAC,
		hujiAlt,
		selectedAlternative
	);

	// Checks if the defaultUni option is selected (no alt subchannel is chosen)
	if (!subchannelConfig) {
		displayChooseAcLog();
		return;
	}

	// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
	const hujiAltCheckGradesArr = buildFirstSechemStatsArr(
		subchannelConfig,
		mainScore, // Rothberg Prep or French Bagrut
		psycho,
		hujiFirstSechemThreshold,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	switch (selectedAlternative) {
		case hujiHulPrep:
			checkGradesValidity(checkPrepSechemGrades, hujiAltCheckGradesArr);
			break;
		case hujiHulPsycho:
			checkGradesValidity(checkBagrutSechemGrades, hujiAltCheckGradesArr);
			break;
		case hujiHulFrench:
			checkGradesValidity(checkBagrutSechemGrades, hujiAltCheckGradesArr);
			break;
		default:
			displayChooseAcLog();
			break;
	}
};

// Initiates calculation of HUJI FINAL SECHEM, checks if it's higher than current year's threshold
// Checks if the COGNITIVE SECHEM & MORKAM grades are valid according to HUJI scheme
export const calcHujiFinalSechem = function (cognitive, morkam) {
	// Extracts HUJI FINAL SECHEM Config
	const selectedUniConfig = getUniversityConfig(finalAC, hujiFinal);

	// Builds an array with the relevant data to be used for FINAL SECHEM calculation purposes
	const hujiCheckGradesArr = buildFinalSechemStatsArr(
		selectedUniConfig,
		hujiFinalSechemThreshold,
		cognitive,
		morkam,
		calcRequiredStatsByMath,
		calculateSechemByFormula
	);

	// Checks validity and displays results
	checkGradesValidity(checkFinalSechemGrades, hujiCheckGradesArr);
};
