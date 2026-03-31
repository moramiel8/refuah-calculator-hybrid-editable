// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Handle Bagrut Visual Changes \\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	NONE,
	bagrutAvgCalcSectionID,
	bagrutCalcTypeSelectID,
	bagrutDefaultCalcSectionID,
	bagrutEducationsSelectID,
	bagrutFormID,
	bagrutLogoImageID,
	bagrutPopupDialogBtnID,
	bagrutResultsID,
	bagrutSubjectCalcSectionID,
	bagrutSubjectsExtraInfoID,
	bagrutSubjectsID,
	bagrutUniversitiesExtraInfoID,
	blueTheme,
	changeEvent,
	defaultColor,
	displayBlock,
	yellowTheme,
} from "../../configs/html-config.js";
import {
	changeFormColors,
	switchForm,
} from "../../utils/frame-switch-handler.js";
import { defaultImg } from "../../utils/general-config.js";
import { dispatchAnEvent, updateImage } from "../../utils/general-methods.js";
import {
	changeSelectOptions,
	toggleVisibility,
} from "../../utils/handle-visual-changes.js";
import { bagrutAvgCalc, bagrutSubjectCalc } from "../bagrut-config.js";
import { displayBagrutNoCalc } from "./update-bagrut-results.js";
import {
	getAllEducationsOptions,
	getAllSubjectsOptions,
} from "./config-wrappers.js";
import bagrutUniSelector from "./update-bagrut-table.js"; // Dependency
import bagrutSubjectSelector from "./update-bagrut-subject-calc.js"; // Dependency

// Updates form when switching from one bagrut calculator (avg) to another (subject final grade)
let lastActiveSection = bagrutDefaultCalcSectionID;
const bagrutCalcSelector = (document.getElementById(
	bagrutCalcTypeSelectID
).onchange = function () {
	// Gets the selected bagrut calculator
	const selectedCalc = this.value;

	switch (selectedCalc) {
		case bagrutAvgCalc:
			// bagrut avg calc
			lastActiveSection = updateBagrutVisualChange(
				lastActiveSection,
				bagrutAvgCalcSectionID,
				blueTheme,
				bagrutEducationsSelectID,
				bagrutSubjectsID
			);
			break;
		case bagrutSubjectCalc:
			// bagrut subject final grade calc
			lastActiveSection = updateBagrutVisualChange(
				lastActiveSection,
				bagrutSubjectCalcSectionID,
				yellowTheme,
				bagrutSubjectsID,
				bagrutEducationsSelectID
			);
			break;
		default:
			// default option ("Choose Calc")
			lastActiveSection = updateBagrutVisualChange(
				lastActiveSection,
				bagrutDefaultCalcSectionID
			);
			break;
	}
});

// Updates form when switching from one bagrut calculator (avg) to another (subject final grade)
const updateBagrutVisualChange = function (
	lastSec,
	newSec,
	newTheme,
	select2display,
	select2hide
) {
	// Switches to the new bagrutForm
	switchForm(lastSec, newSec);

	// Sets the bagrutResults Div to its default color
	setBagrutResultsDivColor(defaultColor);

	// Hides unnecessary elements
	toggleVisibility(bagrutUniversitiesExtraInfoID, NONE);
	toggleVisibility(bagrutSubjectsExtraInfoID, NONE);
	toggleVisibility(bagrutPopupDialogBtnID, NONE);
	updateImage(bagrutLogoImageID, defaultImg.cloneNode());

	if (newTheme) {
		// A Bagrut Calc Option - changes color, and toggles on/off relevant selectElements
		changeFormColors(bagrutFormID, newTheme);
		toggleVisibility(select2display, displayBlock);
		toggleVisibility(select2hide, NONE);

		// Populates the relevant selectElement dynamically
		if (select2display === bagrutEducationsSelectID) {
			changeSelectOptions(
				bagrutEducationsSelectID,
				getAllEducationsOptions()
			);
		} else if (select2display === bagrutSubjectsID) {
			changeSelectOptions(bagrutSubjectsID, getAllSubjectsOptions());
		}

		// Dispatches the displayed selectElement Change event to trigger additional visual changes
		dispatchAnEvent(changeEvent, select2display);
	} else {
		// The Default No Calc Option - toggles on/off relevant selectElements and updates Img to default
		toggleVisibility(bagrutEducationsSelectID, NONE);
		toggleVisibility(bagrutSubjectsID, NONE);

		// No bagrutCalc is selected - displays a log accordingly
		displayBagrutNoCalc();
	}

	return newSec;
};

// Sets the background color of bagrut-results-div
const setBagrutResultsDivColor = function (color) {
	let resultsDiv = document.getElementById(bagrutResultsID);
	resultsDiv.style.backgroundColor = color;
};

// Dispatches the CHANGE event to trigger the event listener (mainly to trigger relevant event listeners)
dispatchAnEvent(changeEvent, bagrutCalcTypeSelectID);

export default setBagrutResultsDivColor;
