// ~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Handle Google Sheet Data \\
// ~~~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	BIU,
	HAIFA,
	HUJI,
	TAU,
	TECH,
	TZAMERET,
	hyphenSlicer,
} from "../../utils/general-config.js";
import {
	firstCol,
	iterByUniNum,
	noDataSheetCell,
	sheetYearlyDictTemplate,
	techYearColIndex,
	thresholdsOption,
	thresholdsSheetUrl,
	uniCellNum,
	uniThresholdOption,
	yearOption,
	yearsSheetUrl,
} from "../../configs/google-sheet-config.js";
import { isEmpty } from "../../utils/general-methods.js";
import { objectDataType } from "../../configs/html-config.js";
import { isFinal } from "./sechem-general-rules.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// SCHAMIM YEARS VALIDITY /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// Gets raw rows of SCHAMIM Years, then with some manipulations returns an organized Dictionary of them
function extractYears(data) {
	// Skips the first element in the main array
	const relevantData = data.slice(1);
	const result = {};

	relevantData.forEach((subList) => {
		// Cleans empty elements
		const cleanList = subList.filter(
			(item) => item !== "" && item !== null
		);

		// If there are more than 2 elements, ignores the first one
		// If there are exactly 2, takes both
		if (cleanList.length >= 2) {
			let key, value;

			if (cleanList.length > 2) {
				// Ignores the first and takes the next 2
				key = cleanList[1];
				value = cleanList[2];
			} else {
				// There are exactly 2
				key = cleanList[0];
				value = cleanList[1];
			}

			result[key] = value;
		}
	});

	return result;
}

// Initiates an HTTP request that extracts Google Sheet's SCHAMIM Validity content
async function carveSechemYears() {
	try {
		// HTTP Request & Response
		const response = await fetch(yearsSheetUrl);
		const data = await response.json();

		if (data.values) {
			// Extracts data in an organized JSON format
			return extractYears(data.values);
		} else {
			// No data found - error
			throw ErrorEvent;
		}
	} catch (error) {
		// An error occurred
		console.log(error);
	}
}

// Extracts the requested google sheet value (sechem years validity)
let sechemYears = {};
let cachedSechemYearsData = null;
export const getUniSechemYears = async function () {
	// Checks if there is already some data carved from Google Sheet
	if (!cachedSechemYearsData) {
		sechemYears = await carveSechemYears();
	}

	// Prevents carving sechem years more than once
	cachedSechemYearsData = sechemYears;

	return sechemYears ?? null;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// SCHAMIM THRESHOLDS /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// Initiates an HTTP request that extracts Google Sheet's SCHAMIM Thresholds content
async function carveSechemThresholds() {
	try {
		// HTTP Request & Response
		const response = await fetch(thresholdsSheetUrl);
		const data = await response.json();

		if (data.values) {
			// Extracts data in an organized JSON format
			return extractThresholds(data.values);
		} else {
			// No data found - error
			throw ErrorEvent;
		}
	} catch (error) {
		// An error occurred
		console.log(error);
	}
}

// Gets raw rows of SCHAMIM Thresholds, then with some manipulations returns an organized Dictionary of them
function extractThresholds(rows) {
	// Each row represents a year
	const yearlyTables = [];
	let filteredRow = [];
	rows.forEach((row) => {
		filteredRow = filterSheetRow(row);
		if (!isEmpty(filteredRow)) {
			let currentYearTable = extractCurrentYearTable(row);
			yearlyTables.push(currentYearTable);
		}
	});
	return yearlyTables;
}

// Extracts a specific year's SCHAMIM Thresholds
function extractCurrentYearTable(rawCurrentYearRow) {
	let currentUni = HUJI; // huji -> tau -> tech -> biu -> haifa -> tzameret
	let currentYearTable = {
		...structuredClone(sheetYearlyDictTemplate),
		YEAR: parseFloat(rawCurrentYearRow[techYearColIndex]),
	};

	// Every year's SCHAMIM Thresholds are represented by the 4 following columns (therefore i+=4 as well as slice definitions)
	let filteredCurrentUniTable = [];
	for (let i = firstCol; i < iterByUniNum; i += uniCellNum) {
		let beginSlice = i;
		let endSlice = i + uniCellNum;
		let currentUniTable = sliceSheetRow(
			beginSlice,
			endSlice,
			rawCurrentYearRow
		); // Sliced Current University
		filteredCurrentUniTable = filterSheetRow(currentUniTable);
		if (!isEmpty(filteredCurrentUniTable)) {
			currentYearTable = updateCurrentYearTable(
				currentUni,
				filteredCurrentUniTable,
				currentYearTable
			);
		}

		// Switches to the next university (huji -> tau -> tech -> biu -> haifa -> tzameret)
		currentUni = switchCurrentUni(currentUni);
	}

	return currentYearTable;
}

// Gets a row and filters off unnecessary cells.
function filterSheetRow(row) {
	return row.filter(
		(cell) => cell && (cell == noDataSheetCell || !isNaN(cell))
	);
}

// Gets a row and slices it as demanded.
function sliceSheetRow(beginSlice, endSlice, row) {
	return row.slice(beginSlice, endSlice); // Take only the first 4 columns
}

// Switches to the next university (huji -> tau -> tech -> biu -> haifa -> tzameret)
function switchCurrentUni(currentUni) {
	if (currentUni == HUJI) {
		return TAU;
	}
	if (currentUni == TAU) {
		return TECH;
	}
	if (currentUni == TECH) {
		return BIU;
	}
	if (currentUni == BIU) {
		return HAIFA;
	} else {
		return TZAMERET;
	}
}

// Updates currentYearTable with currentUniversity new data
function updateCurrentYearTable(currentUni, currentUniTabel, currentYearTable) {
	// Gets the requests first & final sechem
	const firstSechem =
		parseFloat(currentUniTabel[1]) || currentUniTabel[1] || null;
	const initialFinalSechem =
		parseFloat(currentUniTabel[2]) || currentUniTabel[2] || null;
	const finalFinalSechem =
		parseFloat(currentUniTabel[3]) || currentUniTabel[3] || null;

	// Checks if there are valid values in the sechem variables. If so, updates currentYearTable
	// FIRST Sechem Threshold
	if (firstSechem == noDataSheetCell || !isNaN(firstSechem)) {
		currentYearTable.data[currentUni].FIRST = firstSechem;
	}
	// FINAL Sechem Threshold
	const hasInitialFinal =
		initialFinalSechem === noDataSheetCell || !isNaN(initialFinalSechem);
	const hasFinalFinal =
		finalFinalSechem === noDataSheetCell || !isNaN(finalFinalSechem);
	if (hasInitialFinal || hasFinalFinal) {
		currentYearTable.data[currentUni].FINAL = {
			initial: hasInitialFinal ? initialFinalSechem : null,
			final: hasFinalFinal ? finalFinalSechem : null,
		};
	}

	return currentYearTable;
}

// Extracts the requested google sheet value (sechem thresholds)
let sechemThresholds = {};
let cachedThresholdsData = null;
const getUniSechemThreshold = async function (dataType, data = null) {
	// Checks if there is already some data carved from Google Sheet
	if (!cachedThresholdsData) {
		sechemThresholds = await carveSechemThresholds();
	}

	// Prevents carving sechem thresholds more than once
	cachedThresholdsData = sechemThresholds;

	// Extracts the requested google sheet value:
	// yearOption => year,
	// uniThresholdOption => sechemThreshold,
	// thresholdsOption => cachedThresholdsData
	switch (dataType) {
		case yearOption:
			return sechemThresholds[0].YEAR;
		case uniThresholdOption:
			let [university, sechemType] = data.split(hyphenSlicer);
			const uniData = sechemThresholds[0].data[university];
			if (isFinal(sechemType)) {
				// FinalSechem scope
				const finalObj = uniData?.FINAL;
				if (typeof finalObj === objectDataType && finalObj !== null) {
					return finalObj.final ?? finalObj.initial ?? null;
				}
				return null; // fallback if structure is broken
			}
			// FirstSechem scope
			return uniData?.FIRST;
		case thresholdsOption:
			return cachedThresholdsData;
	}
};

export default getUniSechemThreshold;
