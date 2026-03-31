// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Calculate Sechem By Formula \\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\

import { roundDigits } from "../../utils/general-methods.js";
import { undefinedUni } from "../sechem-config.js";

// Calculates SECHEM using a mathematical formula with the given sechemArgs. roundPar = number of decimals
const calculateSechemByFormula = function (formula, sechemArgs, roundPar) {
	return roundDigits(formula.apply(this, sechemArgs), roundPar).toString();
};

// Serves as a formula function in cases there's no defined SECHEM - returns "undefined"
export const calculateNoSechem = function () {
	return undefinedUni;
};

// Checks if the given sechem is undefined, meaning it belongs to a phase when there's no sechem
export const isNoSechem = function (sechem) {
	return sechem == undefinedUni;
};

export default calculateSechemByFormula;
