// ~~~~~~~~~~~~~~~ \\
// General Methods \\
// ~~~~~~~~~~~~~~~ \\

import {
	imgSelectorQuery,
	maxProp,
	minProp,
	textInputType,
} from "../configs/html-config.js";
import {
	allowedKeys,
	ctrlShortcuts,
	decimalSeperator,
	defaultOpt,
} from "./general-config.js";

// Gets the SELECT-ELEMENT-ID and returns the selected value
export const getSelectedOption = function (selectElementId) {
	return document.getElementById(selectElementId).value;
};

// Updates Image Element
export const updateImage = function (imgContainerElementId, newImg) {
	const container = document.getElementById(imgContainerElementId);
	const oldImg = container.querySelector(imgSelectorQuery);
	if (oldImg) {
		container.replaceChild(newImg, oldImg);
	} else {
		container.appendChild(newImg);
	}
};

// Updates University's Reference URL Element
export const updateReferenceURL = function (refElementId, reference, display) {
	let refElement = document.getElementById(refElementId);
	refElement.href = reference;
	refElement.style.display = display;
};

// Gets the RESULTS-DIV-ID and displays the results
export const displayResults = function (
	resultsElementId,
	results,
	innerHTML = false
) {
	if (innerHTML) {
		document.getElementById(resultsElementId).innerHTML = results;
	} else {
		document.getElementById(resultsElementId).innerText = results;
	}
};

// Creates a format function for String variables (using on string constants)
String.prototype.format = function () {
	var args = arguments;
	return this.replace(/{([0-9]+)}/g, function (match, index) {
		return typeof args[index] == "undefined" ? match : args[index];
	});
};

// This function is assigned to a KEDOWN EVENT
// It ensures no key can be pressed out of the allowed ones
export const handleInputKeydown = function (e, allowDecimal = false) {
	// Checks if the pressed key is included in the allowedKeys arrays or if it is a decimal point (if allowDecimal === True)
	if (
		allowedKeys.includes(e.key) ||
		(ctrlShortcuts.includes(e.code) && e.ctrlKey) ||
		/^[0-9]$/.test(e.key) ||
		(allowDecimal && e.key === decimalSeperator)
	) {
		return; // Allows these keys
	}
	e.preventDefault(); // Prevents any other keys
};

// Gets a numeric/text Input Element.
// This function is assigned to an INPUT EVENT
// It ensures no value can be written out of the given ragne, with exception for decimal point (if allowDecimal === True)
export const handleInputMinAndMax = function (
	inputElement,
	allowDecimal = false
) {
	// Gets min & max values
	const minVal = parseFloat(inputElement.getAttribute(minProp));
	const maxVal = parseFloat(inputElement.getAttribute(maxProp));

	// Gets current cursor position (fallback to end of input if null)
	const selectionStart =
		inputElement.selectionStart || inputElement.value.length;
	const selectionEnd = inputElement.selectionEnd || inputElement.value.length;

	// Processes value
	let value = inputElement.value;

	// Allows only valid characters
	if (allowDecimal) {
		value = value.replace(/[^0-9.]/g, "");
	} else {
		value = value.replace(/\D/g, "");
	}

	// Ensures there is only one decimal point
	if (allowDecimal) {
		const parts = value.split(decimalSeperator);
		if (parts.length > 2) {
			value = parts[0] + decimalSeperator + parts.slice(1).join("");
		}
	}

	// Updates input value
	inputElement.value = value;

	// Parses the value
	let numericValue = allowDecimal ? parseFloat(value) : parseInt(value, 10);

	// Handles range constraints
	if (isNaN(numericValue)) {
		inputElement.value = "";
	} else if (numericValue < minVal) {
		inputElement.value = minVal;
	} else if (numericValue > maxVal) {
		inputElement.value = maxVal;
	}

	// Restores cursor position (only if the input is focused and its type is "text")
	if (
		document.activeElement === inputElement &&
		inputElement.type === textInputType
	) {
		const newValueLength = inputElement.value.length;
		const cursorPosition = Math.min(selectionStart, newValueLength);
		inputElement.setSelectionRange(cursorPosition, cursorPosition);
	}
};

// Round function for decimal numbers (the built-in round() function is intended for Integers)
export const roundDigits = function (num, digits) {
	// Shouldn't be executed without the digits variable but just in case ;)
	if (digits === undefined) {
		digits = 0;
	}

	// Shouldn't be executed on negative num but just in case ;)
	let negative = false;
	if (num < 0) {
		negative = true;
		num = num * -1;
	}

	// Mathematical manipulations.
	// For example, fixes use case of:
	// Math.round(1.005 * 100) / 100 => 1 OR 1.005.toFixed(2) => 1.00)
	let multiplicator = Math.pow(10, digits);
	num = parseFloat((num * multiplicator).toFixed(11));
	num = (Math.round(num) / multiplicator).toFixed(digits);

	// Swtiches back to a negative number
	if (negative) {
		num = (num * -1).toFixed(digits);
	}

	return parseFloat(num);
};

// Returns if an array is empty
export const isEmpty = function (arr) {
	return arr.length == 0;
};

// Dispatches an event to trigger an element's event listener
export const dispatchAnEvent = function (eventName, elementID) {
	let myElement = document.getElementById(elementID);
	let event = new Event(eventName, { bubbles: true });
	myElement.dispatchEvent(event);
};

// Returns "default" if the given ID represents any kind of a defaultChannel
export const normalizeDefaultOptID = function (id) {
	return id?.startsWith(defaultOpt) ? defaultOpt : id;
};

// Gets a selectedOption value, and returns whether its of a default-option type
export const isDefaultOpt = function (selectedOpt) {
	return normalizeDefaultOptID(selectedOpt) === defaultOpt;
};

// Returns Current Year
export const getCurrentYear = function () {
	return new Date().getFullYear();
};
