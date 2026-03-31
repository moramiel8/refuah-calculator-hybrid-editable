// ~~~~~~~~~~~~~~~~~~~~ \\
// Sechem General Rules \\
// ~~~~~~~~~~~~~~~~~~~~ \\

import {
	httpTimeoutError,
	httpUnexpectedError,
} from "../../configs/http-config.js";
import { hyphenSlicer } from "../../utils/general-config.js";
import {
	finalVar,
	firstVar,
	maxACT,
	maxPsycho,
	maxSAT,
	minACT,
	minBagrut,
	minDegreeAvg,
	minPrep,
	minPsycho,
	minSAT,
} from "../sechem-config.js";

// Checks if sechem inputs are full of data (bagrut & psycho OR cognitive & morkam, as well as extInputData when used)
export const isFullInputs = function (
	topInputData,
	bottomInputData = 123,
	extInputData = 123
) {
	return (
		(topInputData || topInputData === 0) &&
		(bottomInputData || bottomInputData === 0) &&
		(extInputData || extInputData === 0)
	);
};

// Checks if the given psycho & bagrut grades are valid numbers and fits the MIN-MAX scale
export const isInvalidBagrutSechemInputs = function (
	psycho,
	bagrut = 0,
	uniMaxBagrut = 1
) {
	return (
		psycho > maxPsycho ||
		psycho < minPsycho ||
		!Number.isInteger(eval(psycho)) ||
		bagrut < minBagrut ||
		bagrut > uniMaxBagrut
	);
};

// Checks if the given bagrut grade is below the minimum bagrut grade
export const isTooLowBagrut = function (bagrut = 1, uniMinBagrut = 0) {
	return bagrut < uniMinBagrut;
};

// Checks if the given psycho grade is below the minimum psycho grade
export const isTooLowPsycho = function (psycho, uniMinPsycho) {
	return psycho < uniMinPsycho;
};

// Checks if the given threshold actually exists, if it is not defined yet
export const isNoThresholdYet = function (threshold) {
	return !threshold;
};

// Checks if the given sechem grade is below the minimum sechem threshold
export const isSechemBelowThreshold = function (sechem, threshold) {
	return sechem === 0 || (sechem && sechem < threshold);
};

// Checks if the given sechem grade is above the minimum sechem threshold
export const isSechemAboveThreshold = function (sechem, threshold) {
	return sechem && sechem >= threshold;
};

// Checks if the given sechem & morkam grades are valid numbers and fits the MIN-MAX scale
export const isInvalidFinalSechemInputs = function (
	ishiuti,
	minIshiuti,
	maxIshiuti,
	cognitive = 1,
	minCognitive = 0,
	maxCognitive = 2
) {
	return (
		isNaN(cognitive) ||
		ishiuti < minIshiuti ||
		ishiuti > maxIshiuti ||
		!Number.isInteger(eval(ishiuti)) ||
		cognitive < minCognitive ||
		cognitive > maxCognitive
	);
};

// Checks if the given psycho & preparatory grades are valid numbers and fits the MIN-MAX scale
export const isInvalidPrepSechemInputs = function (psycho, prep, uniMaxPrep) {
	return (
		psycho > maxPsycho ||
		psycho < minPsycho ||
		!Number.isInteger(eval(psycho)) ||
		prep < minPrep ||
		prep > uniMaxPrep
	);
};

// Checks if the given preparatory grade is below the minimum preparatory grade
export const isTooLowPrep = function (prep, uniMinPrep) {
	return prep < uniMinPrep;
};

// Checks if the given psycho & degree average grades are valid numbers and fits the MIN-MAX scale
export const isInvalidDegreeSechemInputs = function (
	psycho,
	degreeAvg,
	uniMaxDegree
) {
	return (
		psycho > maxPsycho ||
		psycho < minPsycho ||
		!Number.isInteger(eval(psycho)) ||
		degreeAvg < minDegreeAvg ||
		degreeAvg > uniMaxDegree
	);
};

// Checks if the given degreeAvg grade is below the minimum degreeAvg grade
export const isTooLowDegree = function (degreeAvg, uniMinDegreeAvg) {
	return degreeAvg < uniMinDegreeAvg;
};

// Checks if the given SAT grades are valid numbers and fits the MIN-MAX scale
export const isInvalidSatInputs = function (satENG, satMATH) {
	return (
		satENG > maxSAT ||
		satENG < minSAT ||
		satMATH > maxSAT ||
		satMATH < minSAT
	);
};

// Checks if the given ACT grades are valid numbers and fits the MIN-MAX scale
export const isInvalidActInputs = function (actENG, actMATH) {
	return (
		actENG > maxACT ||
		actENG < minACT ||
		actMATH > maxACT ||
		actMATH < minACT
	);
};

// Checks if the given actEngGrade grade is below the minimum actEngGrade grade
export const isTooLowEngAct = function (actEngGrade, uniMinActEngGrade) {
	return actEngGrade < uniMinActEngGrade;
};

// Checks if the given actMathGrade grade is below the minimum actMathGrade grade
export const isTooLowMathAct = function (actMathGrade, uniMinActMathGrade) {
	return actMathGrade < uniMinActMathGrade;
};

// Checks if the given Ishiuti grade is below the minimum Ishiuti grade
export const isTooLowIshiuti = function (ishiutiGrade, uniMinIshiutiGrade) {
	return ishiutiGrade < uniMinIshiutiGrade;
};

// Checks if the sechem equals to "httpTimeoutError".
// If so, it indicates that SECHEM couldn't be fetched, usually due to service/server unavialable.
export const isHttpTimeoutError = function (sechem) {
	return sechem === httpTimeoutError;
};

// Checks if the sechem equals to "httpUnexpectedError".
// If so, it indicates that SECHEM couldn't be fetched, due to an unexpected http error.
export const isHttpUnexpectedError = function (sechem) {
	return sechem === httpUnexpectedError;
};

// Returns if the scope is of finalSechemType
export const isFinal = function (sechemType) {
	return sechemType === finalVar;
};

// Reformats selectedSechemType var, based on selectedOption (UNI-FIRST or UNI-FINAL)
export const reformatSechemString = function (selectedOption) {
	let selectedSechemType;
	let [university, sechemType] = selectedOption.split(hyphenSlicer);
	if (isFinal(sechemType)) {
		selectedSechemType = selectedOption;
	} else {
		selectedSechemType = university + hyphenSlicer + firstVar;
	}

	return selectedSechemType;
};
