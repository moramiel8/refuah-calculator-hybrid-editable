// ~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Calculate Required Stats \\
// ~~~~~~~~~~~~~~~~~~~~~~~~ \\

import { defaultConvFunc } from "../../configs/http-config.js";
import { isEmpty, roundDigits } from "../../utils/general-methods.js";
import {
	bagrutPrec,
	bagrutPsychoOpt,
	bagrutVar,
	degreePsychoOpt,
	kabalaOpt,
	maxPsycho,
	morOnlyOpt,
	morOpt,
	morkamOpt,
	prepBagrutPsychoOpt,
	prepPsychoOpt,
	prepVar,
	psychoOnlyOpt,
	psychoPrec,
	psychoVar,
} from "../sechem-config.js";
import calculateSechemByFormula from "./calc-sechem-by-formula.js";
import {
	isSechemAboveThreshold,
	isSechemBelowThreshold,
} from "./sechem-general-rules.js";
import sendPostRequest from "./send-post-request.js";

// In case the calculated SECHEM is below current year's threshold,
// this function tries to find the required grades to pass it, via API.
// Currently relevant only to FIRST SECHEM of TAU/BGU.
export const calcRequiredStatsByApi = async function (
	threshold,
	uniMaxFirstVar,
	firstVar,
	psycho,
	conversionArgs,
	sendPostReqArgs,
	isResponseFunc,
	parseResponseFunc
) {
	// Extrcts firstVarName, forward & inverse conversion functions (for bguPrep, tauPrep cases)
	const {
		name: firstVarName,
		forward: forwardConvertFn,
		inverse: inverseConvertFn,
	} = conversionArgs;

	// MIN & MAX values of psycho & bagrut/prep.
	// MAX is universal while MIN is the entered values, as the user has already passed uniMin value.
	const edgeValues = {
		psycho: { max: maxPsycho, min: psycho },
		[firstVarName]: {
			max: forwardConvertFn(uniMaxFirstVar),
			min: forwardConvertFn(firstVar),
		},
	};

	// Iterates over the stats, for each tries to find the minimum value which enables to pass the given threshold
	let requiredVars = {};
	for (let varName of Object.keys(edgeValues)) {
		// Saves currentVar, otherVar, and currentVar's Min & Max values
		let otherVar = varName === psychoVar ? firstVar : psycho;
		let maxVarValue = edgeValues[varName].max;
		let minVarValue = edgeValues[varName].min;

		// No conversion needed for psycho, so we use the defaultConvfunc
		const currInverseConvFn =
			varName === psychoVar ? defaultConvFunc : inverseConvertFn;

		// Tests the maximum value for the current variable.
		// If its produced SECHEM is also below threshold, no need to keep to the binary search part - continues to the next variable
		let precision = varName === psychoVar ? psychoPrec : bagrutPrec; // Precision: 2 for bagrut/prep, 0 for psycho
		let testMaxResult = await testArgs(
			varName,
			maxVarValue,
			firstVar,
			psycho,
			forwardConvertFn,
			inverseConvertFn,
			sendPostReqArgs,
			isResponseFunc,
			parseResponseFunc
		);

		if (isSechemBelowThreshold(testMaxResult, threshold)) {
			requiredVars[varName] = null;
			continue;
		} else {
			// Initializes varNames' required value
			requiredVars[varName] = parseFloat(
				currInverseConvFn(maxVarValue).toFixed(precision)
			);
		}

		// Binary search to find the minimum value for the current variable
		let low = minVarValue,
			high = maxVarValue,
			lastMid = null, // Tracks the last mid value
			ogMinVarValue = minVarValue,
			epsilon = Math.pow(10, -precision - 1); // Smallest increment based on precision

		// Until the difference between high & low is lower than epsilon (increment)
		while (high - low > epsilon) {
			// Calculates midpoint without rounding
			let mid = (low + high) / 2;

			// If the variable is psycho, ensure mid is treated as an integer (round).
			// For bagrut/prep, continues with float precision.
			mid =
				varName === psychoVar
					? Math.round(mid)
					: parseFloat(mid.toFixed(precision));

			// Exits the loop if no change in midpoint - very low decimal handling
			if (lastMid !== null && mid === lastMid) {
				break;
			}

			// Tests the minimum value (mid) for the current variable.
			// If its produced SECHEM is above threshold, tries for a lower value - otherwise tries for a higher one.
			let testMinResult = await testArgs(
				varName,
				mid,
				firstVar,
				psycho,
				forwardConvertFn,
				inverseConvertFn,
				sendPostReqArgs,
				isResponseFunc,
				parseResponseFunc
			);
			if (isSechemAboveThreshold(testMinResult, threshold)) {
				minVarValue = mid;
				high = mid; // Tries for a smaller value
			} else {
				low = mid; // Increases value
			}

			// Stores the current mid value for next iteration comparison - very low decimal handling
			lastMid = mid;
		}

		// Checks if minVarValue still equals to ogMinVarValue - a case where no value meets the threshold, other than maxVarValue.
		// Otherwise, saves its value, and may be prone to additional final tests (due to precision point mismatches)
		if (minVarValue != ogMinVarValue) {
			// If scope is psychoVar, no additional checks are needed
			if (varName === psychoVar) {
				requiredVars[varName] = parseFloat(
					currInverseConvFn(minVarValue).toFixed(precision)
				);
			} else {
				// Additional checks are needed, due to precision point mismatches

				// gets minVarValue, rounded by the defined precision value
				let roundedVarValue = parseFloat(
					currInverseConvFn(minVarValue).toFixed(precision)
				);

				// Re-tests roundedVarValue
				let finalTestResult = await testArgs(
					varName,
					forwardConvertFn(roundedVarValue),
					firstVar,
					psycho,
					forwardConvertFn,
					inverseConvertFn,
					sendPostReqArgs,
					isResponseFunc,
					parseResponseFunc
				);

				// If it fails threshold, nudges up by smallest increment until it passes (bound by its maxValue)
				let step = Math.pow(10, -precision);
				while (
					isSechemBelowThreshold(finalTestResult, threshold) &&
					forwardConvertFn(roundedVarValue) <= maxVarValue
				) {
					roundedVarValue = parseFloat(
						(roundedVarValue + step).toFixed(precision)
					);
					finalTestResult = await testArgs(
						varName,
						forwardConvertFn(roundedVarValue),
						firstVar,
						psycho,
						forwardConvertFn,
						inverseConvertFn,
						sendPostReqArgs,
						isResponseFunc,
						parseResponseFunc
					);
				}

				// Saves the found roundedVarValue
				requiredVars[varName] = roundedVarValue;
			}
		}
	}

	// Returns the requiredVars
	return requiredVars;
};

// Gets some grades, and fetches SECHEM via API with them
const testArgs = async function (
	varName,
	edgeVarValue,
	firstVar,
	psycho,
	forwardConvertFn,
	inverseConvertFn,
	sendPostReqArgs,
	isResponseFunc,
	parseResponseFunc
) {
	// Creates a test array with the given grades
	const testArr = sendPostReqArgs
		.slice()
		.concat([
			[
				varName === bagrutVar || varName === prepVar
					? inverseConvertFn(edgeVarValue)
					: firstVar,
				varName === psychoVar ? edgeVarValue : psycho,
				forwardConvertFn,
			],
			isResponseFunc,
			parseResponseFunc,
		]);

	// Fetches SECHEM
	const sechemResult = await sendPostRequest.apply(this, testArr);

	// Returns fetched SECHEM
	return sechemResult;
};

// In case the calculated FIRST/FINAL SECHEM is below current year's threshold,
// this function tries to find the required grades to pass it, via a mathematical formula.
export const calcRequiredStatsByMath = function (
	sechemFormula,
	threshold,
	maxFirstVar,
	maxSecondVar,
	firstVarStep,
	secondVarStep,
	firstVar,
	secondVar,
	roundPar,
	calcType,
	extInfoArr = [] // An array that may hold data regarding an additional thirdVar
) {
	// If extInfoArr contains data, solves for three requiredVars - otherwise only for two
	let requiredFirstVar, requiredSecondVar, requiredThirdVar;
	if (!isEmpty(extInfoArr)) {
		[requiredFirstVar, requiredSecondVar, requiredThirdVar] =
			solveForThreeVars(
				sechemFormula,
				threshold,
				maxFirstVar,
				maxSecondVar,
				firstVarStep,
				secondVarStep,
				firstVar,
				secondVar,
				roundPar,
				extInfoArr
			);
	} else {
		[requiredFirstVar, requiredSecondVar] = solveForOneOrTwoVars(
			sechemFormula,
			threshold,
			maxFirstVar,
			maxSecondVar,
			firstVarStep,
			secondVarStep,
			firstVar,
			secondVar,
			roundPar
		);
	}

	// Forms a matching requiredArray out of the calculated required values
	let requiredVars = getRequiredVars(
		calcType,
		requiredFirstVar,
		requiredSecondVar,
		requiredThirdVar
	);

	// Returns the requiredVars
	return requiredVars;
};

// Solves for one or two requiredVars
const solveForOneOrTwoVars = function (
	sechemFormula,
	threshold,
	maxFirstVar,
	maxSecondVar,
	firstVarStep,
	secondVarStep,
	firstVar,
	secondVar,
	roundPar
) {
	// Handles cases in which only one var is passed instead of two (TECH FINAL SECHEM)
	if (!firstVar) {
		firstVar = secondVar;
		firstVarStep = secondVarStep;
		maxFirstVar = maxSecondVar;
	}

	// Solves for firstVar, holding secondVar constant
	let requiredFirstVar = null;
	requiredFirstVar = findMissingStat(
		(value) =>
			calculateSechemByFormula(
				sechemFormula,
				[value, secondVar],
				roundPar
			),
		threshold,
		firstVar,
		maxFirstVar,
		firstVarStep
	);

	// Solves for secondVar, holding firstVar constant
	let requiredSecondVar = null;
	requiredSecondVar = findMissingStat(
		(value) =>
			calculateSechemByFormula(
				sechemFormula,
				[firstVar, value],
				roundPar
			),
		threshold,
		secondVar,
		maxSecondVar,
		secondVarStep
	);

	return [requiredFirstVar, requiredSecondVar];
};

// Solves for three requiredVars
const solveForThreeVars = function (
	sechemFormula,
	threshold,
	maxFirstVar,
	maxSecondVar,
	firstVarStep,
	secondVarStep,
	firstVar,
	secondVar,
	roundPar,
	extInfoVar
) {
	let thirdVar, maxThirdVar, thirdVarStep;
	[thirdVar, maxThirdVar, thirdVarStep] = extInfoVar;

	// Solves for firstVar, holding secondVar & thirdVar as constants
	let requiredFirstVar = null;
	requiredFirstVar = findMissingStat(
		(value) =>
			calculateSechemByFormula(
				sechemFormula,
				[value, secondVar, thirdVar],
				roundPar
			),
		threshold,
		firstVar,
		maxFirstVar,
		firstVarStep
	);

	// Solves for secondVar, holding firstVar & thirdVar as constants
	let requiredSecondVar = null;
	requiredSecondVar = findMissingStat(
		(value) =>
			calculateSechemByFormula(
				sechemFormula,
				[firstVar, value, thirdVar],
				roundPar
			),
		threshold,
		secondVar,
		maxSecondVar,
		secondVarStep
	);

	// Solves for thirdVar, holding firstVar & secondVar as constants
	let requiredThirdVar = null;
	requiredThirdVar = findMissingStat(
		(value) =>
			calculateSechemByFormula(
				sechemFormula,
				[firstVar, secondVar, value],
				roundPar
			),
		threshold,
		thirdVar,
		maxThirdVar,
		thirdVarStep
	);

	return [requiredFirstVar, requiredSecondVar, requiredThirdVar];
};

// Helper function to calculate the missing stat using a mathematical formula
const findMissingStat = function (
	partialFormula,
	threshold,
	minValue,
	maxValue,
	step
) {
	// Tests the maximum value for the current variable.
	// If its produced SECHEM is also below threshold, no need to keep searching for a minimum matching value - continues to the next variable
	if (isSechemBelowThreshold(partialFormula(maxValue), threshold)) {
		return null;
	}

	// Brute force or analytical approach to find the missing minimum value
	let value = minValue;
	while (isSechemBelowThreshold(partialFormula(value), threshold)) {
		value += step;
	}

	// Returns the minimum value of current variable when it is found
	return roundDigits(value, 3);
};

// Gets the values calculated using a mathemtical formula, and returns them as a matching requiredArray
const getRequiredVars = function (
	calcType,
	requiredFirstVar,
	requiredSecondVar,
	requiredThirdVar
) {
	switch (calcType) {
		case bagrutPsychoOpt:
			return {
				bagrut: requiredFirstVar,
				psycho: requiredSecondVar,
			};

		case prepPsychoOpt:
			return {
				prep: requiredFirstVar,
				psycho: requiredSecondVar,
			};
		case prepBagrutPsychoOpt:
			return {
				prep: requiredFirstVar,
				psycho: requiredSecondVar,
				bagrut: requiredThirdVar,
			};

		case degreePsychoOpt:
			return {
				degree: requiredFirstVar,
				psycho: requiredSecondVar,
			};

		case psychoOnlyOpt:
			return {
				psycho: requiredFirstVar,
			};

		case morkamOpt:
			return {
				cognitive: requiredFirstVar,
				morkam: requiredSecondVar,
			};

		case morOpt:
			return {
				first: requiredFirstVar,
				mor: requiredSecondVar,
			};

		case morOnlyOpt:
			return {
				mor: requiredFirstVar,
			};

		case kabalaOpt:
			return {
				kabala: requiredFirstVar,
			};

		default:
			break;
	}
};

/////////////////////////////////////////////////////////////////////
// SPECIAL SECTION FOR BGU PREPARATORY SECHEM WITH BAGRUT SCENARIO //
/////////////////////////////////////////////////////////////////////

// Gets psycho, prep & bagrut values, as well as BGU threshold, and calculated required stats for each to pass it (if possible)
export const bguPrepCalcRequiredStats = async function (
	psycho,
	prep,
	bagrut,
	maxPrep,
	maxBagrut,
	threshold,
	bagrutFuncs,
	prepFuncs,
	revBagrutFuncs,
	calcSechemFunc
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

	// Fetches current bagrut & prep sechems using the api of each.
	const currentBagrutSechem = await sendPostRequest.apply(this, [
		...bagrutReqArgs,
		[bagrut, psycho, bagrutConvertArgs.forward],
		isBagrutResponse,
		parseBagrutResponse,
	]);
	const currentPrepSechem = await sendPostRequest.apply(this, [
		...prepReqArgs,
		[prep, psycho, prepConvertArgs.forward],
		isPrepResponse,
		parsePrepResponse,
	]);

	// The finalPrepSechem is calculated as the average of both bagrut & prep sechems
	// Determines the required new sechems to reach the threshold
	const requiredSum = threshold * 2; // Since it's an average of two scores
	let requiredBagrutSechem = requiredSum - currentPrepSechem;
	let requiredPrepSechem = requiredSum - currentBagrutSechem;

	// Where optional suggested changes may be added
	let suggestedChanges = {};

	// Calculates the required psycho grade in order to pass the threshold
	const requiredPsycho = await calcBguPrepRequiredPsycho(
		bagrut,
		prep,
		psycho,
		threshold,
		bagrutFuncs,
		prepFuncs,
		calcSechemFunc
	);

	// If requiredPsycho is bigger than currentPsycho, appends its value to the suggestionDict
	if (requiredPsycho > psycho) {
		suggestedChanges.psycho = requiredPsycho;
	}

	// Calculates the required bagrut grade in order to pass the threshold
	suggestedChanges.bagrut = await calcBguPrepRequiredBagrut(
		maxBagrut,
		requiredBagrutSechem,
		psycho,
		bagrutFuncs,
		revBagrutFuncs
	);

	// Calculates the required preparatory grade in order to pass the threshold
	const requiredPrep = await calcRequiredStatsByApi(
		requiredPrepSechem,
		maxPrep,
		prep,
		psycho,
		prepConvertArgs,
		prepReqArgs,
		isPrepResponse,
		parsePrepResponse
	);
	suggestedChanges.prep = roundDigits(requiredPrep.prep, 2);

	// Returns the suggestionDict
	return suggestedChanges;
};

// Calculates the required psycho grade in order to pass the threshold
async function calcBguPrepRequiredPsycho(
	bagrut,
	prep,
	currentPsycho,
	threshold,
	bagrutFuncs,
	prepFuncs,
	calcSechemFunc
) {
	// Tests if maxPsycho is enough to pass the threshold. If not, returns automatically
	let maxPsychoSechem = await calcSechemFunc(
		maxPsycho,
		prep,
		bagrut,
		bagrutFuncs,
		prepFuncs
	);
	if (isSechemBelowThreshold(maxPsychoSechem, threshold)) {
		return;
	}

	// Initializes some variables, and performs a binary search regarding the requiredPsycho
	let low = currentPsycho,
		high = maxPsycho,
		epsilon = Math.pow(10, -psychoPrec),
		requiredPsycho = maxPsycho;
	while (high - low > epsilon) {
		// Finds mid range and checks fetches sechem value with it
		let midPsycho = Math.floor((low + high) / 2);
		let newFinalSechem = await calcSechemFunc(
			midPsycho,
			prep,
			bagrut,
			bagrutFuncs,
			prepFuncs
		);

		// Updates relevant variables, whether the sechem is below/above threshold
		if (isSechemAboveThreshold(newFinalSechem, threshold)) {
			requiredPsycho = roundDigits(midPsycho, 0);
			high = midPsycho; // Tries for a smaller psycho value
		} else {
			low = midPsycho; // Increases value
		}
	}

	// Returns the required Psycho
	return requiredPsycho;
}

// Calculates the required bagrut grade in order to pass the threshold
const calcBguPrepRequiredBagrut = async function (
	maxBagrut,
	requiredBagrutSechem,
	psycho,
	bagrutFuncs,
	revBagrutFuncs
) {
	// Extract function elements for revBagrut
	const {
		requestArgs: revBagrutReqArgs,
		isResponse: isRevBagrutResponse,
		parseResponse: parseRevBagrutResponse,
		convertScore: revBagrutConvertArgs,
	} = revBagrutFuncs;

	// Checks backwards - the required bagrut grade by sending the requiredSechem as variable to the api
	let requiredBagrut = await sendPostRequest.apply(this, [
		...revBagrutReqArgs,
		[requiredBagrutSechem, psycho, revBagrutConvertArgs.forward],
		isRevBagrutResponse,
		parseRevBagrutResponse,
	]);

	// Updates realRequiredBagrut, as requiredBagrut might be over bagrut's real max value
	let realRequiredBagrut = requiredBagrut;
	if (requiredBagrut > maxBagrut) {
		realRequiredBagrut = maxBagrut;
	}

	// Extract function elements for BAGRUT
	const {
		requestArgs: bagrutReqArgs,
		isResponse: isBagrutResponse,
		parseResponse: parseBagrutResponse,
		convertScore: bagrutConvertArgs,
	} = bagrutFuncs;

	// The API might not fetch the exact minimum requiredBagrut grade.
	// For that, iterates and fetches new sechem, in each iteration bagrut is substracted by 0.01
	while (realRequiredBagrut >= 0) {
		let bagrutSechem = await sendPostRequest.apply(this, [
			...bagrutReqArgs,
			[realRequiredBagrut, psycho, bagrutConvertArgs.forward],
			isBagrutResponse,
			parseBagrutResponse,
		]);

		// If the fetches sechem is below threshold, it means that the last fetched one is the minimum we're looking for
		if (isSechemBelowThreshold(bagrutSechem, requiredBagrutSechem)) {
			// If BGU bagrut max value results in a too low seachm, we can already break out of the loop
			if (realRequiredBagrut !== maxBagrut)
				return roundDigits(realRequiredBagrut + 0.01, 2);
			break;
		} else {
			realRequiredBagrut -= 0.01;
		}
	}

	// Returns nothing, as it is not possible to reach the requiredSechem with any bagrut grade
	return;
};
