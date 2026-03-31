// ~~~~~~~~~~~~~~~~~~~ \\
// Bagrut Table Parser \\
// ~~~~~~~~~~~~~~~~~~~ \\

import {
	bagrutRowSelectorQuery,
	gradeName,
	inputSelectorQuery,
	selectElement,
	subjectName,
	unitsName,
} from "../../configs/html-config.js";

// Gets a bagurt-table-row and extracts its content (subject, units, grade, examType & bonus)
export function extractBagrutTableRowData(row) {
	let subject = extractSubjectFromRow(row);
	let units = extractTableInputByName(row, unitsName).value;
	let grade = extractTableInputByName(row, gradeName).value;
	let selectedExamType = row.cells[3].querySelector(selectElement).value;
	let bonus = row.cells[4].textContent;

	return [
		subject,
		parseInt(units),
		parseInt(grade),
		selectedExamType,
		parseInt(bonus),
	];
}

// Gets a bagurt-table-row and extracts its subject
function extractSubjectFromRow(row) {
	const subjectCell = row.cells[0]; // Gets SubjectCell for default rows
	const subjectSelect = subjectCell.querySelector(selectElement);

	// If there's a <select>, return its value
	if (subjectSelect) {
		return subjectSelect.value;
	}

	// Gets SubjectInput for new rows
	const subjectInput = extractTableInputByName(row, subjectName);

	// If its a new row (subjectInput is not nullish), returns its value.
	// Otherwise, returns the cell's textContent
	return subjectInput
		? subjectInput.value.trim()
		: subjectCell.textContent.trim();
}

// Gets a bagurt-table-row and extract an input from it by a given name
function extractTableInputByName(row, name) {
	return row.querySelector(inputSelectorQuery.format(name));
}

// Gets a table-id and extracts its rows
export function extractTableRowsById(tableId) {
	return document.querySelectorAll(bagrutRowSelectorQuery.format(tableId));
}

// Checks if a given bagrut-table-row is full of data (units, grade & subject)
export function isRowFull(units, grade, subject) {
	return units && subject && (grade || grade === 0);
}
