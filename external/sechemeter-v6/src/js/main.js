// ~~~~~~~~~~~~ \\
// Porject Main \\
// ~~~~~~~~~~~~ \\

import "../css/index.css";

import initiateSechemFrame from "./sechem/sechem-main.js";
import initiateBagrutFrame from "./bagrut/bagrut-main.js";
import fillMailText from "./utils/handle-contact-by-email.js";
import installApp from "./utils/install-app.js";
import handleLoadingOverlay from "./utils/loading-overlay.js";
import { initRefuahModeToggle } from "./utils/refuah-ui.js";
import { eventKey, visitEventName } from "./configs/google-analytics-config.js";

async function main() {
	await initiateSechemFrame();
	await initiateBagrutFrame();
	initRefuahModeToggle();
	fillMailText();
	installApp();
	handleLoadingOverlay();

	gtag(eventKey, visitEventName, {
		referrer: document.referrer || "direct",
		user_agent: navigator.userAgent || "",
		platform: navigator.platform || "",
		screen_width: window.innerWidth || "",
		screen_height: window.innerHeight || "",
		user_language: navigator.language || "",
		js_version: "v6.1.0",
	});
}

main();
