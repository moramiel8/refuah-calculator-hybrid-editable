// ~~~~~~~~~~~~~~~~~~~ \\
// Google Sheet Config \\
// ~~~~~~~~~~~~~~~~~~~ \\

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// SCHAMIM YEARS VALIDITY /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

const yearsSheetId = "1fK_gzPHJcwVGvrV-_T89UHVDYFysP-403-uUac_oUq0"; // Google Sheet ID
const yearsSheetApiKey = "AIzaSyC-4w3esBd3WrUWG3PCwxmaaO-2qrsaIEk"; // Google API key
const yearsSheetRange = "%D7%A8%D7%90%D7%A9%D7%99"; // Range to check
export const yearsSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${yearsSheetId}/values/${yearsSheetRange}?key=${yearsSheetApiKey}`;

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// SCHAMIM THRESHOLDS /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// Google Sheet Constants
const thresholdsSheetId = "1xfx0e4HlG92-7cuKgm0iOmhsdOF3hxoM0J0A-Q0nEH4"; // Google Sheet ID
const thresholdsSheetApiKey = "AIzaSyC-4w3esBd3WrUWG3PCwxmaaO-2qrsaIEk"; // Google API key
const thresholdsSheetRange =
	"%D7%A1%D7%9B%D7%9E%D7%99%D7%9D%20-%20%D7%A8%D7%90%D7%A9%D7%95%D7%A0%D7%99%2F%D7%A1%D7%95%D7%A4%D7%99%20%D7%91%D7%9C%D7%91%D7%93"; // Range to check
export const thresholdsSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${thresholdsSheetId}/values/${thresholdsSheetRange}?key=${thresholdsSheetApiKey}`;
export const noDataSheetCell = "-";
export const sheetYearlyDictTemplate = {
	YEAR: "",
	data: {
		HUJI: { FIRST: "", FINAL: { initial: "", final: "" } },
		TAU: { FIRST: "", FINAL: { initial: "", final: "" } },
		TECH: { FIRST: "", FINAL: { initial: "", final: "" } },
		BIU: { FINAL: { initial: "", final: "" } },
		HAIFA: { FIRST: "", FINAL: { initial: "", final: "" } },
		TZAMERET: { FIRST: "", FINAL: { initial: "", final: "" } },
	},
};
export const yearOption = "Year";
export const uniThresholdOption = "Uni-Threshold";
export const thresholdsOption = "Thresholds";

// Sheet Iterations Constants
const uniNum = 6; // (HUJI, TAU, TECH, BIU, HAIFA, TZAMERET)
export const uniCellNum = 4;
export const iterByUniNum = uniNum * uniCellNum - 1;
export const firstCol = 0;
export const techYearColIndex = 8; // As TECH has the longest year column
