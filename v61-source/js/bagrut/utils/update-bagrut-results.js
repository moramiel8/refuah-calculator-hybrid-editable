// ~~~~~~~~~~~~~~~~~~~~~ \\
// Update Bagrut Results \\
// ~~~~~~~~~~~~~~~~~~~~~ \\

import { bagrutResultsID } from "../../configs/html-config.js";
import {
	bagrutFinalGradeDefault,
	bagrutNoCalc,
	bagrutNoEducation,
	bagrutResultText,
} from "../../configs/results-strs-config.js";
import { displayResults } from "../../utils/general-methods.js";

// Displays the calculated bagrut avg
export const displayBagrutAvg = function (usedUnits, totalUnits, avg) {
	displayResults(
		bagrutResultsID,
		bagrutResultText.format(usedUnits, totalUnits, avg)
	);
};

// Displays the calculated bagrut subject final grade
export const displayBagrutFinalGrade = function (finalGradeStr) {
	displayResults(bagrutResultsID, finalGradeStr.trim());
};

// Displays the default option of bagrut subject final grade scope
export const displayBagrutFinalGradeDefault = function () {
	displayResults(bagrutResultsID, bagrutFinalGradeDefault);
};

// Displays the following bagrutNoEducation log when no educationType is selected
export const displayBagrutNoEducation = function () {
	displayResults(bagrutResultsID, bagrutNoEducation);
};

// Displays the following bagrutNoCalc log when no bagrutCalc is selected
export const displayBagrutNoCalc = function () {
	displayResults(bagrutResultsID, bagrutNoCalc);
};
