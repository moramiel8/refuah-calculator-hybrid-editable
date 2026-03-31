// ~~~~~~~~~~~~~~~~~~~~ \\
// Bagrut General Rules \\
// ~~~~~~~~~~~~~~~~~~~~ \\

import { extendedBagrutTableBodyID } from "../../configs/html-config.js";
import {
	minBonusGrade,
	examTypeGemer,
	math,
	english,
	examTypeExam,
	fiveUnits,
	fourUnits,
	mizrafTechSubjects,
	minMizrafSubjects,
	hebrew,
} from "../bagrut-config.js";
import {
	extractBagrutTableRowData,
	extractTableRowsById,
} from "./bagrut-table-parser.js";
import { getUniversityBagrutConfig } from "./config-wrappers.js";

// Gets a row's data and checks if it's a 5-units math exam
export const isFiveUnitsMath = function (
	subject,
	units,
	examType = examTypeExam,
	grade = minBonusGrade,
	isMath = false
) {
	if (
		subject == math &&
		examType == examTypeExam &&
		(!isFiveUnitsSubject(units) || grade < minBonusGrade)
	) {
		return false;
	} else if (
		subject == math &&
		examType == examTypeExam &&
		isFiveUnitsSubject(units) &&
		grade >= minBonusGrade
	) {
		return true;
	}
	return isMath; // Handles checkMizrafSubjects()
};

// Gets a row's data and checks if it's a 5-units Hebrew exam
export const isFiveUnitsHebrew = function (subject, units) {
	return subject == hebrew && isFiveUnitsSubject(units);
};

// Gets a row's data and checks if it's a 4-units math exam
export const isFourUnitsMath = function (subject, units) {
	return subject == math && isFourUnitsSubject(units);
};

// Gets a row's data and checks if it's a 4-units English exam
export const isFourUnitsEnglish = function (subject, units) {
	return subject == english && isFourUnitsSubject(units);
};

// Gets a row's data and checks if it's a 5-units high-bonus subject
export const isFiveUnitsBonusSubject = function (subject, units, highBonusArr) {
	return highBonusArr.includes(subject) && isFiveUnitsSubject(units);
};

// Gets a row's data and checks if it's a 4-units high-bonus subject
export const isFourUnitsBonusSubject = function (subject, units, highBonusArr) {
	return highBonusArr.includes(subject) && isFourUnitsSubject(units);
};

// Gets a row's data and checks if it's a 5-units subject
export const isFiveUnitsSubject = function (units) {
	return units >= fiveUnits;
};

// Gets a row's data and checks if it's a 4-units subject
export const isFourUnitsSubject = function (units) {
	return units == fourUnits;
};

// Gets a row's data and checks if it's a no-bonus subject
export const isNoBonusSubject = function (subject, noBonusArr) {
	return noBonusArr.includes(subject);
};

// Gets a row's data and checks if its grade is under 60 (failure)
export const isFailureGrade = function (grade) {
	return grade < minBonusGrade;
};

// Gets a row's data and checks if it's a 5-units gemer work
export const isGemer = function (examType, units) {
	return examType == examTypeGemer && isFiveUnitsSubject(units);
};

// Gets a subject and checks if it's an additional subject (regarding calculation scope), according to the given university scheme
export const isAdditionalCalcSubject = function (
	subject,
	education,
	university
) {
	// Extracts uniConfig
	const uniConfig = getUniversityBagrutConfig(education, university);

	// Returns false if no config was extracted
	if (!uniConfig) return false;

	// Checks if the given subject is included in the mandatorySubjects list of the given university
	const isMandatory = uniConfig.mandatorySubjects.includes(subject);
	return !isMandatory;
};

// Gets a subject and checks if it's an additional subject (regarding calculation scope), according to the given university scheme
// If so, checks if its grade+bonus improves the current bagrut-average
export const shouldIncludeInAvg = function (
	subject,
	education,
	university,
	grade,
	bonus,
	currentAverage
) {
	if (isAdditionalCalcSubject(subject, education, university)) {
		const gain = grade + bonus;
		if (gain > currentAverage) {
			return true;
		}
	}
	return false;
};

// Checks if the bagrut certificate has an invalid number of units, according to the given university
export const isInvalidBagrutUnitsNum = function (
	unitsNum,
	education,
	university
) {
	// Extracts uniConfig
	const uniConfig = getUniversityBagrutConfig(education, university);

	// Returns false if no config was extracted or no relevant key exists in it
	if (!uniConfig?.minUnitsRequired) return false;

	// Returns whether the given unitsNum is smaller than the minimum required number of the selectedUni
	return unitsNum < uniConfig.minUnitsRequired;
};

///////////////////////////////////////////////////////////////////
////////////////////////////// TECH ///////////////////////////////
///////////////////////////////////////////////////////////////////

// In Technion, a combination of 5-units-math & two 5-units-mizraf-subjects, grants a special bonus of 30 for each
export const checkMizrafSubjects = function () {
	// Collects all bagrut-table-rows
	const rows = extractTableRowsById(extendedBagrutTableBodyID);

	// Iterates over bagrut-table-rows, and sorts out potential Mizraf Subjects
	let relevantMizrafRows = [],
		isMath = false;
	rows.forEach((row) => {
		// Extracts data out of the given row (subject, units, grade, examType & bonus)
		let subjectText, units, grade, examType, bonus;
		[subjectText, units, grade, examType, bonus] =
			extractBagrutTableRowData(row);

		// Checks if current row's data represents a 5-units math exam
		isMath = isFiveUnitsMath(subjectText, units, examType, grade, isMath);

		// Checks if current row's data represents a Mizraf Subject. If so, appends its data to relevantMizrafRows array.
		if (isMizrafSubject(subjectText, units, examType, grade)) {
			relevantMizrafRows.push({
				row: row,
				subject: subjectText,
				grade: parseInt(grade),
			});
		}
	});

	// Sorts the relevant rows by grade, descending
	relevantMizrafRows.sort((a, b) => b.grade - a.grade);

	// Checks if there's a valid Mizraf combo.
	// If so, sets bonus of 30 to the top two subjects & 25 to the others.
	// Otherwise, sets bonus of 25 to the Mizraf Subjects
	if (isValidMizrafCombo(isMath, relevantMizrafRows.length)) {
		relevantMizrafRows.slice(0, 2).forEach((item) => {
			item.row.cells[4].textContent = 30;
		});
		relevantMizrafRows.slice(2).forEach((item) => {
			item.row.cells[4].textContent = 25;
		});
	} else {
		relevantMizrafRows.forEach((item) => {
			item.row.cells[4].textContent = 25;
		});
	}
};

// Gets a row's data and checks if it's a 5-units Mizraf subject exam
export const isMizrafSubject = function (
	subjectText,
	units,
	examType = examTypeExam,
	grade = minBonusGrade
) {
	return (
		mizrafTechSubjects.includes(subjectText) &&
		isFiveUnitsSubject(units) &&
		examType == examTypeExam &&
		grade >= minBonusGrade
	);
};

// Checks if there's a valid mizraf combo (5-units math exam & two or more Mizraf subjects)
function isValidMizrafCombo(isMath, mizrafSubjectNum) {
	return isMath && mizrafSubjectNum >= minMizrafSubjects;
}
