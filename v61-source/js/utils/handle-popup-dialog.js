// ~~~~~~~~~~~~~~~~~~~ \\
// Handle Popup Dialog \\
// ~~~~~~~~~~~~~~~~~~~ \\

import {
	eventKey,
	popupDialogEventLabel,
	popupDialogEventName,
} from "../configs/google-analytics-config.js";
import {
	NONE,
	changeEvent,
	clickEvent,
	displayFlex,
	DOMContentLoadedEvent,
	hiddenModeClass,
	loadingState,
	bagrutPopupDialogBtnID,
	textAlighnCenter,
	textAlignRight,
	sechemAdmissionChannelsID,
} from "../configs/html-config.js";
import { dialogTitleBase, noDialog2DisplayText } from "./general-config.js";
import { getSelectedOption } from "./general-methods.js";
import { detectPlatform } from "./install-app.js";

// Gets a dialog's relevant IDs, and attaches eventListeners to trigger appearance of the appropriate popup messages
const addPopupDialogsEventListeners = function (
	uniSelectID,
	dialogBtnID,
	dialogID,
	closeBtnID,
	dialogTitleID,
	dialogTextID,
	dialogResolverFn,
	extInfoSelect = "" // Only relevant when there's extra info regarding sechem/bagrut calc (hujiPrep, bguPrep etc...)
) {
	if (document.readyState === loadingState) {
		// DOM is still loading, attaches the event listener
		document.addEventListener(DOMContentLoadedEvent, function () {
			handleButtonVisibility(
				uniSelectID,
				dialogBtnID,
				dialogResolverFn,
				extInfoSelect
			);
			handleDialogPopup(
				uniSelectID,
				dialogBtnID,
				dialogID,
				closeBtnID,
				dialogTitleID,
				dialogTextID,
				dialogResolverFn,
				extInfoSelect
			);
		});
	} else {
		// DOM is already loaded, executes immediately
		handleButtonVisibility(
			uniSelectID,
			dialogBtnID,
			dialogResolverFn,
			extInfoSelect
		);
		handleDialogPopup(
			uniSelectID,
			dialogBtnID,
			dialogID,
			closeBtnID,
			dialogTitleID,
			dialogTextID,
			dialogResolverFn,
			extInfoSelect
		);
	}
};

// Handles dialogButtonElement visisibility status
function handleButtonVisibility(
	uniSelectID,
	dialogBtnID,
	dialogResolverFn,
	extInfoSelect = ""
) {
	// Ensures button exists
	const infoButton = document.getElementById(dialogBtnID);
	if (!infoButton || (!uniSelectID && dialogBtnID === bagrutPopupDialogBtnID))
		return;

	// Checks if button should appear (only when selectedOpt != default-uni)
	function toggleButtonVisibility() {
		// Gets dialogButton Element - returns if it does not exist
		const infoButton = document.getElementById(dialogBtnID);
		if (!infoButton) return;

		let dialogData;
		if (!uniSelectID) {
			// Platform-specific case
			const platform = detectPlatform();
			// Uses the resolver to get the dialog config
			dialogData = dialogResolverFn(platform);
		} else {
			// Channel + University (+ Subchannel) Sechem Case or Education + University Bagrut Avg Case
			// Extracts the relevant values out of the selectElements
			const selectedChannel = getSelectedOption(
				sechemAdmissionChannelsID
			);
			const selectedUni = getSelectedOption(uniSelectID);
			let selectedSubchannel = null;
			if (
				extInfoSelect &&
				document.getElementById(extInfoSelect) &&
				getComputedStyle(document.getElementById(extInfoSelect))
					.display !== NONE
			) {
				selectedSubchannel = getSelectedOption(extInfoSelect);
			}

			// Uses the resolver to get the dialog config
			dialogData = dialogResolverFn(
				selectedChannel,
				selectedUni,
				selectedSubchannel
			);
		}

		// Hides/displays the dialog according to the config
		infoButton.style.display = dialogData?.display ? displayFlex : NONE;
	}

	// Runs on page load - toggles off dialogButtonElement's visibility
	toggleButtonVisibility();

	// Listens for changes, and toggles off dialogButtonElement's visibility (only on uniSelect scope)
	if (uniSelectID) {
		document
			.getElementById(uniSelectID)
			.addEventListener(changeEvent, toggleButtonVisibility);
	}
	// Listens for changes, and toggles off dialogButtonElement's visibility (only on extInfoSelect scope)
	if (extInfoSelect) {
		document
			.getElementById(extInfoSelect)
			.addEventListener(changeEvent, toggleButtonVisibility);
	}
}

// Handles dialog popup process
function handleDialogPopup(
	uniSelectID,
	dialogBtnID,
	dialogID,
	closeBtnID,
	dialogTitleID,
	dialogTextID,
	dialogResolverFn,
	extInfoSelect
) {
	// Extracts the relevant dialog's associated elements
	const dialogButton = document.getElementById(dialogBtnID);
	const dialog = document.getElementById(dialogID);
	const closeBtn = document.getElementById(closeBtnID);
	const dialogTitle = document.getElementById(dialogTitleID);
	const dialogText = document.getElementById(dialogTextID);

	// Associates a CLICK event with the relevant dialogButton, to display the appropriate text to the user
	dialogButton.addEventListener(clickEvent, function () {
		let dialogData;
		let selectedOpt;
		if (!uniSelectID) {
			// Platform-specific button
			selectedOpt = detectPlatform();
			// Uses the resolver to get the dialog config
			dialogData = dialogResolverFn(selectedOpt);
		} else {
			// Channel + University (+ Subchannel) Sechem Case or Education + University Bagrut Avg Case
			// Extracts the relevant values out of the selectElements
			const selectedChannel = getSelectedOption(
				sechemAdmissionChannelsID
			);
			const selectedUni = getSelectedOption(uniSelectID);
			selectedOpt = selectedUni;
			let selectedSubchannel = null;
			if (
				extInfoSelect &&
				document.getElementById(extInfoSelect) &&
				getComputedStyle(document.getElementById(extInfoSelect))
					.display !== NONE
			) {
				selectedSubchannel = getSelectedOption(extInfoSelect);
				selectedOpt = selectedSubchannel; // override for tracking purposes
			}

			// Uses the resolver to get the dialog config
			dialogData = dialogResolverFn(
				selectedChannel,
				selectedUni,
				selectedSubchannel
			);
		}

		// Update dialog's title, text & textAlign settings
		dialogTitle.innerHTML = dialogTitleBase.format(dialogData.title || "");
		dialogText.style.textAlign = dialogData.text
			? textAlignRight
			: textAlighnCenter;
		dialogText.innerHTML = dialogData.text || noDialog2DisplayText;

		// Displays the dialog
		dialog.classList.remove(hiddenModeClass);

		// Logs Popup Dialog Event
		gtag(eventKey, popupDialogEventName, {
			event_category: selectedOpt,
			event_label: popupDialogEventLabel.format(selectedOpt),
		});
	});

	// Associates a CLICK event with the relevant dialogCloseButton, that enables to hide the dialog when pressed
	closeBtn.addEventListener(clickEvent, function () {
		dialog.classList.add(hiddenModeClass);
	});

	// Associates a CLICK event with the relevant dialogElement, that enables to hide the dialog when pressed
	dialog.addEventListener(clickEvent, function (e) {
		if (e.target === dialog) {
			dialog.classList.add(hiddenModeClass);
		}
	});
}

export default addPopupDialogsEventListeners;
