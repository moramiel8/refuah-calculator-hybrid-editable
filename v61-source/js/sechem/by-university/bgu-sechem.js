// ~~~~~~~~~~ \\
// BGU SECHEM \\
// ~~~~~~~~~~ \\

import {
	checkBagrutSechemGrades,
	checkDegreeSechemGrades,
	checkGradesValidity,
	checkPrepSechemGrades,
} from "../utils/handle-grades-validity.js";
import {
	bguDegreeSechemThreshold,
	bguFirstSechemThreshold,
	bguPrepOnly,
	bguFirst,
	bguPrep,
	bguPrepBagrut,
	bguPD,
	bguFD,
	bagrutAC,
	prepAC,
	pdAC,
	fdAC,
} from "../sechem-config.js";
import sendPostRequest from "../utils/send-post-request.js";
import {
	bguPrepCalcRequiredStats,
	calcRequiredStatsByApi,
} from "../utils/calc-required-stats.js";
import { calculateNoSechem } from "../utils/calc-sechem-by-formula.js";
import { getSelectedOption } from "../../utils/general-methods.js";
import { buildFirstSechemStatsArr } from "../utils/build-sechem-stats-array.js";
import {
	getSubchannelConfig,
	getUniversityConfig,
} from "../utils/config-wrappers.js";
import {
	displayChooseDegreeLog,
	displayChoosePrepLog,
} from "../utils/update-sechem-results.js";
import { sechemExtraInfoID } from "../../configs/html-config.js";

// Initiates calculation of BGU BAGRUT SECHEM, checks if it's higher than current year's threshold
// Checks if the bagrut & psycho grades are valid according to BGU minimum & maximums values
export const calcBguBagrutSechem = function (bagrut, psycho) {
	// Extracts BGU BAGRUT SECHEM Config
	const selectedUniConfig = getUniversityConfig(bagrutAC, bguFirst);

	// Builds an array with the relevant data needs to be used for SECHEM calculation purposes
	const bguCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		bagrut,
		psycho,
		bguFirstSechemThreshold,
		calcRequiredStatsByApi,
		sendPostRequest
	);

	// Checks validity and displays results
	checkGradesValidity(checkBagrutSechemGrades, bguCheckGradesArr);
};

// Initiates calculation of BGU PREP SECHEM, checks if it's higher than current year's threshold
// Checks if the prep & psycho grades are valid according to BGU minimum & maximums values
export const calcBguPrepSechem = function (bagrut, prep, psycho) {
	// Extracts BGU PREP SECHEM Config
	const selectedSubChannel = getSelectedOption(sechemExtraInfoID);
	const selectedUniConfig = getSubchannelConfig(
		prepAC,
		bguPrep,
		selectedSubChannel
	);

	// Defines the appropriate bguPrep Formulas, based on the selected one
	// Builds an array with the relevant data needs to be used for SECHEM calculation purposes
	if (selectedUniConfig && selectedSubChannel === bguPrepOnly) {
		const bguCheckGradesArr = buildFirstSechemStatsArr(
			selectedUniConfig,
			prep,
			psycho,
			bguFirstSechemThreshold,
			calcRequiredStatsByApi,
			sendPostRequest
		);

		// Checks validity and displays results
		checkGradesValidity(checkPrepSechemGrades, bguCheckGradesArr);
	} else if (selectedUniConfig && selectedSubChannel === bguPrepBagrut) {
		const bguCheckGradesArr = buildFirstSechemStatsArr(
			selectedUniConfig,
			prep,
			psycho,
			bguFirstSechemThreshold,
			bguPrepCalcRequiredStats,
			calcExtBguPrepSechem,
			bagrut
		);

		// Checks validity and displays results
		checkGradesValidity(checkPrepSechemGrades, bguCheckGradesArr);
	} else {
		// Default - No PREP is selected
		displayChoosePrepLog();
	}
};

// Calcultes bguPrepWithBagrut sechem, out of the given psycho, prep & bagrut grades
// Equation => (generalPrepSechem + bagrutSechem)/2
export const calcExtBguPrepSechem = async function (
	psycho,
	prep,
	bagrut,
	bagrutFuncs,
	prepFuncs
) {
	// Extracts function elements for BAGRUT and PREP
	const {
		requestArgs: bagrutReqArgs,
		isResponse: isBagrutResponse,
		parseResponse: parseBagrutResponse,
		convertScore: bagrutConvertArgs,
	} = bagrutFuncs;

	const {
		requestArgs: prepReqArgs,
		isResponse: isPrepResponse,
		parseResponse: parsePrepResponse,
		convertScore: prepConvertArgs,
	} = prepFuncs;

	// Fetches bagrutSechem
	const bagrutSechem = await sendPostRequest.apply(this, [
		...bagrutReqArgs,
		[bagrut, psycho, bagrutConvertArgs.forward],
		isBagrutResponse,
		parseBagrutResponse,
	]);

	// Fetches prepSechem
	const prepSechem = await sendPostRequest.apply(this, [
		...prepReqArgs,
		[prep, psycho, prepConvertArgs.forward],
		isPrepResponse,
		parsePrepResponse,
	]);

	// Calculates the average of bagrutSechem & prepSechem
	return Math.floor((bagrutSechem + prepSechem) / 2);
};

// Checks if the partial degree avg & psycho grades are valid according to BGU minimum & maximums values
export const calcBguPDSechem = function (pdAvg, psycho) {
	// Extracts BGU PD SECHEM Config
	const selectedSubChannel = getSelectedOption(sechemExtraInfoID);
	const selectedUniConfig = getSubchannelConfig(
		pdAC,
		bguPD,
		selectedSubChannel
	);

	// Default - No PD is selected
	if (!selectedUniConfig) {
		displayChooseDegreeLog();
		return;
	}

	// Builds an array with the relevant data needs to be used for SECHEM calculation purposes
	const bguCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		pdAvg,
		psycho,
		bguDegreeSechemThreshold,
		null,
		calculateNoSechem
	);

	// Checks validity and displays results
	checkGradesValidity(checkDegreeSechemGrades, bguCheckGradesArr);
};

// Checks if the full degree avg & psycho grades are valid according to BGU minimum & maximums values
export const calcBguFDSechem = function (fdAvg, psycho) {
	// Extracts BGU FD SECHEM Config
	const selectedUniConfig = getUniversityConfig(fdAC, bguFD);

	// Builds an array with the relevant data needs to be used for SECHEM calculation purposes
	const bguCheckGradesArr = buildFirstSechemStatsArr(
		selectedUniConfig,
		fdAvg,
		psycho,
		bguDegreeSechemThreshold,
		null,
		calculateNoSechem
	);

	// Checks validity and displays results
	checkGradesValidity(checkDegreeSechemGrades, bguCheckGradesArr);
};
