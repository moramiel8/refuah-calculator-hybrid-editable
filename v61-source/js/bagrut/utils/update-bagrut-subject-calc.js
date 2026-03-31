// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Update Bagrut Subject Calculator \\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	NONE,
	bagrutSubjectCalcH2ID,
	bagrutSubjectInputsContainerID,
	bagrutSubjectsExtraInfoID,
	bagrutSubjectsID,
} from "../../configs/html-config.js";
import {
	getSelectedOption,
	isDefaultOpt,
} from "../../utils/general-methods.js";
import {
	changeSelectOptions,
	toggleVisibility,
	updateCalcSectionH2,
} from "../../utils/handle-visual-changes.js";
import updateSubjectFinalGrade from "./bagrut-subject-calc.js";
import {
	getAllSubjectsConfig,
	getSubjectConfig,
	getSubjectVariantConfig,
	getSubjectVariantOptions,
} from "./config-wrappers.js";
import generateBagrutCalcFields from "./create-bagrut-subject-calc.js";
import { displayBagrutFinalGradeDefault } from "./update-bagrut-results.js";

// Updates form when switching from one bagrut subject to another
const bagrutSubjectSelector = (document.getElementById(
	bagrutSubjectsID
).onchange = function () {
	// Gets the selected bagrut calculator
	const subject = this.value;

	if (subject && !isDefaultOpt(subject)) {
		// Changes the bagrutSubjectsExtraInfoID Select Elemenet Options, according to the selected subject
		const options = getSubjectVariantOptions(subject);
		changeSelectOptions(bagrutSubjectsExtraInfoID, options);

		// Gets the first bagrut variant (regular/religious/units or default if only one)
		const selectedVariant = getSelectedOption(bagrutSubjectsExtraInfoID);
		const variant = selectedVariant || (options[0]?.value ?? null);

		// Generates input fields based on the provided configuration
		const subjVariantConfig = getSubjectVariantConfig(subject, variant);
		if (subjVariantConfig) {
			generateBagrutCalcFields(subjVariantConfig);
		}

		// Unified function that updates a subject final grade display
		updateSubjectFinalGrade();
	} else {
		// Handles a case when bagrut subject default calculator is selected
		handleBagrutCalcDefault();
	}

	// Updates the Calc-Section H2 with the selected subject
	updateBagrutCalcH2();
});

// Updates form when switching from one extendedBagrutInfo to another (stateEducation type or unitsNum)
document.getElementById(bagrutSubjectsExtraInfoID).onchange = function () {
	// Gets the current selected subjects and extendedBagrutInfo
	const subject = getSelectedOption(bagrutSubjectsID);
	const variant = this.value;

	// Generates InputFields according to the selected option config & updates results accordingly
	const subjConfig = getSubjectVariantConfig(subject, variant);
	if (subject && subjConfig) {
		generateBagrutCalcFields(subjConfig);
		updateSubjectFinalGrade();
	}
};

// Updates bagrut subject form's calculation section's title according to the selected subject & education type
function updateBagrutCalcH2() {
	// Extracts the relevant configs
	const selectedSubject = getSelectedOption(bagrutSubjectsID);
	const fullConfig = getAllSubjectsConfig();
	const subjConfig = getSubjectConfig(selectedSubject);

	// Updates the relevant H2 title
	updateCalcSectionH2(bagrutSubjectCalcH2ID, fullConfig, subjConfig);
}

// Handles a case when bagrut subject default calculator is selected
const handleBagrutCalcDefault = function () {
	// Clears subjectInputsContainer
	document.getElementById(bagrutSubjectInputsContainerID).innerHTML = "";

	// Hides and resets bagrutExtraInfo selectElement
	document.getElementById(bagrutSubjectsExtraInfoID).innerHTML = "";
	toggleVisibility(bagrutSubjectsExtraInfoID, NONE);

	// Updates resultsDiv to default
	displayBagrutFinalGradeDefault();
};

export default bagrutSubjectSelector;
