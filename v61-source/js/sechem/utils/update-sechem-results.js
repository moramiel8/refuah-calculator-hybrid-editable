// ~~~~~~~~~~~~~~~~~~~~~ \\
// Update Sechem Results \\
// ~~~~~~~~~~~~~~~~~~~~~ \\

import getUniSechemThreshold from "./handle-google-sheet.js";
import { displayResults } from "../../utils/general-methods.js";
import {
	chooseAcLog,
	chooseConvCalcLog,
	chooseDegreeLog,
	chooseFAcLog,
	chooseIshiutiCalcLog,
	choosePrepLog,
	chooseUniLog,
	convertedPsychoLog,
	defaultLog,
	fillAllInputs,
	happyLog,
	happyLogWithoutSechem,
	httpTimeoutErrorLog,
	improveEverythingLog,
	invalidBagrutYearLog,
	invalidInputs,
	ishiutiGradeLog,
	noFormulaLog,
	noThresholdYet,
	requiredGradeLog,
	sadLog,
	sechemUnexpectedHttpError,
	tooLowActEng,
	tooLowActMath,
	tooLowBagrut,
	tooLowDegreeAvg,
	tooLowIshiuti,
	tooLowPrep,
	tooLowPsycho,
	waitWhileCalcLog,
} from "../../configs/results-strs-config.js";
import { yearOption } from "../../configs/google-sheet-config.js";
import { gradesTypeTranslator } from "../sechem-config.js";
import { sechemResultsID } from "../../configs/html-config.js";

// Current Year
var currentYear = await getUniSechemThreshold(yearOption);

// When not all the inputs are filled, displays "Fill-All-Inputs-Log"
export const displayFillAllInputs = function () {
	displayResults(sechemResultsID, fillAllInputs);
};

// When at least one of the given grades is invalid, displays "Invalid-Inputs-Log"
export const displayInvalidInputs = function () {
	displayResults(sechemResultsID, invalidInputs);
};

// When bagrut is too low, displays "Too-Low-Bagrut-Log"
export const displayTooLowBagrut = function () {
	displayResults(sechemResultsID, tooLowBagrut);
};

// When preparatory average is too low, displays "Too-Low-prep-Log"
export const displayTooLowPrep = function () {
	displayResults(sechemResultsID, tooLowPrep);
};

// When degree average is too low, displays "Too-Low-DegreeAvg-Log"
export const displayTooLowDegree = function () {
	displayResults(sechemResultsID, tooLowDegreeAvg);
};

// When ACT English grade is too low, displays "Too-Low-actEngGrade-Log"
export const displayTooLowActEnglish = function () {
	displayResults(sechemResultsID, tooLowActEng);
};

// When ACT Math grade is too low, displays "Too-Low-actMathGrade-Log"
export const displayTooLowActMath = function () {
	displayResults(sechemResultsID, tooLowActMath);
};

// When psycho grade is too low, displays "Too-Low-Psycho-Log"
export const displayTooLowPsycho = function () {
	displayResults(sechemResultsID, tooLowPsycho);
};

// When ishiuti grade is too low, displays "Too-Low-Ishiuti-Log"
export const displayTooLowIshiuti = function () {
	displayResults(sechemResultsID, tooLowIshiuti);
};

// When there is no defined threshold for current year, displays "No-Trehsold-Log"
export const displayNoThresholdYet = function (sechem) {
	displayResults(sechemResultsID, noThresholdYet.format(sechem), true);
};

// When sechem is above threshold, displays "Happy-Log"
export const displayHappyLog = function (sechem) {
	displayResults(sechemResultsID, happyLog.format(sechem, currentYear), true);
};

// When it is a no-sechem university and grades are good, displays "Happy-Log"
export const displayHappyLogWithoutSechem = function () {
	displayResults(sechemResultsID, happyLogWithoutSechem.format(currentYear));
};

// When sechem is too low, displays "Sad-Log"
export const displaySadLog = function (sechem, requiredGrades) {
	let finalSadLog = formatRequiredGrades(
		sadLog.format(sechem, currentYear),
		requiredGrades
	);

	displayResults(sechemResultsID, finalSadLog, true);
};

// Formats information regarding required grades to pass current sechem threshold
const formatRequiredGrades = function (initialSadLog, requiredGrades) {
	let noRequiredGrades = true;
	for (let gradeName of Object.keys(requiredGrades)) {
		if (requiredGrades[gradeName]) {
			initialSadLog += requiredGradeLog.format(
				gradesTypeTranslator[gradeName],
				requiredGrades[gradeName]
			);
			noRequiredGrades = false;
		}
	}

	// Checks if there are no optional grades that make it possible to pass the threshold. If so, displays improveEverythingLog.
	if (noRequiredGrades) {
		initialSadLog += improveEverythingLog;
	}

	return initialSadLog;
};

// // Displays default results (0)
export const displayDefaultLog = function () {
	displayResults(sechemResultsID, defaultLog);
};

// Clears sechem results
export const displayNoResults = function () {
	displayResults(sechemResultsID, "");
};

// When no conversion calculator is selected, displays chooseConvCalcLog
export const displayChooseConvCalcLog = function () {
	displayResults(sechemResultsID, chooseConvCalcLog);
};

// When no ishiuti grade calculator is selected, displays chooseIshiutiCalcLog
export const displayChooseIshiutiCalcLog = function () {
	displayResults(sechemResultsID, chooseIshiutiCalcLog);
};

// When no admission channel is selected, displays chooseAcLog
export const displayChooseAcLog = function () {
	displayResults(sechemResultsID, chooseAcLog);
};

// When no final admission channel is selected, displays chooseFAcLog
export const displayChooseFAcLog = function () {
	displayResults(sechemResultsID, chooseFAcLog);
};

// When no university is selected, displays chooseUniLog
export const displayChooseUniLog = function () {
	displayResults(sechemResultsID, chooseUniLog);
};

// When no prep admission subchannel is selected, displays choosePrepLog
export const displayChoosePrepLog = function () {
	displayResults(sechemResultsID, choosePrepLog);
};

// When no PD/FD admission subchannel is selected, displays chooseDegreeLog
export const displayChooseDegreeLog = function () {
	displayResults(sechemResultsID, chooseDegreeLog);
};

// When a sechemType with no formula support is selected, displays noFormulaLog
export const displayNoFormulaLog = function () {
	displayResults(sechemResultsID, noFormulaLog);
};

// When facing an HTTP TIMEOUT ERROR while trying to fetch values using API, displays an httpTimeoutErrorLog
export const displayHttpTimeoutErrorLog = function () {
	displayResults(sechemResultsID, httpTimeoutErrorLog);
};

// When facing an UNEXPECTED HTTP ERROR while trying to fetch values using API, displays an sechemUnexpectedHttpError
export const displayUnexpectedHttpErrorLog = function () {
	displayResults(sechemResultsID, sechemUnexpectedHttpError, true);
};

// When calculating required grades to pass SECHEM threshold, displays temporarily waitWhileCalcLog
export const displayWaitWhileCalcLog = function () {
	displayResults(sechemResultsID, waitWhileCalcLog);
};

// Displays the converted convertedPsychoLog
export const displayConvertedPsychoLog = function (convPsycho) {
	displayResults(
		sechemResultsID,
		convertedPsychoLog.format(convPsycho),
		true
	);
};

// Displays the calculated ishiutiGradeLog
export const displayIshiutiGradeLog = function (ishiutiGrade) {
	displayResults(sechemResultsID, ishiutiGradeLog.format(ishiutiGrade), true);
};

// Displays an invalidBagrutYearLog log
export const displayInvalidBagrutYearLog = function () {
	displayResults(sechemResultsID, invalidBagrutYearLog);
};
