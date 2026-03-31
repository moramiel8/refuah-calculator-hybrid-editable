// ~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Calculate Bagrut Average \\
// ~~~~~~~~~~~~~~~~~~~~~~~~ \\

import displayAvg from "./update-bagrut-avg.js";
import {
	extractTableRowsById,
	extractBagrutTableRowData,
	isRowFull,
} from "./bagrut-table-parser.js";
import {
	isAdditionalCalcSubject,
	shouldIncludeInAvg,
	isInvalidBagrutUnitsNum,
	isFiveUnitsMath,
	isFourUnitsMath,
	checkMizrafSubjects,
} from "./bagrut-general-rules.js";
import {
	getSelectedOption,
	isDefaultOpt,
	roundDigits,
} from "../../utils/general-methods.js";
import { techBagrut } from "../bagrut-config.js";
import {
	bagrutEducationsSelectID,
	bagrutRowBgColor,
	bagrutUniversitiesExtraInfoID,
	boldText,
	extendedBagrutTableBodyID,
	functionType,
	normalText,
} from "../../configs/html-config.js";
import { getUniversityBagrutConfig } from "./config-wrappers.js";

// Gets a bagrut-table-row and updates its bonus cell with an appropriate value
function updateBonus(row) {
	// Extracts data out of the given row (subject, units, grade, examType & bonus)
	let subject, units, grade, selectedExamType, bonus;
	[subject, units, grade, selectedExamType, bonus] =
		extractBagrutTableRowData(row);

	// Gets the selected education and university options
	const educationID = getSelectedOption(bagrutEducationsSelectID);
	const universityID = getSelectedOption(bagrutUniversitiesExtraInfoID);

	// Gets the config for the selected university
	const uniConfig = getUniversityBagrutConfig(educationID, universityID);

	// Resets the bonus variable to 0, as its original value is not necessary
	bonus = 0;

	// According to the values of the extracted cells & university above, updates the bonus respectively
	if (uniConfig && isRowFull(units, grade, subject)) {
		// Goes through the config's bonusRules and picks the first one that applies
		for (const rule of uniConfig.bonusRules ?? []) {
			const conditionMatched = rule.condition(
				{ subject, units, grade, examType: selectedExamType },
				uniConfig
			);
			if (conditionMatched) {
				bonus = rule.bonus;

				// Trigger any side effect like checkMizrafSubjects()
				if (typeof rule.postAction === functionType) {
					rule.postAction();
				}
				// Stop at first matching rule
				break;
			}
		}
	}

	// When the selected university is Technion & a row cell was reset, so there might be changes related to MizrafSubjects
	else if (universityID == techBagrut) {
		checkMizrafSubjects();
	}

	// Updates the row's bonus cell with the appropriate value
	if (bonus !== null && bonus !== undefined) {
		row.cells[4].textContent = bonus;
	}
}

// Calculates & updates bagrut average
const updateAvg = function () {
	// Gets the selected education & university options
	let education = getSelectedOption(bagrutEducationsSelectID);
	let university = getSelectedOption(bagrutUniversitiesExtraInfoID);

	// Collects all bagrut-table-rows
	const rows = extractTableRowsById(extendedBagrutTableBodyID);

	// Iterates over bagrut-table-rows & updates the bonus cell of each
	rows.forEach((row) => {
		updateBonus(row);
	});

	// Starts calculations of the bagrut-average out of the valid mandatory subjects in bagrut-table-rows
	let sum = 0,
		unitsNum = 0,
		totalUnitsNum = 0,
		deltaUnits = 0,
		noneMandatorySubjects = [];
	[sum, unitsNum, totalUnitsNum, deltaUnits, noneMandatorySubjects] =
		calculateMandatorySubjects(university, education, rows);

	// Sorts the noneMandatorySubjects by impact, descending
	let avg = sum / unitsNum;
	let sortedNoneMandatorySubjects = [];
	noneMandatorySubjects.sort((a, b) => {
		const impactA = (a.gradeWithBonus - avg) * a.units;
		const impactB = (b.gradeWithBonus - avg) * b.units;
		return impactB - impactA; // descending order (most positive impact first)
	});
	noneMandatorySubjects.forEach((item) => {
		sortedNoneMandatorySubjects.push(item.row);
	});

	// Finishes calculations of the bagrut-average out of the valid subjects in sortedNoneMandatorySubjects-rows
	[unitsNum, avg] = calculateAdditionalSubjects(
		sum,
		unitsNum,
		education,
		university,
		sortedNoneMandatorySubjects
	);

	// Displays the appropriate calculated bagrut-average
	return displayAvg(
		avg,
		unitsNum,
		totalUnitsNum,
		deltaUnits,
		education,
		university
	);
};

// Gets bagrut-table-rows & starts calculations of the bagrut-average out of the valid mandatory subjects in it
function calculateMandatorySubjects(university, education, bagrutTableRows) {
	// Iterates over bagrut-table-rows and performs bagrut-average calculations where needed.
	let sum = 0,
		unitsNum = 0,
		totalUnitsNum = 0,
		deltaUnits = 0,
		noneMandatorySubjects = [];
	bagrutTableRows.forEach((row) => {
		// Extracts data out of the given row (subject, units, grade, examType & bonus)
		let subject, units, grade, selectedExamType, bonus;
		[subject, units, grade, selectedExamType, bonus] =
			extractBagrutTableRowData(row);

		// Checks if this is a valid row where all of its content is filled
		if (isRowFull(units, grade, subject)) {
			// 5-units math in Technion grade cosidered as doubled weight (10-units)
			if (isFiveUnitsMath(subject, units) && university == techBagrut) {
				// Bolds row's style
				row.setRowStyle(boldText, bagrutRowBgColor);

				// Adds stats to average calculation
				sum += 10 * (grade + bonus);
				unitsNum += 10;
				deltaUnits += units; // to remove additional units in display later
			}

			// 4-units math in Technion grade cosidered as doubled weight (8-units)
			else if (
				isFourUnitsMath(subject, units) &&
				university == techBagrut
			) {
				// Bolds row's style
				row.setRowStyle(boldText, bagrutRowBgColor);

				// Adds stats to average calculation
				sum += 8 * (grade + bonus);
				unitsNum += 8;
				deltaUnits += units; // to remove additional units in display later
			}

			// Checks if university is default-uni (which calculates everything) OR if current row includes a mandatory subject
			else if (
				isDefaultOpt(university) ||
				!isAdditionalCalcSubject(subject, education, university)
			) {
				// Bolds row's style
				row.setRowStyle(boldText, bagrutRowBgColor);

				// Adds stats to average calculation
				sum += units * (grade + bonus);
				unitsNum += units;
			} else {
				// Resets row's style
				row.setRowStyle(normalText, "");

				// Current subject is not a mandatory subject, so it's added to noneMandatorySubjects array, to be checked later
				noneMandatorySubjects.push({
					row: row,
					subject: subject,
					units: units,
					gradeWithBonus: parseInt(grade + bonus),
				});
			}

			// Sums up total units number
			totalUnitsNum += units;
		} else {
			// Resets row's style
			row.setRowStyle(normalText, "");
		}
	});

	return [sum, unitsNum, totalUnitsNum, deltaUnits, noneMandatorySubjects];
}

// Gets sortedNoneMandatorySubjects-rows & finishes calculations of the bagrut-average out of the valid subjects in it
function calculateAdditionalSubjects(
	sum,
	unitsNum,
	education,
	university,
	sortedNoneMandatorySubjects
) {
	// Calculates current bagrut-average as initialized value
	let avg = sum / unitsNum;

	// Iterates over sortedNoneMandatorySubjects-rows and adds to calculations only those which improve the average.
	sortedNoneMandatorySubjects.forEach((row) => {
		// Extracts data out of the given row (subject, units, grade, examType & bonus)
		let subject, units, grade, selectedExamType, bonus;
		[subject, units, grade, selectedExamType, bonus] =
			extractBagrutTableRowData(row);

		// Checks if this is a valid row where all of its content is filled
		if (isRowFull(units, grade, subject)) {
			// Checks if current subject should be included in average:
			// 1. Only if row is filled
			// 2. Improves current average
			// 3. Units Number is currently below uniUnitsMin value
			if (
				isNaN(avg) ||
				shouldIncludeInAvg(
					subject,
					education,
					university,
					grade,
					bonus,
					avg
				) ||
				isInvalidBagrutUnitsNum(unitsNum, education, university)
			) {
				// Bolds row's style
				row.setRowStyle(boldText, bagrutRowBgColor);

				// Adds stats to average calculation
				sum += units * (grade + bonus);
				unitsNum += units;
				avg = sum / unitsNum;
			}

			// As it was found that current subject should not be included in average,
			// Checks if it's not a mandatory subject. If so, resets its row's style
			else if (isAdditionalCalcSubject(subject, education, university)) {
				// Resets row's style
				row.setRowStyle(normalText, "");
			}
		} else {
			// Resets row's style
			row.setRowStyle(normalText, "");
		}
	});

	return [unitsNum, roundDigits(avg, 2)];
}

export default updateAvg;
