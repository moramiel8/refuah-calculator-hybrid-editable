// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Calculate Bagrut Subject Final Grade \\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	bagrutSubjBase,
	bagrutSubjCategoryBase,
	bagrutSubjEventLabel,
	bagrutSubjEventName,
	bagrutSubjExt,
	bagrutSubjExtFinalGrade,
	eventKey,
} from "../../configs/google-analytics-config.js";
import {
	bagrutSubjectsExtraInfoID,
	bagrutSubjectsID,
} from "../../configs/html-config.js";
import { bagrutExtFinalText } from "../../configs/results-strs-config.js";
import { getSelectedOption, roundDigits } from "../../utils/general-methods.js";
import {
	flatCalc,
	generalStateEducation,
	groupedCalc,
	subjFullExt,
	subjectBase,
	subjectExt,
} from "../bagrut-config.js";
import { getSubjectVariantConfig } from "./config-wrappers.js";
import { displayBagrutFinalGrade } from "./update-bagrut-results.js";

// For flat configuration: simple weighted average.
function calculateFlatGrade(config) {
	let total = 0,
		totalWeight = 0,
		finalGradeStr = "";
	config.fields.forEach((field) => {
		// Gets the entered value of each field
		const input = document.getElementById(field.id);
		if (input) {
			const value = parseFloat(input.value);
			if (!isNaN(value)) {
				// Calculates partial grade (fieldValue * fieldWeight)
				total += value * field.weight;
				totalWeight += field.weight;
			}
		}
	});

	// Calculates Bagrut Subject Final Grade (only if all the inputFields are full - totalWeight == 1/0.99), otherwise sets it to 0
	const finalGrade =
		totalWeight === 1 ||
		totalWeight.toFixed(2) === "1.00" ||
		totalWeight === 0.99 // English-No-Oral...
			? calculateFinalGrade(totalWeight, total)
			: 0;

	// Reformats & returns the results string
	finalGradeStr += config.resultsText + roundDigits(finalGrade, 0);
	return finalGradeStr;
}

// For grouped configuration: calculates each group’s grade then combines using group weights (יח"ל).
function calculateGroupedGrade(config) {
	let weightedSum = 0,
		totalGroupWeight = 0,
		groupGradesStr = "";
	config.groups.forEach((group) => {
		// Gets the entered value of each group (בסיס/הרחבה)
		let groupTotal = 0,
			groupFieldWeightTotal = 0;
		group.fields.forEach((field) => {
			// Gets the entered value of each field in the current group
			const input = document.getElementById(field.id);
			if (input) {
				const value = parseFloat(input.value);
				if (!isNaN(value)) {
					// Calculates partial grade (fieldValue * fieldWeight)
					groupTotal += value * field.weight;
					groupFieldWeightTotal += field.weight;
				}
			}
		});

		// Calculates bagrut subject current group Final Grade if inputFields are full (groupFieldWeightTotal === 1), otherwise sets it to 0
		const groupGrade =
			groupFieldWeightTotal === 1 ||
			groupFieldWeightTotal.toFixed(2) === "1.00"
				? calculateFinalGrade(groupFieldWeightTotal, groupTotal)
				: 0;

		// Reformats the results to the results string
		groupGradesStr += group.resultsText + roundDigits(groupGrade, 0);

		// Updates Subject Ultimate Final Grade Constant (only if groupGrade != 0)
		weightedSum += groupGrade
			? roundDigits(groupGrade, 0) * group.groupWeight
			: 0;
		totalGroupWeight += groupGrade ? group.groupWeight : 0;
	});

	// Calculates Bagrut Subject Final Grade
	const finalGrade = calculateFinalGrade(totalGroupWeight, weightedSum);

	// Reformats finalGrade if inputFields are full (otherwise 0) & returns the results string
	groupGradesStr +=
		finalGrade && totalGroupWeight === 5
			? "\n" + bagrutExtFinalText.format(5) + roundDigits(finalGrade, 0)
			: "\n" + bagrutExtFinalText.format(5) + roundDigits(0, 0);
	return groupGradesStr;
}

// Calculates a bagrut subject final grade
const calculateFinalGrade = function (totalWeight, total) {
	return totalWeight ? total / totalWeight : 0;
};

// Unified function to update the final grade display.
const updateSubjectFinalGrade = function () {
	// Gets the current selected subject and extendedBagrutInfo
	const subject = getSelectedOption(bagrutSubjectsID);
	const variant =
		getSelectedOption(bagrutSubjectsExtraInfoID) || generalStateEducation;

	// Gets the current selected subject and extendedBagrutInfo config
	const subjConfig = getSubjectVariantConfig(subject, variant);

	// If subject and its config exist, calculated its final grade
	let finalGradeStr = "";
	if (subject && subjConfig) {
		if (subjConfig.type === flatCalc) {
			// Calculates a Flat Final Grade (only one scenario)
			finalGradeStr = calculateFlatGrade(subjConfig);
		} else if (subjConfig.type === groupedCalc) {
			// Calculates a Grouped Final Grade (two scenarios - בסיס/הרחבה)
			finalGradeStr = calculateGroupedGrade(subjConfig);
		}
	}

	// Displays the calculated finalGrade as a result
	if (finalGradeStr) {
		displayBagrutFinalGrade(finalGradeStr);
		sendBagrutSubjLog(finalGradeStr, subject, variant); // Sends a Google Analytic log
	}
};

// Sends a Google Analytic log
const sendBagrutSubjLog = function (finalGradeStr, subject, variant) {
	// Regular expression to capture the type, unit count, and grade
	const regex = /ציון סופי (\S+) \(([^)]+) יח"ל\): (\d+)/g;
	const matches = [...finalGradeStr.matchAll(regex)];

	// Converts matches into a structured object
	const grades = matches.map((match) => ({
		type: match[1], // The word after "ציון סופי" (e.g., בסיס, השלמה, הרחבה)
		units: match[2], // Keeps '?' or any unit value as a string
		grade: parseInt(match[3], 10), // The final grade
	}));

	// Applies relevant calculated grades to the final log
	let gradesStr = "";
	for (const grade of grades) {
		// If grade === 0, no need to apply current grade to the log
		if (!grade.grade) {
			continue;
		}

		// For each gradeType, matches the given grade with a matching string
		switch (grade.type) {
			case subjectBase:
				gradesStr += bagrutSubjBase.format(grade.grade);
				break;
			case subjectExt:
				gradesStr += bagrutSubjExt.format(grade.grade);
				break;
			case subjFullExt:
				gradesStr += bagrutSubjExtFinalGrade.format(grade.grade);
				break;
			default:
				break;
		}
	}

	// If there are no calculatedGrades yet, stopps the function - no need to send a log with only 0s!
	if (!gradesStr) {
		return;
	}

	// Logs bagrut subject final grade calculation
	gtag(eventKey, bagrutSubjEventName, {
		event_category: bagrutSubjCategoryBase
			.format(variant, subject)
			.toUpperCase(),
		event_label: bagrutSubjEventLabel.format(
			subject.toUpperCase(),
			variant.toUpperCase(),
			gradesStr.toUpperCase()
		),
	});
};

export default updateSubjectFinalGrade;
