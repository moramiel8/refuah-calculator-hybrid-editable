// Refuah-style UI helpers: main tab bar + mode toggle (syncs #sechem-switch)
import { sechemSwitchID } from "../configs/html-config.js";
import { clickEvent } from "../configs/html-config.js";

export function initRefuahModeToggle() {
	const sw = document.getElementById(sechemSwitchID);
	const btnI = document.getElementById("refuah-mode-initial");
	const btnF = document.getElementById("refuah-mode-final");
	if (!sw || !btnI || !btnF) return;

	function sync() {
		const isFinal = sw.checked;
		btnI.classList.toggle("refuah-mode-btn--active", !isFinal);
		btnF.classList.toggle("refuah-mode-btn--active", isFinal);
	}

	btnI.addEventListener(clickEvent, () => {
		if (sw.checked) {
			sw.checked = false;
			sw.dispatchEvent(new Event("change", { bubbles: true }));
		}
	});

	btnF.addEventListener(clickEvent, () => {
		if (!sw.checked) {
			sw.checked = true;
			sw.dispatchEvent(new Event("change", { bubbles: true }));
		}
	});

	sw.addEventListener("change", sync);
	sync();
}
