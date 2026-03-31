// ~~~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Handle Sechem Calculations \\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	calcTauFinalSechem,
	calcTauBagrutSechem,
	calcTauPrepSechem,
	calcTauPDSechem,
	calcTauFDSechem,
} from "../by-university/tau-sechem.js";
import {
	calcHujiAlternatives,
	calcHujiBagrutSechem,
	calcHujiFDSechem,
	calcHujiFinalSechem,
	calcHujiPDSechem,
	calcHujiPrepSechem,
} from "../by-university/huji-sechem.js";
import {
	calcTechFinalSechem,
	calcTechBagrutSechem,
	calcTechPrepSechem,
	calcTechAlternatives,
} from "../by-university/tech-sechem.js";
import {
	calcBguBagrutSechem,
	calcBguFDSechem,
	calcBguPDSechem,
	calcBguPrepSechem,
} from "../by-university/bgu-sechem.js";
import {
	calcBiuBagrutSechem,
	calcBiuPrepSechem,
} from "../by-university/biu-sechem.js";
import { defaultOpt, defaultUni } from "../../utils/general-config.js";
import {
	arielFirst,
	bguFD,
	bguFirst,
	bguPD,
	bguPrep,
	biuFirst,
	biuPrep,
	defaultAC,
	defaultFAC,
	defaultIshiutiCalc,
	haifaAlt,
	haifaFD,
	haifaFirst,
	hujiAlt,
	hujiFD,
	hujiFinal,
	hujiFirst,
	hujiPD,
	hujiPrep,
	morkamCalc,
	tauFD,
	tauFinal,
	tauFirst,
	tauPD,
	tauPrep,
	techAlt,
	techFinal,
	techFirst,
	techPrep,
	tzameretFinal,
	tzameretFirst,
	tzameretPrep,
} from "../sechem-config.js";
import {
	displayChooseAcLog,
	displayChooseFAcLog,
	displayChooseIshiutiCalcLog,
	displayChooseUniLog,
	displayNoFormulaLog,
	displayNoResults,
} from "./update-sechem-results.js";
import {
	getSelectedOption,
	normalizeDefaultOptID,
} from "../../utils/general-methods.js";
import {
	calcHaifaAlternatives,
	calcHaifaBagrutSechem,
	calcHaifaFDSechem,
} from "../by-university/haifa-sechem.js";
import {
	calcTzameretBagrutSechem,
	calcTzameretFinalSechem,
	calcTzameretPrepSechem,
} from "../by-university/tzameret-sechem.js";
import { calcMorkamGrade } from "../by-university/ishiuti-calcs.js";
import { getUniversityConfig } from "./config-wrappers.js";
import {
	eventKey,
	extraInputEventLabel,
	sechemEventLabel,
	sechemEventName,
	sechemStr,
} from "../../configs/google-analytics-config.js";
import {
	sechemButtonDefaultText,
	sechemButtonOnClickText,
} from "../../configs/results-strs-config.js";
import {
	bottomInputID,
	clickEvent,
	extTopInputID,
	enterKey,
	keyDownEvent,
	sechemAdmissionChannelsID,
	sechemButtonID,
	sechemButtonTimeout,
	sechemExtraInfoID,
	sechemSelectID,
	topInputID,
	nameAttirbute,
} from "../../configs/html-config.js";
import { calcArielBagrutSechem } from "../by-university/ariel-sechem.js";

// Calculates SECHEM when button is clicked
const initiateSechemCalc = document
	.getElementById(sechemButtonID)
	.addEventListener(clickEvent, function () {
		// Spinner effect
		this.innerHTML = sechemButtonOnClickText;
		this.disabled = true;

		// Clears result box
		displayNoResults();

		// InputElements
		const topInputElement = document.getElementById(topInputID);
		const extInputElement = document.getElementById(extTopInputID);
		const bottomInputElement = document.getElementById(bottomInputID);

		// Gets the values from the input boxes
		let topInput = parseFloat(topInputElement.value);
		let extInput = parseFloat(extInputElement.value);
		let bottomInput = parseFloat(bottomInputElement.value);

		// Gets the inputElements' NAME attributes
		let topName = topInputElement.getAttribute(nameAttirbute) || "";
		let extName = extInputElement.getAttribute(nameAttirbute) || "";
		let bottomName = bottomInputElement.getAttribute(nameAttirbute) || "";

		// Gets the selected option and extracts the its config, then its ID key
		const selectedChannel = getSelectedOption(sechemAdmissionChannelsID);
		const rawSelectedUni = getSelectedOption(sechemSelectID) || defaultOpt;
		const selectedUniKey = normalizeDefaultOptID(rawSelectedUni);
		const selectedUniConfig = getUniversityConfig(
			selectedChannel,
			selectedUniKey
		);
		let selectedOption = selectedUniConfig?.id;

		switch (selectedOption) {
			case tauFirst:
				calcTauBagrutSechem(topInput, bottomInput);
				break;
			case tauPrep:
				calcTauPrepSechem(topInput, bottomInput);
				break;
			case tauPD:
				calcTauPDSechem(topInput, bottomInput);
				break;
			case tauFD:
				calcTauFDSechem(topInput, bottomInput);
				break;
			case tauFinal:
				calcTauFinalSechem(topInput, bottomInput);
				break;
			case hujiFirst:
				calcHujiBagrutSechem(topInput, bottomInput);
				break;
			case hujiPrep:
				calcHujiPrepSechem(topInput, bottomInput);
				break;
			case hujiPD:
				calcHujiPDSechem(topInput, bottomInput);
				break;
			case hujiFD:
				calcHujiFDSechem(topInput, bottomInput);
				break;
			case hujiAlt:
				calcHujiAlternatives(topInput, bottomInput);
				break;
			case hujiFinal:
				calcHujiFinalSechem(topInput, bottomInput);
				break;
			case techFirst:
				calcTechBagrutSechem(topInput, bottomInput);
				break;
			case techPrep:
				calcTechPrepSechem(topInput, extInput, bottomInput);
				break;
			case techAlt:
				calcTechAlternatives([topInput, bottomInput]);
				break;
			case techFinal:
				calcTechFinalSechem(topInput, bottomInput);
				break;
			case bguFirst:
				calcBguBagrutSechem(topInput, bottomInput);
				break;
			case bguPrep:
				calcBguPrepSechem(topInput, extInput, bottomInput);
				break;
			case bguPD:
				calcBguPDSechem(topInput, bottomInput);
				break;
			case bguFD:
				calcBguFDSechem(topInput, bottomInput);
				break;
			case biuFirst:
				calcBiuBagrutSechem(topInput, bottomInput);
				break;
			case biuPrep:
				calcBiuPrepSechem(topInput, bottomInput);
				break;
			case haifaFirst:
				calcHaifaBagrutSechem(extInput, bottomInput, topInput);
				break;
			case haifaFD:
				calcHaifaFDSechem(topInput, bottomInput);
				break;
			case haifaAlt:
				calcHaifaAlternatives([topInput, bottomInput]);
				break;
			case arielFirst:
				calcArielBagrutSechem(topInput, bottomInput);
				break;
			case tzameretFirst:
				calcTzameretBagrutSechem(topInput, bottomInput);
				break;
			case tzameretPrep:
				calcTzameretPrepSechem(topInput, bottomInput);
				break;
			case tzameretFinal:
				calcTzameretFinalSechem(topInput, bottomInput);
				break;
			case morkamCalc:
				calcMorkamGrade(topInput, extInput, bottomInput);
				break;
			case defaultIshiutiCalc:
				displayChooseIshiutiCalcLog();
				break;
			case defaultUni:
				displayChooseUniLog();
				break;
			case defaultAC:
				displayChooseAcLog();
				break;
			case defaultFAC:
				displayChooseFAcLog();
				break;
			default:
				displayNoFormulaLog(); // Shows an instructive message
				break;
		}

		// Spinner effect timeout
		setTimeout(() => {
			this.innerHTML = sechemButtonDefaultText;
			this.disabled = false;
		}, sechemButtonTimeout);

		// Logs sechem calculation
		// Generates InputLogs
		let topInputLog = topName
			? extraInputEventLabel.format(topName.toUpperCase(), topInput)
			: "";
		let extInputLog = extName
			? extraInputEventLabel.format(extName.toUpperCase(), extInput)
			: "";
		let bottomInputLog = bottomName
			? extraInputEventLabel.format(bottomName.toUpperCase(), bottomInput)
			: "";
		// Updates to the relevant selectedOption
		selectedOption = getSelectedOption(sechemExtraInfoID)
			? getSelectedOption(sechemExtraInfoID)
			: selectedOption;
		// Logs the results
		gtag(eventKey, sechemEventName, {
			event_category: selectedOption.concat(sechemStr).toUpperCase(),
			event_label: sechemEventLabel.format(
				selectedOption.toUpperCase(),
				topInputLog,
				extInputLog,
				bottomInputLog
			),
		});
	});

// Calculates SECHEM when ENTER key is clicked
function handleEnterPressed(event) {
	if (event.key == enterKey) {
		document.getElementById(sechemButtonID).click();
	}
}
document.addEventListener(keyDownEvent, handleEnterPressed);

export default initiateSechemCalc;
