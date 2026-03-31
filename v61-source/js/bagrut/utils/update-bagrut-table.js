// ~~~~~~~~~~~~~~~~~~~ \\
// Update Bagrut Table \\
// ~~~~~~~~~~~~~~~~~~~ \\

import { fiveUnits, noBonus } from "../bagrut-config.js";
import updateAvg from "./bagrut-avg-calc.js";
import bagrutTableBody, {
	createBagrutRow,
	populateBagrutTable,
} from "./create-bagrut-table.js";
import { isMobile, adjustTableForMobile } from "./handle-mobile-rotation.js";
import {
	getSelectedOption,
	isDefaultOpt,
	normalizeDefaultOptID,
	updateImage,
	updateReferenceURL,
} from "../../utils/general-methods.js";
import { defaultImg } from "../../utils/general-config.js";
import addPopupDialogsEventListeners from "../../utils/handle-popup-dialog.js";
import {
	changeSelectOptions,
	toggleVisibility,
	updateCalcSectionH2,
} from "../../utils/handle-visual-changes.js";
import { detectPlatform } from "../../utils/install-app.js";
import { displayBagrutNoEducation } from "./update-bagrut-results.js";
import {
	bagrutAvgEventLabel,
	bagrutAvgEventName,
	bagrutRefEventLabel,
	bagrutRefEventName,
	eventKey,
} from "../../configs/google-analytics-config.js";
import {
	BagrutTableHeadID,
	addRowButtonID,
	bagrutAvgCalcH2ID,
	bagrutEducationsSelectID,
	bagrutInstallCloseBtnID,
	bagrutInstallDialogBtnID,
	bagrutInstallDialogID,
	bagrutInstallDialogTextID,
	bagrutInstallDialogTitleID,
	bagrutLogoImageID,
	bagrutPopupCloseBtnID,
	bagrutPopupDialogBtnID,
	bagrutPopupDialogID,
	bagrutPopupDialogTextID,
	bagrutPopupDialogTitleID,
	bagrutRefID,
	bagrutUniversitiesExtraInfoID,
	defaultColor,
	clickEvent,
	NONE,
	displayBlock,
} from "../../configs/html-config.js";
import {
	getEducationBagrutConfig,
	getUniversityBagrutConfig,
	getUniversitySelectOptions,
} from "./config-wrappers.js";
import setBagrutResultsDivColor from "./handle-bagrut-visual-changes.js";
import { installDialogTexts } from "../../configs/mobile-handling-config.js";

// Updates form when switching from one bagrut subject to another
const bagrutEducationsSelector = (document.getElementById(
	bagrutEducationsSelectID
).onchange = function () {
	// Gets the selected bagrut calculator
	const education = this.value;

	if (education && !isDefaultOpt(education)) {
		// Changes the bagrutUniversitiesExtraInfoID Select Elemenet Options, according to the selected education
		const options = getUniversitySelectOptions(education);
		changeSelectOptions(bagrutUniversitiesExtraInfoID, options);

		// Builds bagrutTable according to the selected eduction type
		populateBagrutTable(education);
	} else {
		// Handles a case when bagrut subject default calculator is selected
		handleBagrutCalcDefault();
	}
});

// Handles a case when bagrut subject default calculator is selected
const handleBagrutCalcDefault = function () {
	// Hides and resets relevant elements
	document.getElementById(bagrutUniversitiesExtraInfoID).innerHTML = "";
	toggleVisibility(bagrutUniversitiesExtraInfoID, NONE);
	toggleVisibility(BagrutTableHeadID, NONE);
	toggleVisibility(addRowButtonID, NONE);
	updateBagrutVisualChanges(defaultImg.cloneNode(), "", NONE);
	bagrutTableBody.innerHTML = "";

	// Updates resultsDiv to default
	setBagrutResultsDivColor(defaultColor);
	displayBagrutNoEducation();
};

// Updates university logo when switching from one university to another
const bagrutUniSelector = (document.getElementById(
	bagrutUniversitiesExtraInfoID
).onchange = function () {
	// Gets the selected education & university IDs and extracts the relevant config
	let universityID = normalizeDefaultOptID(this.value);
	const educationID = getSelectedOption(bagrutEducationsSelectID);
	const uniConfig = getUniversityBagrutConfig(educationID, universityID);

	// If uniConfig exists, updates relevant visualChanges
	if (uniConfig) {
		toggleVisibility(BagrutTableHeadID, "");
		toggleVisibility(addRowButtonID, "");
		updateBagrutVisualChanges(
			uniConfig.logoImage,
			uniConfig.ref.url,
			uniConfig.ref.display ? displayBlock : NONE
		);
	}

	// On CHANGE EVENT of select-universities element, updates the bagrut-average accordingly
	let avg = updateAvg();

	// Logs bagrut average calculation on university change
	gtag(eventKey, bagrutAvgEventName, {
		event_category: universityID.toUpperCase(),
		event_label: bagrutAvgEventLabel.format(
			educationID.toUpperCase(),
			universityID.toUpperCase(),
			avg
		),
	});
});

// Gets a new UniversityImage.
// Gets new bagrut reference URL & Display values.
// Updates everything accordingly.
const updateBagrutVisualChanges = function (newImg, ref, refDisplay) {
	updateImage(bagrutLogoImageID, newImg);
	updateReferenceURL(bagrutRefID, ref, refDisplay);

	// Updates the relevant H2 title
	updateBagrutCalcH2();
};

// Updates bagrut average form's calculation section's title according to the selected university & education type
function updateBagrutCalcH2() {
	// Extracts the relevant configs
	const educationID = getSelectedOption(bagrutEducationsSelectID);
	const universityID = getSelectedOption(bagrutUniversitiesExtraInfoID);
	const educationConfig = getEducationBagrutConfig(educationID);
	const uniConfig = getUniversityBagrutConfig(educationID, universityID);

	// Updates the relevant H2 title
	updateCalcSectionH2(bagrutAvgCalcH2ID, educationConfig, uniConfig);
}

// Sets bagrut-table-row's style based on whether it was calcaulated in average or not
HTMLTableRowElement.prototype.setRowStyle = function (
	fontWeight,
	backgroundColor
) {
	this.style.fontWeight = fontWeight; // Bolds\Unbolds Rows's Text
	this.style.backgroundColor = backgroundColor; // Row's Background Color
};

// Adds a CLICK event-listener to the add-row-button button
document.getElementById(addRowButtonID).addEventListener(clickEvent, () => {
	// Creates a new bagrut-table-row
	const newRow = createBagrutRow("", fiveUnits, noBonus, true);
	bagrutTableBody.appendChild(newRow);

	// Fixes a strange bug in mobiles, in which strange borders seem to appear between table rows,
	// that appear/disappear while zooming
	if (isMobile()) {
		adjustTableForMobile();
	}
});

// Returns the selected education+uni's dialog config
const resolveBagrutDialog = (
	_channel = null,
	uniID = null,
	educationID = null
) => {
	// Extracts the selected uni config
	const uniConfig = getUniversityBagrutConfig(educationID, uniID);

	// Returns null if uni is falsy
	if (!uniConfig) return null;

	// Otherwise, returns the university's dialog
	return uniConfig.dialog;
};

// Passes bagrutDialog relevent IDs, and attaches eventListeners to trigger appearance of the appropriate popup messages
addPopupDialogsEventListeners(
	bagrutUniversitiesExtraInfoID,
	bagrutPopupDialogBtnID,
	bagrutPopupDialogID,
	bagrutPopupCloseBtnID,
	bagrutPopupDialogTitleID,
	bagrutPopupDialogTextID,
	resolveBagrutDialog,
	bagrutEducationsSelectID
);

// Passes bagrutInstallDialog relevent IDs, and attaches eventListeners to trigger appearance of the appropriate popup messages
addPopupDialogsEventListeners(
	null,
	bagrutInstallDialogBtnID,
	bagrutInstallDialogID,
	bagrutInstallCloseBtnID,
	bagrutInstallDialogTitleID,
	bagrutInstallDialogTextID,
	() => installDialogTexts[detectPlatform()]
);

// Logs reference element click event
document.getElementById(bagrutRefID).addEventListener(clickEvent, function () {
	gtag(eventKey, bagrutRefEventName, {
		event_category: this.href,
		event_label: bagrutRefEventLabel.format(this.href),
	});
});

export default bagrutUniSelector;
