// ~~~~~~~~~~~~~~~~~~~~~~ \\
// Handle Grades Validity \\
// ~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	displayConvertedPsychoLog,
	displayFillAllInputs,
	displayHappyLog,
	displayHappyLogWithoutSechem,
	displayHttpTimeoutErrorLog,
	displayInvalidInputs,
	displayIshiutiGradeLog,
	displayNoThresholdYet,
	displaySadLog,
	displayTooLowActEnglish,
	displayTooLowActMath,
	displayTooLowBagrut,
	displayTooLowDegree,
	displayTooLowIshiuti,
	displayTooLowPrep,
	displayTooLowPsycho,
	displayUnexpectedHttpErrorLog,
	displayWaitWhileCalcLog,
} from "./update-sechem-results.js";
import {
	isFullInputs,
	isTooLowBagrut,
	isTooLowPsycho,
	isNoThresholdYet,
	isSechemBelowThreshold,
	isInvalidFinalSechemInputs,
	isHttpTimeoutError,
	isHttpUnexpectedError,
	isInvalidBagrutSechemInputs,
	isInvalidDegreeSechemInputs,
	isInvalidPrepSechemInputs,
	isTooLowPrep,
	isTooLowDegree,
	isInvalidSatInputs,
	isInvalidActInputs,
	isTooLowEngAct,
	isTooLowMathAct,
	isTooLowIshiuti,
} from "./sechem-general-rules.js";
import { isNoSechem } from "./calc-sechem-by-formula.js";

// Checks grades validity, displays results accordingly
export const checkGradesValidity = async function (
	checkGradesFunc,
	checkGradesArgs
) {
	checkGradesFunc.apply(this, checkGradesArgs);
};

// Checks bagrut & psycho grades validity, displays results accordingly
export const checkBagrutSechemGrades = async function (
	isFullInputsArgs,
	isInvalidInputsArgs,
	isTooLowBagrutArgs,
	isTooLowPsychoArgs,
	calcSechemFunc,
	calcSechemArgs,
	checkThresholdArgs
) {
	if (!isFullInputs.apply(this, isFullInputsArgs)) {
		displayFillAllInputs();
	} else if (isInvalidBagrutSechemInputs.apply(this, isInvalidInputsArgs)) {
		displayInvalidInputs();
	} else if (isTooLowBagrut.apply(this, isTooLowBagrutArgs)) {
		displayTooLowBagrut();
	} else if (isTooLowPsycho.apply(this, isTooLowPsychoArgs)) {
		displayTooLowPsycho();
	} else {
		// The grades are valid so only SECHEM threshold is left to check
		// Fetches SECHEM via API (TAU & BGU) or MATH (HUJI, TECH & BIU)
		let fetchedSechem = await calcSechemFunc.apply(this, calcSechemArgs);
		checkThresholdArgs.unshift(fetchedSechem);

		// Checks SECHEM threshold
		checkSechemThreshold.apply(this, checkThresholdArgs);
	}
};

// Checks preparatory & psycho grades validity, displays results accordingly
export const checkPrepSechemGrades = async function (
	isFullInputsArgs,
	isInvalidInputsArgs,
	isTooLowPrepArgs,
	isTooLowPsychoArgs,
	calcSechemFunc,
	calcSechemArgs,
	checkThresholdArgs,
	bagrutInfoDict
) {
	if (!isFullInputs.apply(this, isFullInputsArgs)) {
		displayFillAllInputs();
	} else if (isInvalidPrepSechemInputs.apply(this, isInvalidInputsArgs)) {
		displayInvalidInputs();
	} else if (
		bagrutInfoDict &&
		isInvalidBagrutSechemInputs.apply(this, bagrutInfoDict.isInvalidArgs)
	) {
		displayInvalidInputs();
	} else if (isTooLowPrep.apply(this, isTooLowPrepArgs)) {
		displayTooLowPrep();
	} else if (
		bagrutInfoDict &&
		isTooLowBagrut.apply(this, bagrutInfoDict.isTooLowArgs)
	) {
		displayTooLowBagrut();
	} else if (isTooLowPsycho.apply(this, isTooLowPsychoArgs)) {
		displayTooLowPsycho();
	} else {
		// The grades are valid so only SECHEM threshold is left to check
		let fetchedSechem = await calcSechemFunc.apply(this, calcSechemArgs);
		checkThresholdArgs.unshift(fetchedSechem);

		// Checks SECHEM threshold
		checkSechemThreshold.apply(this, checkThresholdArgs);
	}
};

// Checks partial/full degree & psycho grades validity, displays results accordingly
export const checkDegreeSechemGrades = async function (
	isFullInputsArgs,
	isInvalidInputsArgs,
	isTooLowDegreeArgs,
	isTooLowPsychoArgs,
	calcSechemFunc,
	calcSechemArgs,
	checkThresholdArgs
) {
	if (!isFullInputs.apply(this, isFullInputsArgs)) {
		displayFillAllInputs();
	} else if (isInvalidDegreeSechemInputs.apply(this, isInvalidInputsArgs)) {
		displayInvalidInputs();
	} else if (isTooLowDegree.apply(this, isTooLowDegreeArgs)) {
		displayTooLowDegree();
	} else if (isTooLowPsycho.apply(this, isTooLowPsychoArgs)) {
		displayTooLowPsycho();
	} else {
		// The grades are valid so only SECHEM threshold is left to check
		let fetchedSechem = await calcSechemFunc.apply(this, calcSechemArgs);
		checkThresholdArgs.unshift(fetchedSechem);

		// Checks SECHEM threshold
		checkSechemThreshold.apply(this, checkThresholdArgs);
	}
};

// Checks SAT grades validity, displays results accordingly
export const checkSatGrades = async function (satENG, satMATH, convFunc) {
	if (!isFullInputs(satENG, satMATH)) {
		displayFillAllInputs();
	} else if (isInvalidSatInputs(satENG, satMATH)) {
		displayInvalidInputs();
	} else {
		// The grades are valid so the conversion process can be initiated
		let convPsycho = await convFunc.apply(this, [satENG, satMATH]);

		// Displays Converted sat2psycho grade
		displayConvertedPsychoLog(convPsycho);
	}
};

// Checks ACT grades validity, displays results accordingly
export const checkActGrades = async function (
	actENG,
	actMATH,
	minActEng,
	minActMath,
	convFunc
) {
	if (!isFullInputs(actENG, actMATH)) {
		displayFillAllInputs();
	} else if (isInvalidActInputs(actENG, actMATH)) {
		displayInvalidInputs();
	} else if (isTooLowEngAct(actENG, minActEng)) {
		displayTooLowActEnglish();
	} else if (isTooLowMathAct(actMATH, minActMath)) {
		displayTooLowActMath();
	} else {
		// The grades are valid so the conversion process can be initiated
		let convPsycho = await convFunc.apply(this, [actENG, actMATH]);

		// Displays Converted sat2psycho grade
		displayConvertedPsychoLog(convPsycho);
	}
};

// Checks Ishiuti grades validity, displays results accordingly
export const checkIshiutiGrades = async function (
	calcFunc,
	isFullInputsArgs,
	isInvalidBioArgs,
	isInvalidStationsArgs,
	isInvalidCompArgs,
	calcInputs
) {
	if (!isFullInputs.apply(this, isFullInputsArgs)) {
		displayFillAllInputs();
	} else if (
		isInvalidFinalSechemInputs.apply(this, isInvalidBioArgs) ||
		isInvalidFinalSechemInputs.apply(this, isInvalidStationsArgs) ||
		isInvalidFinalSechemInputs.apply(this, isInvalidCompArgs)
	) {
		displayInvalidInputs();
	} else {
		// The grades are valid so the calculation process can be initiated
		let ishiutiGrade = await calcFunc.apply(this, calcInputs);

		// Displays the calculated ishiuti grade
		displayIshiutiGradeLog(ishiutiGrade);
	}
};

// Checks final sechem grades validity, displays results accordingly
export const checkFinalSechemGrades = async function (
	isFullInputsArgs,
	isInvalidInputsArgs,
	isTooLowIshiutiArgs,
	calcSechemFunc,
	calcSechemArgs,
	checkThresholdArgs
) {
	// Checks validity and displays results
	if (!isFullInputs.apply(this, isFullInputsArgs)) {
		displayFillAllInputs();
	} else if (isInvalidFinalSechemInputs.apply(this, isInvalidInputsArgs)) {
		displayInvalidInputs();
	} else if (isTooLowIshiuti.apply(this, isTooLowIshiutiArgs)) {
		displayTooLowIshiuti();
	} else {
		// The grades are valid so only SECHEM threshold is left to check
		let fetchedSechem = await calcSechemFunc.apply(this, calcSechemArgs);
		checkThresholdArgs.unshift(fetchedSechem);

		// Checks SECHEM threshold
		checkSechemThreshold.apply(this, checkThresholdArgs);
	}
};

// Checks if SECHEM is above current year's SECHEM threshold, and displays results accordingly
const checkSechemThreshold = async function (
	sechem,
	currentYearThreshold,
	requiredStatsFunc,
	requiredStatsArgs
) {
	if (isNoSechem(sechem)) {
		// Successful output (no SECHEM)
		displayHappyLogWithoutSechem();
	} else if (isHttpTimeoutError(sechem)) {
		// HTTP Timeout Error (service/server unavailable)
		displayHttpTimeoutErrorLog();
	} else if (isHttpUnexpectedError(sechem)) {
		// HTTP Unexpected Error
		displayUnexpectedHttpErrorLog();
	} else {
		let evalSechem = Number(sechem);
		if (isNoThresholdYet(currentYearThreshold)) {
			// No threshold for current year yet
			displayNoThresholdYet(evalSechem);
		} else {
			// There's a defined threshold - displays the results with the appropriate log
			if (isSechemBelowThreshold(evalSechem, currentYearThreshold)) {
				// SECHEM is below threshold, so checks for optional grade improvements and adds them to sadLog
				displayWaitWhileCalcLog(); // Plz Wait Log
				let requiredGrades = await requiredStatsFunc.apply(
					this,
					requiredStatsArgs
				);
				displaySadLog(evalSechem, requiredGrades);
			} else {
				// SECHEM is above threshold, so displays happyLog
				displayHappyLog(evalSechem);
			}
		}
	}
};
