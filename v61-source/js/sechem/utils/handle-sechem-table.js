// ~~~~~~~~~~~~~~~~~~~ \\
// Handle Sechem Table \\
// ~~~~~~~~~~~~~~~~~~~ \\

import { thresholdsOption } from "../../configs/google-sheet-config.js";
import {
	objectDataType,
	sechemTableBodyID,
	sechemTableHeadID,
	tableBodyElement,
	tableCellElement,
	tableHeadElement,
	tableRowElement,
} from "../../configs/html-config.js";
import { hyphenSlicer } from "../../utils/general-config.js";
import {
	finalSechemTitle,
	finalWaveTitle,
	firstWaveTitle,
	yearTitle,
} from "../sechem-config.js";
import getUniSechemThreshold from "./handle-google-sheet.js";
import { isFinal, reformatSechemString } from "./sechem-general-rules.js";

// When switching to a new university, removes the old sechem table and creates a new relevant one
var oldSechemTableBody = document.getElementById(sechemTableBodyID);
const removeOldTableAndCreateNew = function (selectedOption, delta) {
	// Reformats selectedSechemType var, based on selectedOption
	let selectedSechemType = reformatSechemString(selectedOption);

	// Replaces the old sechemTable with a new one (if needed)
	var newSechemTableBody = document.createElement(tableBodyElement);
	createSechemTable(selectedSechemType, newSechemTableBody, delta);
	oldSechemTableBody.parentNode.replaceChild(
		newSechemTableBody,
		oldSechemTableBody
	);
	oldSechemTableBody = newSechemTableBody;
};

// Creates a new sechem table
async function createSechemTable(selectedOption, newSechemTableBody, delta) {
	// Extracts current university and current sechem type
	let [selectedUniversity, sechemType] = selectedOption.split(hyphenSlicer);

	// Sets tableHeaders according to the selected sechemType
	setSechemTableHeaders(sechemType);

	// Builds the new table according to the extracted values above
	let sechemThresholds = await getUniSechemThreshold(thresholdsOption);
	sechemThresholds.forEach((item) => {
		// Extracts the year and the relevant data of currentUni
		const year = item.YEAR;
		const uniData = item.data[selectedUniversity];

		// Stopps execution on error
		if (!uniData || !uniData[sechemType]) return;

		// Extracts sechem thresholds
		const sechem = uniData[sechemType];

		// Clears delta if no sechem is defined
		if (sechem === hyphenSlicer) {
			delta = "";
		}

		// Updates row, according to the selected sechem scope (first OR final)
		if (isFinal(sechemType) && typeof sechem === objectDataType) {
			const initial = sechem.initial;
			const final = sechem.final ?? ""; // fallback to "" if final missing
			if (initial || final) {
				const row = createFinalSechemRow(year, initial, final);
				newSechemTableBody.appendChild(row);
			}
		} else {
			if (sechem) {
				const row = createFirstSechemRow(year, sechem + delta);
				newSechemTableBody.appendChild(row);
			}
		}
	});
}

// Sets tableHeaders according to the selected sechemType
function setSechemTableHeaders(sechemType) {
	const thead = document.getElementById(sechemTableHeadID);
	thead.innerHTML = "";

	// Creates header's row
	const headerRow = document.createElement(tableRowElement);

	// Year Title
	const yearTh = document.createElement(tableHeadElement);
	yearTh.textContent = yearTitle;
	headerRow.appendChild(yearTh);

	// Sechem Title, according to the selected sechemType
	if (isFinal(sechemType)) {
		const initialTh = document.createElement(tableHeadElement);
		initialTh.textContent = firstWaveTitle;
		headerRow.appendChild(initialTh);

		const finalTh = document.createElement(tableHeadElement);
		finalTh.textContent = finalWaveTitle;
		headerRow.appendChild(finalTh);
	} else {
		const finalTh = document.createElement(tableHeadElement);
		finalTh.textContent = finalSechemTitle;
		headerRow.appendChild(finalTh);
	}

	thead.appendChild(headerRow);
}

// Creates a new sechemTable FirstSechem row
function createFirstSechemRow(year, sechem) {
	const row = document.createElement(tableRowElement);

	// Year Cell
	const yearCell = document.createElement(tableCellElement);
	yearCell.textContent = year;
	row.appendChild(yearCell);

	// Sechem Cell
	const sechemCell = document.createElement(tableCellElement);
	sechemCell.textContent = sechem ?? "";
	row.appendChild(sechemCell);

	return row;
}

// Creates a new sechemTable FinalSechem row
function createFinalSechemRow(year, initialSechem, finalSechem) {
	const row = document.createElement(tableRowElement);

	// Year Cell
	const yearCell = document.createElement(tableCellElement);
	yearCell.textContent = year;
	row.appendChild(yearCell);

	// initalSechem Cell
	const initialCell = document.createElement(tableCellElement);
	initialCell.textContent = initialSechem ?? "";
	row.appendChild(initialCell);

	// finalSechem Cell
	const finalCell = document.createElement(tableCellElement);
	finalCell.textContent = finalSechem ?? "";
	row.appendChild(finalCell);

	return row;
}

export default removeOldTableAndCreateNew;
