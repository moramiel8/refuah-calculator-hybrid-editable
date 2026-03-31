// ~~~~~~~~~~~~~~~~~~~ \\
// Create Bagrut Table \\
// ~~~~~~~~~~~~~~~~~~~ \\

import {
	examTypeExam,
	examTypeGemer,
	fiveUnits,
	funcKey,
	gradeMaxVal,
	gradeMinVal,
	noBonus,
	techBagrut,
	unitsMaxVal,
	unitsMinVal,
} from "../bagrut-config.js";
import {
	getSelectedOption,
	handleInputKeydown,
	handleInputMinAndMax,
} from "../../utils/general-methods.js";
import updateAvg from "./bagrut-avg-calc.js";
import {
	bagrutEducationsSelectID,
	bagrutTableBodyID,
	bonusName,
	buttonElement,
	deleteButtonClass,
	deleteName,
	examTypeName,
	gradeName,
	inputElement,
	inputEvent,
	keyDownEvent,
	numberInputType,
	optionElement,
	selectElement,
	subjectName,
	tableCellElement,
	tableInputClass,
	tableRowElement,
	tableSelectClass,
	textInputType,
	unitsName,
} from "../../configs/html-config.js";
import {
	deleteButtonText,
	deleteButtonTitle,
} from "../../configs/results-strs-config.js";
import { checkMizrafSubjects } from "./bagrut-general-rules.js";
import { getDefaultSubjects } from "./config-wrappers.js";

// Creates a new bagrut-table-row (subject-cell -> units-cell -> grade-cell -> examType-cell -> delete-cell)
export const createBagrutRow = function (
	subject = "",
	units = fiveUnits,
	bonus = noBonus,
	isNewRow = false
) {
	// Creates a new HTML TR element
	const row = document.createElement(tableRowElement);

	// Adds new cells to the row
	row.addTableCell(subjectName, subject, isNewRow);
	row.addTableCell(unitsName, units, isNewRow);
	row.addTableCell(gradeName, "", isNewRow);
	row.addTableCell(examTypeName, "", isNewRow);
	row.addTableCell(bonusName, bonus, isNewRow);
	row.addTableCell(deleteName, deleteButtonText, isNewRow);

	return row;
};

// Creates a new table-cell based on the given cellType
HTMLTableRowElement.prototype.addTableCell = function (
	cellType,
	cellText,
	isNewRow = false
) {
	// Creates a new HTML TD element
	const cell = document.createElement(tableCellElement);

	// Switch to cell creation defined by cellType
	switch (cellType) {
		case subjectName: //Subject Cell
			if (isNewRow) {
				let subjectInput = createTableInput(
					textInputType,
					cellType,
					cellText,
					[{ event: inputEvent, func: updateAvg }]
				);
				cell.appendChild(subjectInput);
			} else {
				// Default row
				if (Array.isArray(cellText)) {
					// Multiple options default row
					let subjectSelect = createTableSelect(cellType, cellText);
					cell.appendChild(subjectSelect);
				} else {
					// Regular default row
					cell.textContent = cellText;
				}
			}
			break;

		case unitsName: //Units Cell
			let unitsInput = createTableInput(
				numberInputType,
				cellType,
				cellText,
				[
					{
						event: inputEvent,
						func: (tableInput) => {
							handleInputMinAndMax(tableInput);
							updateAvg();
						},
						vars: { minVal: unitsMinVal, maxVal: unitsMaxVal },
					},
					{ event: keyDownEvent, func: handleInputKeydown },
				]
			);
			cell.appendChild(unitsInput);
			break;

		case gradeName: //Grade Cell
			let gradeInput = createTableInput(
				numberInputType,
				cellType,
				cellText,
				[
					{
						event: inputEvent,
						func: (tableInput) => {
							handleInputMinAndMax(tableInput);
							updateAvg();
						},
						vars: { minVal: gradeMinVal, maxVal: gradeMaxVal },
					},
					{ event: keyDownEvent, func: handleInputKeydown },
				]
			);
			cell.appendChild(gradeInput);
			break;

		case examTypeName: //ExamType Cell
			let examTypeSelect = createTableSelect(cellType);
			cell.appendChild(examTypeSelect);
			break;

		case bonusName: // Bonus Cell
			cell.textContent = cellText;
			break;

		case deleteName: // DeleteRow Cell
			if (isNewRow) {
				let deleteButton = createTableButton(
					cellText,
					deleteButtonTitle,
					this
				);
				cell.appendChild(deleteButton);
			}
			break;
	}

	// Adds the newly created cell to the row
	this.appendChild(cell);
};

// Creates a bagrut-table-input element, by the given type, name, value and assigned functions
function createTableInput(
	inputType,
	inputName,
	inputValue,
	eventListenerFuncArr
) {
	// Creates a new input element, defined by the given variables
	let tableInput = document.createElement(inputElement);
	tableInput.type = inputType;
	tableInput.name = inputName;
	tableInput.value = inputValue;
	tableInput.className = tableInputClass;

	// Iterates through the functions that need to be assigned to the input, and adds an EventListener for each
	eventListenerFuncArr.forEach((currentFuncDict) => {
		if (inputName == subjectName) {
			tableInput.addEventListener(currentFuncDict.event, () => {
				currentFuncDict[funcKey]();
			});
		} else {
			if (currentFuncDict.event == inputEvent) {
				tableInput.min = currentFuncDict.vars.minVal;
				tableInput.max = currentFuncDict.vars.maxVal;
				tableInput.addEventListener(currentFuncDict.event, function () {
					currentFuncDict[funcKey](this);
				});
			} else {
				tableInput.addEventListener(
					currentFuncDict.event,
					function (e) {
						currentFuncDict[funcKey](e);
					}
				);
			}
		}
	});

	return tableInput;
}

// Creates a bagrut-table-select element
function createTableSelect(selectType, options = []) {
	// Creates a new select element
	let tableSelect = document.createElement(selectElement);
	tableSelect.name = selectType;
	tableSelect.className = tableSelectClass;

	// Creates select options
	switch (selectType) {
		case subjectName:
			options.forEach((opt) => {
				let subjectOption = createSelectOption(opt.subject, false);
				tableSelect.appendChild(subjectOption);
			});
			break;
		case examTypeName:
			let testOption = createSelectOption(examTypeExam, true);
			let gemerOption = createSelectOption(examTypeGemer, false);
			tableSelect.appendChild(testOption);
			tableSelect.appendChild(gemerOption);
			break;
		default:
			break;
	}

	// Assigns updateAvg() function on select change, for updating the bagrut-average
	tableSelect.onchange = () => {
		updateAvg();
	};

	return tableSelect;
}

// Creates a new Select Element option, by the value and selected-status
function createSelectOption(value, isSelected) {
	let option = document.createElement(optionElement);
	option.value = value;
	option.textContent = value;
	option.selected = isSelected; // true if selected

	return option;
}

// Create a new bagrut-table-button element, by the given text, title and assigned parent-row-deletion function
function createTableButton(buttonText, buttonTitle, row) {
	// Creates a new button element, based on the given variables
	let tableButton = document.createElement(buttonElement);
	tableButton.textContent = buttonText;
	tableButton.className = deleteButtonClass;
	tableButton.title = buttonTitle;

	// When buttin is clicked, removes the row it is based on
	tableButton.onclick = function () {
		row.remove();

		// If the current university is Technion, MizrafSubjects() must be checked
		let selectedOption = getSelectedOption(bagrutEducationsSelectID);
		if (selectedOption == techBagrut) {
			checkMizrafSubjects();
		}

		// Updates bagrut-average after the changes caused by current row removal
		updateAvg();
	};

	return tableButton;
}

// Reference to the bagrut-table-body
const bagrutTableBody = document.getElementById(bagrutTableBodyID);

// Populates bagrut-table with mandatorySubjects row, according to the selected education
export const populateBagrutTable = function (educationType) {
	// Clears existing table rows
	bagrutTableBody.innerHTML = "";

	// Gets the default subjects for the selected education type
	const tableSubjects = getDefaultSubjects(educationType);

	// Builds rows according to the extracted data
	tableSubjects.forEach((item) => {
		const row = createBagrutRow(item.subject, item.units, item.bonus);
		bagrutTableBody.appendChild(row);
	});
};

export default bagrutTableBody;
