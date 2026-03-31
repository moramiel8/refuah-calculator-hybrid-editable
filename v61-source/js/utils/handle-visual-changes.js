// ~~~~~~~~~~~~~~~~~~~~~ \\
// Handle Visual Changes \\
// ~~~~~~~~~~~~~~~~~~~~~ \\

import {
	dispatchAnEvent,
	handleInputKeydown,
	handleInputMinAndMax,
} from "./general-methods.js";
import {
	NONE,
	changeEvent,
	displayInlineBlock,
	inputEvent,
	keyDownEvent,
	nameAttirbute,
	optionElement,
} from "../configs/html-config.js";

// Toggles an element's visibility on/off
export const toggleVisibility = function (elementID, elementDisplay) {
	let myElement = document.getElementById(elementID);
	myElement.style.display = elementDisplay;
};

// Updates an Input Element NAME, display, MIN, MAX and allowDecimal values.
export const updateInput = function (
	inputID,
	inputName,
	inputDisplay,
	minVal,
	maxVal,
	allowDecimal
) {
	// In some cases inputID is the inputID, but in others it may be that inputElement itself
	let inputElement = document.getElementById(inputID)
		? document.getElementById(inputID)
		: inputID;

	// Updates inputElement's NAME value
	inputElement.setAttribute(nameAttirbute, inputName);

	// Toggles the inputElement on/off - relevant only in cases when the inputID is actually the inputID
	document.getElementById(inputID)
		? toggleVisibility(inputID, inputDisplay)
		: null;

	// Updates inputElement's MIN & MAX values
	inputElement.min = minVal;
	inputElement.max = maxVal;

	// Stores references for proper add/remove
	if (!inputElement.boundInputEventListener) {
		inputElement.boundInputEventListener = function (e) {
			handleInputMinAndMax(inputElement, allowDecimal);
		};
		inputElement.boundKeydownListener = function (e) {
			handleInputKeydown(e, allowDecimal);
		};

		inputElement.addEventListener(
			inputEvent,
			inputElement.boundInputEventListener
		);
		inputElement.addEventListener(
			keyDownEvent,
			inputElement.boundKeydownListener
		);
	} else {
		// Remove existing listeners and rebind
		inputElement.removeEventListener(
			inputEvent,
			inputElement.boundInputEventListener
		);
		inputElement.removeEventListener(
			keyDownEvent,
			inputElement.boundKeydownListener
		);

		inputElement.boundInputEventListener = function (e) {
			handleInputMinAndMax(inputElement, allowDecimal);
		};
		inputElement.boundKeydownListener = function (e) {
			handleInputKeydown(e, allowDecimal);
		};

		inputElement.addEventListener(
			inputEvent,
			inputElement.boundInputEventListener
		);
		inputElement.addEventListener(
			keyDownEvent,
			inputElement.boundKeydownListener
		);
	}
};

// Updates a Label Element text content & Display values.
export const updateLabel = function (labelID, labelText, labelDisplay) {
	let labelElement = document.getElementById(labelID);
	labelElement.textContent = labelText;
	toggleVisibility(labelID, labelDisplay);
};

// Gets a new Options Array and updates the Select Element accordingly
export const changeSelectOptions = function (selectID, optionsArray) {
	// Clears the current options
	const selectElement = document.getElementById(selectID);
	selectElement.innerHTML = "";

	// Adds the new options
	optionsArray.forEach(function (option) {
		const newOption = document.createElement(optionElement);
		newOption.value = option.value;
		newOption.textContent = option.text;

		// Sets the option as selected if specified
		if (option.selected) {
			newOption.selected = true;
		}

		selectElement.appendChild(newOption);
	});

	// This section is relevant only in cases the variantSelect exists
	// Shows the variant select if there is more than one option.
	selectElement.style.display =
		selectElement.length > 1 ? displayInlineBlock : NONE;
	// Auto-selects the variant if only one exists.
	if (selectElement.length === 1) {
		selectElement.value = optionsArray[0];
	}

	// Dispatches the CHANGE event to trigger the event listener
	dispatchAnEvent(changeEvent, selectID);
};

// Updates the Calc-Section H2 with the given title
export const updateCalcSectionH2 = function (h2ID, config, subConfig) {
	// if mainConfig does not exist, resets title
	if (!config) {
		document.getElementById(h2ID).textContent = "";
		return;
	}

	// Rertieves titleBase from the mainConfig
	let title = config.titleBase;

	// Only appends university string if it's not a defaultChannel (nameKey is not empty)
	if (subConfig?.name) {
		title += ` - ${subConfig.name}`; // Sechem/Bagrut Avg Title
	} else if (subConfig?.text) {
		title += subConfig.text; // Bagrut Subject Final Grade Title
	}
	// Updates the H2 element with the new title
	document.getElementById(h2ID).textContent = title;
};
