// ~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Build Sechem Stats Array \\
// ~~~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	apiType,
	doubleMode,
	dualApiType,
	psychoStep,
	singleMode,
} from "../sechem-config.js";

// Builds an array with the relevant data to be used for FIRST SECHEM calculation purposes
export const buildFirstSechemStatsArr = function (
	selectedUniConfig,
	acScore, // bagrut/prep/pd/fd
	psycho,
	threshold,
	requiredStatsFunc,
	calcSechemFunc,
	extInput = null // Only in cases there's additional calcVar (techPrep, bguPrep, haifaFirst)
) {
	let isFullInputsArgs = []; // An array with the inputs data to pass to the checkFullInputs function
	let isInvalidInputsArgs = []; // An array with the inputs data to pass to the checkInvalidInputs function
	let isTooLowAcScore = []; // An array with the admission channel input data to pass to the isTooLowAcScore function
	let isTooLowPsycho = []; // An array with the psycho input data to pass to the isTooLowPsycho function
	let calcSechemArgs = []; // An array with relevant data to pass to the calcSechem function
	let requiredStatsArr = []; // Arrays with relevant data to pass to the requiredStats function
	let extInputDict = null; // A dictionary that may hold additional data, regarding extInput
	let minAcScore = 0,
		maxAcScore = 0,
		stepAcScore = 0;

	// Extracts the data out of selectedUniConfig
	const {
		calculation: {
			type,
			mode = doubleMode, // fallback to "double" if not specified
			round,
			calcFuncs,
			requiredStats,
		},
	} = selectedUniConfig;

	// Checks if there's an additional third varibale (techPrep, bguPrep, haifaBagrut)
	const isExtInput = extInput !== null;
	if (isExtInput) {
		// techPrep & bguPrep => extInput = bagrut
		// haifaBagrut => extInput = bagrutYear
		extInputDict = {
			isInvalidArgs: [psycho, extInput, requiredStats?.maxBagrut],
			isTooLowArgs: [extInput, requiredStats?.minBagrut],
		};
		minAcScore = requiredStats?.minPrep || requiredStats?.minBagrut || 0;
		maxAcScore = requiredStats?.maxPrep || requiredStats?.maxBagrut || 0;
		stepAcScore =
			requiredStats?.prepStep ||
			requiredStats?.bagrutStep ||
			requiredStats?.degreeStep ||
			0;
	} else {
		minAcScore =
			requiredStats?.minBagrut ||
			requiredStats?.minPrep ||
			requiredStats?.minDegree ||
			0;
		maxAcScore =
			requiredStats?.maxBagrut ||
			requiredStats?.maxPrep ||
			requiredStats?.maxDegree ||
			0;
		stepAcScore =
			requiredStats?.bagrutStep ||
			requiredStats?.prepStep ||
			requiredStats?.degreeStep ||
			0;
	}

	// Dual API case (bguPrepBagrut)
	if (type === dualApiType) {
		// Extracts the data out of calcFuncs
		const { bagrutFuncs, prepFuncs, revBagrutFuncs } = calcFuncs;

		// Builds the funcArrays to fit with the dual-api case
		isFullInputsArgs = [psycho, acScore, extInput];
		isInvalidInputsArgs = [psycho, acScore, requiredStats?.maxPrep];
		isTooLowAcScore = [acScore, requiredStats?.minPrep];
		isTooLowPsycho = [psycho, requiredStats?.minPsycho];
		calcSechemArgs = [psycho, acScore, extInput, bagrutFuncs, prepFuncs];
		requiredStatsArr = [
			psycho,
			acScore,
			extInput,
			requiredStats?.maxPrep,
			requiredStats?.maxBagrut,
			threshold,
			bagrutFuncs,
			prepFuncs,
			revBagrutFuncs,
			calcSechemFunc,
		];

		// Regular API-based case
	} else if (type === apiType) {
		// Extracts the data out of calcFuncs
		const { requestArgs, isResponse, parseResponse, convertScore } =
			calcFuncs;

		// Builds the funcArrays to fit with the api case
		isFullInputsArgs = [psycho, acScore];
		isInvalidInputsArgs = [psycho, acScore, maxAcScore];
		isTooLowAcScore = [acScore, minAcScore];
		isTooLowPsycho = [psycho, requiredStats.minPsycho];
		calcSechemArgs = [
			...requestArgs,
			...[
				[acScore, psycho, convertScore.forward],
				isResponse,
				parseResponse,
			],
		];
		requiredStatsArr = [
			threshold,
			maxAcScore,
			acScore,
			psycho,
			convertScore,
			requestArgs,
			isResponse,
			parseResponse,
		];

		// Math-based case
		// Builds the funcArrays to fit with the math case
	} else {
		// Single input sechem mode (hujiHulPsycho)
		if (mode === singleMode) {
			isFullInputsArgs = [psycho];
			isInvalidInputsArgs = [psycho];
			isTooLowAcScore = [];
			isTooLowPsycho = [psycho, requiredStats.minPsycho];
			calcSechemArgs = [[psycho], round];
		} else {
			// Default or Double input sechem mode
			isFullInputsArgs = [psycho, acScore];
			isInvalidInputsArgs = [psycho, acScore, maxAcScore];
			isTooLowAcScore = [acScore, minAcScore];
			isTooLowPsycho = [psycho, requiredStats.minPsycho];
			calcSechemArgs = [[acScore, psycho], round];
		}
		requiredStatsArr = [
			requiredStats.formula,
			threshold,
			maxAcScore,
			requiredStats.maxPsycho,
			stepAcScore,
			psychoStep,
			acScore,
			psycho,
			round,
			requiredStats.visualLabel || "",
		];

		// Checks if there's an additional third varibale (techPrep, bguPrep, haifaBagrut)
		if (isExtInput) {
			// techPrep & bguPrep => extInput = bagrut
			// haifaBagrut => extInput = bagrutYear
			isFullInputsArgs.push(extInput);
			calcSechemArgs[0].push(extInput);
			requiredStatsArr.push([
				extInput,
				requiredStats?.maxBagrut || requiredStats?.maxPrep || 0,
				requiredStats?.bagrutStep || requiredStats?.prepStep || 0,
			]);
		}

		// Appends math formula if exists
		if (calcFuncs?.formula) {
			calcSechemArgs.unshift(calcFuncs.formula);
		}
	}

	// An array that holds the relevant data in order to compare the calculated SECHEM with current year's threshold
	const checkThresholdArr = [threshold, requiredStatsFunc, requiredStatsArr];

	// Returns an array that holds the relevant data regarding grades that its validity need to be checked
	return [
		isFullInputsArgs,
		isInvalidInputsArgs,
		isTooLowAcScore,
		isTooLowPsycho,
		calcSechemFunc,
		calcSechemArgs,
		checkThresholdArr,
		extInputDict, // Holds data related to extInput
	];
};

// Builds an array with the relevant data to be used for FINAL SECHEM calculation purposes
export const buildFinalSechemStatsArr = function (
	uniConfig,
	threshold,
	cognitive,
	ishiuti,
	requiredStatsFunc,
	calcSechemFunc
) {
	let isFullInputsArgs = []; // An array with the inputs data to pass to the checkFullInputs function
	let isInvalidInputsArgs = []; // An array with the inputs data to pass to the checkInvalidInputs function
	let isTooLowIshiutiArgs = []; // An array with the ishiuti score input data to pass to the isTooLowIshiuti function
	let calcInputs = []; // An array with the inputs data to pass to different calculation cases

	// Extracts the data out of selectedUniConfig
	const {
		calculation: {
			calcFuncs: { formula },
			requiredStats,
			round,
			mode = doubleMode, // fallback to "double" if not specified
		},
	} = uniConfig;

	// Single input sechem mode (techFinal)
	if (mode === singleMode) {
		isFullInputsArgs = [ishiuti];
		isInvalidInputsArgs = [
			ishiuti,
			requiredStats.minIshiuti,
			requiredStats.maxIshiuti,
		];
		isTooLowIshiutiArgs = [ishiuti, requiredStats.uniMinIshiuti];
		calcInputs = [ishiuti];
	} else {
		// Default or Double input sechem mode
		isFullInputsArgs = [ishiuti, cognitive];
		isInvalidInputsArgs = [
			ishiuti,
			requiredStats.minIshiuti,
			requiredStats.maxIshiuti,
			cognitive,
			requiredStats.minCognitive,
			requiredStats.maxCognitive,
		];
		isTooLowIshiutiArgs = [ishiuti, requiredStats.uniMinIshiuti];
		calcInputs = [cognitive, ishiuti];
	}

	// An array with relevant data to pass to the calcSechem function
	const calcSechemArgs = [formula, calcInputs, round];

	// Arrays with relevant data to pass to the requiredStats function
	const requiredStatsArr = [
		formula,
		threshold,
		requiredStats.maxCognitive,
		requiredStats.maxIshiuti,
		requiredStats.cognitiveStep,
		requiredStats.ishiutiStep,
		cognitive,
		ishiuti,
		round,
		requiredStats.visualLabel || "",
	];

	// An array that holds the relevant data in order to compare the calculated SECHEM with current year's threshold
	const checkThresholdArr = [threshold, requiredStatsFunc, requiredStatsArr];

	// Returns an array that holds the relevant data regarding grades that its validity need to be checked
	return [
		isFullInputsArgs,
		isInvalidInputsArgs,
		isTooLowIshiutiArgs,
		calcSechemFunc,
		calcSechemArgs,
		checkThresholdArr,
	];
};

// Builds an array with the relevant data to be used for ALT SCORE calculation purposes
export const buildAlternativeStatsArr = function (
	subchannelConfig,
	input1,
	input2
) {
	// Extracts the data out of selectedConfig
	const {
		calculation: {
			calcFuncs: { formula },
			requiredStats,
		},
	} = subchannelConfig;

	// An array that holds the relevant data regarding grades that its validity need to be checked
	const checkGradesArr = [input1, input2];

	// Pushes threshold checks if defined in config
	if (requiredStats?.minENG != null && requiredStats?.minMATH != null) {
		checkGradesArr.push(requiredStats.minENG, requiredStats.minMATH);
	}

	// Pushes formula function last (always)
	checkGradesArr.push(formula);

	return checkGradesArr;
};

// Builds an array with the relevant data to be used for ISHIUTI SCORE calculation purposes
export const buildIshiutiStatsArr = function (uniConfig, bio, stations, comp) {
	let isFullInputsArgs = []; // An array with the inputs data to pass to the checkFullInputs function
	let isInvalidInputsArgs = []; // An array with the inputs data to pass to the checkInvalidInputs function
	let calcInputs = []; // An array with the inputs data to pass to different calculation cases

	// Extracts the data out of selectedUniConfig
	const {
		calculation: {
			calcFuncs: { formula },
			requiredStats,
		},
	} = uniConfig;

	// Maps inputs by name to reference them dynamically
	const inputsMap = {
		valBio: bio,
		valStations: stations,
		valComp: comp,
	};

	// Goes through each stat key like minBio, maxBio, etc.
	for (const statKey in requiredStats) {
		if (!statKey.startsWith("min")) continue; // only cares about min keys

		// Extracts statKey's data
		const fieldName = statKey.slice(3); // e.g. "Bio"
		const min = requiredStats[`min${fieldName}`];
		const max = requiredStats[`max${fieldName}`];
		const value = inputsMap[`val${fieldName}`];

		// Appends the extracted statKey's data to the relevant arrays
		if (value !== undefined && min !== undefined && max !== undefined) {
			isFullInputsArgs.push(value);
			isInvalidInputsArgs.push([value, min, max]);
			calcInputs.push(value);
		}
	}

	// Returns an array that holds the relevant data regarding grades that its validity need to be checked
	return [formula, isFullInputsArgs, ...isInvalidInputsArgs, calcInputs];
};
