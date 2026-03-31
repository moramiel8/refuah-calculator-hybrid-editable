// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Handle Sechem Visual Changes \\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	dispatchAnEvent,
	getSelectedOption,
	normalizeDefaultOptID,
	updateImage,
} from "../../utils/general-methods.js";
import { defaultOpt } from "../../utils/general-config.js";
import {
	displayDefaultLog,
	displayNoFormulaLog,
} from "./update-sechem-results.js";
import removeOldTableAndCreateNew from "./handle-sechem-table.js";
import addPopupDialogsEventListeners from "../../utils/handle-popup-dialog.js";
import {
	changeSelectOptions,
	toggleVisibility,
	updateCalcSectionH2,
	updateInput,
	updateLabel,
} from "../../utils/handle-visual-changes.js";
import { changeFormColors } from "../../utils/frame-switch-handler.js";
import { detectPlatform } from "../../utils/install-app.js";
import {
	getAllChannels,
	getChannelConfig,
	getDefaultFinalChannel,
	getDefaultFirstChannel,
	getSubchannelConfig,
	getUniversityConfig,
} from "./config-wrappers.js";
import {
	NONE,
	bottomInputID,
	bottomLabelID,
	changeEvent,
	displayBlock,
	displayRevert,
	greenTheme,
	inputElement,
	labelElement,
	objectDataType,
	redTheme,
	sechemAdmissionChannelsID,
	sechemButtonID,
	sechemCalcH2ID,
	sechemExtraInfoID,
	sechemFormID,
	sechemInstallCloseBtnID,
	sechemInstallDialogBtnID,
	sechemInstallDialogID,
	sechemInstallDialogTextID,
	sechemInstallDialogTitleID,
	sechemLogoImageID,
	sechemPopupCloseBtnID,
	sechemPopupDialogBtnID,
	sechemPopupDialogID,
	sechemPopupDialogTextID,
	sechemPopupDialogTitleID,
	sechemSelectID,
	sechemSwitchID,
	sechemTableID,
	sechemTableLabelID,
	topInputID,
	topLabelID,
} from "../../configs/html-config.js";
import { installDialogTexts } from "../../configs/mobile-handling-config.js";

// Updates Labels, Inputs, sechemTable, logoImage & H2 title
const updateSechemVisualChanges = function (styleDict) {
	updateSechemLabels.apply(this, styleDict.updateLabelsArgs);
	updateSechemInputs.apply(this, styleDict.updateInputsArgs);
	updateSechemTable(styleDict.sechemTableDisplay, styleDict.sechemDelta);
	updateImage(sechemLogoImageID, styleDict.newImg);
	updateSechemCalcH2();
};

// Updates Sechem Labels' text content & Display values
function updateSechemLabels(
	topLabelText,
	bottomLabelText,
	topLabelDisplay,
	bottomLabelDisplay
) {
	updateLabel(topLabelID, topLabelText, topLabelDisplay);
	updateLabel(bottomLabelID, bottomLabelText, bottomLabelDisplay);
}

// Updates Sechem Inputs' values & clears one / both
function updateSechemInputs(topInputArgs, bottomInputArgs, clearBothInputs) {
	updateInput.apply(this, topInputArgs);
	updateInput.apply(this, bottomInputArgs);

	clearInputs(clearBothInputs);
}

// Updates sechemTable Display value and passes selectedUni's sechemDelta to update ths sechem accordingly
function updateSechemTable(sechemTableDisplay, sechemDelta) {
	// Removes old sechemTable and creates a new one
	let selectedUniversity = getSelectedOption(sechemSelectID);
	if (selectedUniversity && sechemTableDisplay) {
		removeOldTableAndCreateNew(selectedUniversity, sechemDelta);
	}

	// Toggles sechemTable visibility on/off
	sechemTableDisplay = sechemTableDisplay ? displayRevert : NONE;
	toggleVisibility(sechemTableID, sechemTableDisplay);
	if (sechemTableDisplay == displayRevert) {
		toggleVisibility(sechemTableLabelID, displayBlock);
	} else {
		toggleVisibility(sechemTableLabelID, NONE);
	}
}

// Clears both Input Elements (top & bottom) if both=true. Otherwise clears only the top one.
function clearInputs(both = true) {
	document.getElementById(topInputID).value = "";
	if (both) {
		document.getElementById(bottomInputID).value = "";
	}
}

// Handles cases when the chosen admissionChannelUni formula is known
const handleFormulaStyle = function (styleDict) {
	// Updates the visual settings of the selected admissionChannelUni
	updateSechemVisualChanges(styleDict);

	// Clears results
	displayDefaultLog();
};

// Handles cases when the chosen admissionChannelUni formula is not known
function handleNoFormulaStyle({ inputs, logo, showSechemTable, sechemDelta }) {
	// Hides calc button
	toggleVisibility(sechemButtonID, NONE);

	// Hides inputs, but updates sechemTable & logo according to the given values
	handleFormulaStyle({
		updateLabelsArgs: [
			inputs?.top?.label || "",
			inputs?.bottom?.label || "",
			NONE,
			NONE,
		],
		updateInputsArgs: [
			[
				inputs.top?.id,
				inputs.top?.name ?? "",
				NONE,
				inputs?.top?.min ?? "",
				inputs?.top?.max ?? "",
				inputs?.top?.allowDecimal ?? true,
			],
			[
				inputs.bottom?.id,
				inputs.bottom?.name ?? "",
				NONE,
				inputs?.bottom?.min ?? "",
				inputs?.bottom?.max ?? "",
				inputs?.bottom?.allowDecimal ?? true,
			],
			true,
		],
		sechemTableDisplay: showSechemTable,
		sechemDelta: sechemDelta,
		newImg: logo,
	});

	// Hides extTopInput and its Label if they exist
	if (inputs?.extTop?.id) {
		updateInput(
			inputs.extTop.id,
			inputs.extTop.name ?? "",
			NONE,
			inputs.extTop.min ?? "",
			inputs.extTop.max ?? "",
			inputs.extTop.allowDecimal ?? true
		);
		updateLabel(
			inputs.extTop.id.replace(inputElement, labelElement),
			inputs.extTop.label,
			NONE
		);
		document.getElementById(inputs.extTop.id).value = "";
	}

	displayNoFormulaLog(); // Shows an instructive message
}

// Checks if the selected admissionChannelUni's formula is unknown
function isUnknownFormula(channelID, uniID, subchannelID = null) {
	// Extracts selectedUni config
	const uni = getUniversityConfig(channelID, uniID);

	// Returns False if no config was found for the chosen uni
	if (!uni) return false;

	// Handles subchannel case
	if (subchannelID) {
		const sub = uni.subChannels?.[subchannelID];
		return !!sub && subchannelID !== defaultOpt && !sub.calculation;
	}

	// Checks if uni is not a defaultChannel or lacks calculation section
	return uniID !== defaultOpt && !uni.calculation;
}

// Updates sechem form's calculation section's title according to the selected university & admission channel
function updateSechemCalcH2() {
	// Extracts the relevant configs
	const selectedChannel = getSelectedOption(sechemAdmissionChannelsID);
	const selectedUni = getSelectedOption(sechemSelectID);
	const channel = getChannelConfig(selectedChannel);
	const uni = getUniversityConfig(selectedChannel, selectedUni);

	// Updates the relevant H2 title
	updateCalcSectionH2(sechemCalcH2ID, channel, uni);
}

// Updates selectElements according to the scope (FIRST or FINAL sechem)
const updateSelectsOnSechemSwitch = function (isFirstSechem) {
	// Extracts admission channels config of the selected scope
	const configSource = getAllChannels(isFirstSechem);

	// Retrieves the default admission channel of the selected scope
	const defaultChannel = isFirstSechem
		? getDefaultFirstChannel()
		: getDefaultFinalChannel();

	// Populates admissionChannelSelect with the retrieved options
	const channelOptions = Object.entries(configSource).map(([id, cfg]) => ({
		value: id,
		text: cfg.label || cfg.name || id,
	}));
	changeSelectOptions(sechemAdmissionChannelsID, channelOptions);
	document.getElementById(sechemAdmissionChannelsID).value = defaultChannel;

	// Populates uniSelect with the selected admission channel's options
	const uniConfigs = configSource?.[defaultChannel]?.universities || {};
	const uniOptions = Object.entries(uniConfigs).map(([_, uni]) => ({
		value: uni.id,
		text: uni.optText || uni.name || "",
	}));
	changeSelectOptions(sechemSelectID, uniOptions);

	// Resets extInfoSelect
	changeSelectOptions(sechemExtraInfoID, []);

	// Triggers a change event on sechemAdmissionChannelsID to update dependencies
	dispatchAnEvent(changeEvent, sechemAdmissionChannelsID);
};

// Handles an event in which the sechemSwitch button is clicked
document.getElementById(sechemSwitchID).onchange = function () {
	// When checked, switches to Final Sechem frame. Otherwise, swiches to First Sechem frame.
	const isFinal = this.checked;

	// Changes theme colors
	changeFormColors(sechemFormID, isFinal ? redTheme : greenTheme);

	// Updates selectElements options
	updateSelectsOnSechemSwitch(!isFinal);

	// Updates H2 title
	updateSechemCalcH2();

	// Clears results
	displayDefaultLog();
};

// Sets uniSelect options based on the selected channel
function updateUniSechemSelect() {
	// Extracts the relevant channel config and its universities
	const selectedChannel = getSelectedOption(sechemAdmissionChannelsID);
	const channelConfig = getChannelConfig(selectedChannel);
	const uniEntries = Object.entries(channelConfig?.universities || {});

	// Ensures defaultUni appears first
	const sortedUniEntries = uniEntries.sort(([a], [b]) => {
		if (a === defaultOpt) return -1;
		if (b === defaultOpt) return 1;
		return 0;
	});

	// Populates uniSelect with the retrieved options
	const options = sortedUniEntries.map(([_, uni]) => ({
		value: uni.id,
		text: uni.optText,
	}));
	changeSelectOptions(sechemSelectID, options);

	// Safely gets the default option value or falls back to the first available option
	const defaultUniID =
		channelConfig?.universities?.default?.id || options[0]?.value || "";
	document.getElementById(sechemSelectID).value = defaultUniID;

	// Triggers downstream visual updates after population
	dispatchAnEvent(changeEvent, sechemSelectID);
}

// Sets uniSelect options based on the selected university
function updateExtInfoSelect() {
	// Extracts the relevant channel+uni config (+subchannels if exist)
	const selectedChannel = getSelectedOption(sechemAdmissionChannelsID);
	const selectedUniversity = getSelectedOption(sechemSelectID);
	const subChannels = getUniversityConfig(
		selectedChannel,
		selectedUniversity
	)?.subChannels;

	// If subchannels do exist, populate extInfoSelect with them. Otherwise clears it.
	if (subChannels && typeof subChannels === objectDataType) {
		const dropdownOptions = Object.values(subChannels).map(
			({ id, optText }) => ({
				value: id,
				text: optText,
			})
		);
		changeSelectOptions(sechemExtraInfoID, dropdownOptions);
	} else {
		changeSelectOptions(sechemExtraInfoID, []);
	}
}

// Applies visual changes for the chosen channel+uni+?subchannel
function applySechemVisualChanges() {
	// Retrieves  the selected channel, university & subchannel values
	const selectedChannel = getSelectedOption(sechemAdmissionChannelsID);
	const selectedUniversity = normalizeDefaultOptID(
		getSelectedOption(sechemSelectID) || defaultOpt
	);
	const rawSubchannel =
		document.getElementById(sechemExtraInfoID)?.style.display !== NONE
			? getSelectedOption(sechemExtraInfoID)
			: null;
	const selectedSubchannel = normalizeDefaultOptID(rawSubchannel);

	// Extracts the relevant uni and/or subchannel configs
	const uni = getUniversityConfig(selectedChannel, selectedUniversity);
	const subchannel = selectedSubchannel
		? getSubchannelConfig(
				selectedChannel,
				selectedUniversity,
				selectedSubchannel
		  )
		: null;

	// Extracts from the relevant config the visual settings
	const inputs = subchannel?.inputs || uni?.inputs;
	const logo = uni?.logo ?? null;
	const showSechemTable = subchannel
		? subchannel.showSechemTable
		: uni?.showSechemTable;
	const sechemDelta = uni?.sechemDelta ?? 0;

	// Checks if the selected scope is of an unknownFormula type - updates form's style accordingly
	if (
		isUnknownFormula(
			selectedChannel,
			selectedUniversity,
			selectedSubchannel
		)
	) {
		handleNoFormulaStyle({
			inputs,
			logo,
			showSechemTable,
			sechemDelta,
		});
		return;
	}

	// Checks if inputs settings was successfully extracted from the config - updates form's visually accordingly
	if (inputs) {
		handleFormulaStyle({
			updateLabelsArgs: [
				inputs.top?.label || "",
				inputs.bottom?.label || "",
				inputs.top?.display ? displayBlock : NONE,
				inputs.bottom?.display ? displayBlock : NONE,
			],
			updateInputsArgs: [
				[
					inputs.top?.id,
					inputs.top?.name ?? "",
					inputs.top?.display ? displayBlock : NONE,
					inputs.top?.min ?? "",
					inputs.top?.max ?? "",
					inputs.top?.allowDecimal ?? true,
				],
				[
					inputs.bottom?.id,
					inputs.bottom?.name ?? "",
					inputs.bottom?.display ? displayBlock : NONE,
					inputs.bottom?.min ?? "",
					inputs.bottom?.max ?? "",
					inputs.bottom?.allowDecimal ?? true,
				],
				true,
			],
			sechemTableDisplay: showSechemTable,
			sechemDelta: sechemDelta,
			newImg: logo,
		});

		// Handles extTopInput element settings
		if (inputs.extTop?.id) {
			updateInput(
				inputs.extTop.id,
				inputs.extTop.name ?? "",
				inputs.extTop.display ? displayBlock : NONE,
				inputs.extTop.min ?? "",
				inputs.extTop.max ?? "",
				inputs.extTop.allowDecimal ?? true
			);
			updateLabel(
				inputs.extTop.id.replace(inputElement, labelElement),
				inputs.extTop.label,
				inputs.extTop.display ? displayBlock : NONE
			);
			document.getElementById(inputs.extTop.id).value = "";
		}
	}

	// Displays calcButton
	toggleVisibility(sechemButtonID, displayBlock);
}

// Binds sechemAdmissionChannels to onchange event, that when triggered updates form visually accordingly
document.getElementById(sechemAdmissionChannelsID).onchange = function () {
	const selectedChannel = this.value;
	if (selectedChannel) {
		updateUniSechemSelect();
		updateExtInfoSelect();
		applySechemVisualChanges();
	}
};

// Binds uniSelect to onchange event, that when triggered updates form visually accordingly
document.getElementById(sechemSelectID).onchange = function () {
	const selectedUni = this.value;
	if (selectedUni) {
		updateExtInfoSelect();
		applySechemVisualChanges();
	}
};

// Binds extInfoSelect to onchange event, that when triggered updates form visually accordingly
document.getElementById(sechemExtraInfoID).onchange = function () {
	const selectedExtInfo = this.value;
	if (selectedExtInfo) {
		// Unified handler for all input elements including extTop
		applySechemVisualChanges();
	}
};

// Returns the selected channel+uni+?subchannel's dialog config
function resolveSechemDialog(channel, uniID, subchannelID = null) {
	// Extracts the selected uni config
	const uni = getUniversityConfig(channel, uniID);

	// Returns null if uni is falsy
	if (!uni) return null;

	// Handles subchannel case
	if (subchannelID && uni.subChannels?.[subchannelID]?.dialog) {
		return uni.subChannels[subchannelID].dialog;
	}

	// Otherwise, returns the main university dialog
	return uni.dialog;
}

// Passes sechemDialog relevent IDs, and attaches eventListeners to trigger appearance of the appropriate popup messages
addPopupDialogsEventListeners(
	sechemSelectID,
	sechemPopupDialogBtnID,
	sechemPopupDialogID,
	sechemPopupCloseBtnID,
	sechemPopupDialogTitleID,
	sechemPopupDialogTextID,
	resolveSechemDialog,
	sechemExtraInfoID
);

// Passes sechemInstallDialog relevent IDs, and attaches eventListeners to trigger appearance of the appropriate popup messages
addPopupDialogsEventListeners(
	null,
	sechemInstallDialogBtnID,
	sechemInstallDialogID,
	sechemInstallCloseBtnID,
	sechemInstallDialogTitleID,
	sechemInstallDialogTextID,
	() => installDialogTexts[detectPlatform()] ?? null
);

// Dispatches the CHANGE event to trigger the event listener (mainly to trigger INPUT elements' event listneres and hide elements which are not relevant)
dispatchAnEvent(changeEvent, sechemAdmissionChannelsID);

export default updateSechemVisualChanges;
