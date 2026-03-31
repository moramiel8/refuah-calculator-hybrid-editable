// ~~~~~~~~~~~~~~~~~~~~ \\
// Frame Switch Handler \\
// ~~~~~~~~~~~~~~~~~~~~ \\

import {
	activeForm,
	clickEvent,
	themeAttribute,
} from "../configs/html-config.js"; // clickEvent used for tab + legacy buttons
import {
	bagrutFormID,
	sechemFormID,
	toBagrutButtonID,
	toSechemButtonID,
} from "../configs/html-config.js";

const TAB_SECHEM = "sechem";
const TAB_BAGRUT = "bagrut";
const TAB_FINAL = "final";

// Gets a formID and updates its data-theme attribute according to the given themeColor
export const changeFormColors = function (formID, themeColor) {
	const formElemenet = document.getElementById(formID);
	if (!formElemenet) return;
	// Keep Refuah skin when embedded / ?refuah=1 (initial↔final switch should not flip to green/red).
	try {
		if (new URLSearchParams(location.search).get("refuah") === "1") {
			formElemenet.setAttribute(themeAttribute, "refuah");
			return;
		}
	} catch {
		/* ignore */
	}
	formElemenet.setAttribute(themeAttribute, themeColor);
};

// Switches from one form to another (sechem-form <-> bagrut-form) — legacy API
export const switchForm = function (oldFormId, newFormId) {
	const oldForm = document.getElementById(oldFormId);
	const newForm = document.getElementById(newFormId);
	if (!oldForm || !newForm) return;
	oldForm.classList.remove(activeForm);
	newForm.classList.add(activeForm);
};

function setMainTab(tab) {
	const sechem = document.getElementById(sechemFormID);
	const bagrut = document.getElementById(bagrutFormID);
	const finalPanel = document.getElementById("final-grade-panel");
	const tabSechem = document.getElementById("refuah-tab-sechem");
	const tabBagrut = document.getElementById("refuah-tab-bagrut");
	const tabFinal = document.getElementById("refuah-tab-final");

	[sechem, bagrut, finalPanel].forEach((el) => {
		if (!el) return;
		el.classList.remove("refuah-tab-panel--active");
	});

	[tabSechem, tabBagrut, tabFinal].forEach((btn) => {
		if (!btn) return;
		btn.classList.remove("refuah-main-tab--active");
		btn.setAttribute("aria-selected", "false");
	});

	if (tab === TAB_SECHEM && sechem && tabSechem) {
		sechem.classList.add("refuah-tab-panel--active");
		tabSechem.classList.add("refuah-main-tab--active");
		tabSechem.setAttribute("aria-selected", "true");
	} else if (tab === TAB_BAGRUT && bagrut && tabBagrut) {
		bagrut.classList.add("refuah-tab-panel--active");
		tabBagrut.classList.add("refuah-main-tab--active");
		tabBagrut.setAttribute("aria-selected", "true");
	} else if (tab === TAB_FINAL && finalPanel && tabFinal) {
		finalPanel.classList.add("refuah-tab-panel--active");
		tabFinal.classList.add("refuah-main-tab--active");
		tabFinal.setAttribute("aria-selected", "true");
	}
}

function initRefuahMainTabs() {
	const ts = document.getElementById("refuah-tab-sechem");
	if (!ts) {
		// Legacy layout: switch buttons only
		const toBagrut = document.getElementById(toBagrutButtonID);
		const toSechem = document.getElementById(toSechemButtonID);
		if (toBagrut) {
			toBagrut.addEventListener(clickEvent, function () {
				switchForm(sechemFormID, bagrutFormID);
			});
		}
		if (toSechem) {
			toSechem.addEventListener(clickEvent, function () {
				switchForm(bagrutFormID, sechemFormID);
			});
		}
		return;
	}

	const tb = document.getElementById("refuah-tab-bagrut");
	const tf = document.getElementById("refuah-tab-final");
	if (!tb || !tf) return;

	ts.addEventListener(clickEvent, () => setMainTab(TAB_SECHEM));
	tb.addEventListener(clickEvent, () => setMainTab(TAB_BAGRUT));
	tf.addEventListener(clickEvent, () => setMainTab(TAB_FINAL));

	setMainTab(TAB_SECHEM);
}

initRefuahMainTabs();
