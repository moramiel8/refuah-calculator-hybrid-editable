// ~~~~~~~~~~~ \\
// Install App \\
// ~~~~~~~~~~~ \\

import {
	eventKey,
	installAppEventLabel,
	installAppEventName,
} from "../configs/google-analytics-config.js";
import {
	bagurtInstallButtonID,
	beforeInstallPromptEvent,
	clickEvent,
	iconInfoClassQuery,
	loadEvent,
	popupDialogClassQuery,
	sechemInstallButtonID,
} from "../configs/html-config.js";
import {
	Android,
	Windows,
	iOS,
	macOS,
	unknownPlatform,
} from "../configs/mobile-handling-config.js";
import {
	appAlreadyInstalledAlertOrIncognito,
	beforeInstallPromptEventFired,
	cantInstallAlert,
	choiceResultAccepted,
	iOSDownloadLink,
	installServiceWorker,
	serviceWorker,
	serviceWorkerRegisteredLog,
	serviceWorkerRegistrationFailed,
	userAcceptedInstallPrompt,
	userDismissedInstallPrompt,
} from "../configs/install-app-config.js";

// Checks if service workers are supported
if (serviceWorker in navigator) {
	// Registers the service worker when the window loads
	window.addEventListener(loadEvent, () => {
		navigator.serviceWorker.register(installServiceWorker);
		// .then((registration) => {
		// 	console.log(serviceWorkerRegisteredLog, registration.scope);
		// })
		// .catch((error) => {
		// 	console.log(serviceWorkerRegistrationFailed, error);
		// });
	});
}

// Existing installation prompt logic
let deferredPrompt;
window.addEventListener(beforeInstallPromptEvent, (event) => {
	// console.log(beforeInstallPromptEventFired);
	event.preventDefault();
	deferredPrompt = event;
});

// Binds CLICK Event to install-buttons, that handles the application installation process
const installApp = function () {
	document
		.getElementById(sechemInstallButtonID)
		.addEventListener(clickEvent, function (event) {
			// If install CLICK event is fired when pressing the infoBtn - dismisses the process
			if (
				event.target.closest(iconInfoClassQuery) ||
				event.target.closest(popupDialogClassQuery)
			) {
				event.stopImmediatePropagation();
			} else {
				// Keeps to the installation process
				detectAndInstallByPlatform(this);
			}
		});

	document
		.getElementById(bagurtInstallButtonID)
		.addEventListener(clickEvent, function (event) {
			// If install CLICK event is fired when pressing the infoBtn - dismisses the process
			if (
				event.target.closest(iconInfoClassQuery) ||
				event.target.closest(popupDialogClassQuery)
			) {
				event.stopImmediatePropagation();
			} else {
				// Keeps to the installation process
				detectAndInstallByPlatform(this);
			}
		});
};

// Detects the userAgent's platform, and installs accordingly
function detectAndInstallByPlatform(installButton) {
	// Detects platform by the navigator's userAgent
	const userAgent = navigator.userAgent;
	let platform = detectPlatform();

	// Inatalls the site as an application, according to the extracted platform
	switch (platform) {
		case Android:
			installWindowsAndAndroidApp(installButton);
			break;
		case iOS:
			installiOSApp();
			break;
		case Windows:
			installWindowsAndAndroidApp(installButton);
			break;
		default:
			alert(cantInstallAlert);
			break;
	}

	// Logs application installation
	gtag(eventKey, installAppEventName, {
		event_category: platform,
		event_label: installAppEventLabel.format(platform, userAgent),
	});
}

// Detects the userAgent's platform
export const detectPlatform = function () {
	// Extracts userAgent string
	const userAgent = navigator.userAgent;
	let platform = unknownPlatform;

	// Tests different regex in order to detect the platform
	if (/android/i.test(userAgent)) {
		// Code for Android
		platform = Android;
	} else if (/iPad|iPhone|iPod/i.test(userAgent)) {
		// Code for iOS
		platform = iOS;
	} else if (/windows/i.test(userAgent)) {
		// Code for Windows
		platform = Windows;
	} else if (/macintosh/i.test(userAgent)) {
		// Code for macOS
		platform = macOS;
	}

	return platform;
};

// Installs iOS app
function installiOSApp() {
	window.open(iOSDownloadLink);
}

// Installs Windows or Android app
function installWindowsAndAndroidApp() {
	// Checks if deferredPormpt is defined. If it doesnt, it means the application is already installed
	if (deferredPrompt) {
		deferredPrompt.prompt(); // Shows the install prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === choiceResultAccepted) {
				// console.log(userAcceptedInstallPrompt);
			} else {
				// console.log(userDismissedInstallPrompt);
			}
			deferredPrompt = null;
		});
	} else {
		// Shows an alert, as the the user tried to install the application once again
		alert(appAlreadyInstalledAlertOrIncognito);
	}
}

export default installApp;
