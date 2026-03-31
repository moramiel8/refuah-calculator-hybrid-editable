// ~~~~~~~~~~~~~~~~~~~~~~~ \\
// Handle Contact By Email \\
// ~~~~~~~~~~~~~~~~~~~~~~~ \\

import {
	contactEmailEventLabel,
	contactEmailEventName,
	eventKey,
} from "../configs/google-analytics-config.js";
import {
	DOMContentLoadedEvent,
	bagrutMailRefID,
	clickEvent,
	loadingState,
	mailtoSelectorQuery,
	sechemMailRefID,
} from "../configs/html-config.js";
import { mailToNotFoundLog, mailToPar } from "./general-config.js";
import { getCurrentYear } from "./general-methods.js";

// Fills Mail Text for copyright purposes
const fillMailText = () => {
	if (document.readyState === loadingState) {
		// DOM is still loading, attaches the event listener
		document.addEventListener(DOMContentLoadedEvent, () => {
			updateMailText();
		});
	} else {
		// DOM is already loaded, executes immediately
		updateMailText();
	}
};

// Updates Mail Text when DOM is ready
const updateMailText = () => {
	// Queries mailTo paragraphs
	const mailtoParagraphs = document.querySelectorAll(mailtoSelectorQuery);

	// Updates the queried paragraphs
	if (mailtoParagraphs && mailtoParagraphs.length === 2) {
		mailtoParagraphs[0].innerHTML = mailToPar.format(
			getCurrentYear(),
			sechemMailRefID
		);
		mailtoParagraphs[1].innerHTML = mailToPar.format(
			getCurrentYear(),
			bagrutMailRefID
		);
	} else {
		console.error(mailToNotFoundLog);
	}

	// Logs contact email via both sechem & bagrut forms
	bindContactEmailEvents();
};

// Logs contact email via both sechem & bagrut forms
const bindContactEmailEvents = function () {
	// Sechem form:
	document
		.getElementById(sechemMailRefID)
		.addEventListener(clickEvent, function () {
			gtag(eventKey, contactEmailEventName, {
				event_category: contactEmailEventName,
				event_label: contactEmailEventLabel.format(this.id),
			});
		});

	// Bagrut form:
	document
		.getElementById(bagrutMailRefID)
		.addEventListener(clickEvent, function () {
			gtag(eventKey, contactEmailEventName, {
				event_category: contactEmailEventName,
				event_label: contactEmailEventLabel.format(this.id),
			});
		});
};

export default fillMailText;
