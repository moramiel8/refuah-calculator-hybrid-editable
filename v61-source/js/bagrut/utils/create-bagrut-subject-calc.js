// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Create Bagrut Subject Calculator \\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	bagrutInputFieldsTitleClass,
	bagrutSubjectInputsContainerID,
	divElement,
	h3Element,
	inputElement,
	inputEvent,
	labelElement,
	subjectDataWeight,
	subjectFieldWrapperClass,
	textInputType,
} from "../../configs/html-config.js";
import { updateInput } from "../../utils/handle-visual-changes.js";
import {
	flatCalc,
	gradeMaxVal,
	gradeMinVal,
	groupedCalc,
} from "../bagrut-config.js";
import updateFinalGrade from "./bagrut-subject-calc.js";

// Generates input fields based on the provided configuration
const generateBagrutCalcFields = function (config) {
	// Clears subjectInputsContainer
	const container = document.getElementById(bagrutSubjectInputsContainerID);
	container.innerHTML = "";

	// Creates InputFields according to the given configuration
	if (config.type === flatCalc) {
		// Flat Calc Scenario

		// Creates InputFields and Labels
		config.fields.forEach((field) => {
			const wrapper = createBagrutSubjectField(field);
			container.appendChild(wrapper);
		});
	} else if (config.type === groupedCalc) {
		// Grouped Calc Scenario (בסיס/הרחבה)
		config.groups.forEach((group) => {
			// Creates current group's heading
			const groupHeading = document.createElement(h3Element);
			groupHeading.className = bagrutInputFieldsTitleClass;
			groupHeading.textContent = group.groupLabel;
			container.appendChild(groupHeading);

			// Creates InputFields and Labels
			group.fields.forEach((field) => {
				const wrapper = createBagrutSubjectField(field);
				container.appendChild(wrapper);
			});
		});
	}
};

// Creates Bagrut Subject Calculator InputFields and Labels
const createBagrutSubjectField = function (field) {
	// Creates a fieldWrapper element
	const wrapper = document.createElement(divElement);
	wrapper.className = subjectFieldWrapperClass;

	// Create a label, holding the title of the InputField
	const label = document.createElement(labelElement);
	label.textContent = field.label;
	wrapper.appendChild(label);

	// Create the actual InputField
	const input = document.createElement(inputElement);
	input.type = textInputType;
	input.id = field.id;
	input.placeholder = field.placeholder;
	input.setAttribute(subjectDataWeight, field.weight);

	// On inputEvent handles MIN, MAX & allowDecimal Values. Calculates FinalGrade accordingly
	updateInput(input, field.id, null, gradeMinVal, gradeMaxVal, false);
	input.addEventListener(inputEvent, updateFinalGrade);
	wrapper.appendChild(input);

	return wrapper;
};

export default generateBagrutCalcFields;
