//~~~~~~~~~~~~~~~~~~ \\
// Send Post Request \\
// ~~~~~~~~~~~~~~~~~ \\

import {
	eventKey,
	httpErrorEventName,
	sechemHttpErrorEventCategory,
	sechemHttpErrorLabel,
} from "../../configs/google-analytics-config.js";
import {
	abortError,
	defaultHttpTimeout,
	httpOk,
	httpServiceUnavailable,
	httpTimeoutError,
	httpUnexpectedError,
	serviceUnavailableError,
	unexpectedHttpError,
} from "../../configs/http-config.js";

// Initiates HTTP connection for SECHEM calculation purposes
const sendPostRequest = async function (
	httpMethod,
	headers,
	formDataFunc,
	formDataArgs,
	isResponseFunc,
	parseResponseFunc,
	timeout = defaultHttpTimeout // Timeout in milliseconds
) {
	// Handles fetch abort when timeout exceeds (service/server unavailable)
	let signal, timeoutId;
	[signal, timeoutId] = handleFetchAbort(timeout);

	// Forms a json/dataStructure to send via API
	let url, data;
	[url, data] = formDataFunc.apply(this, formDataArgs);

	// Fetches SECHEM via API
	try {
		const response = await fetch(url, {
			method: httpMethod,
			headers: headers,
			body: data,
			signal,
		});

		// Clears the timeout on successful response
		clearTimeout(timeoutId);

		// Once 200 OK is received, extracts the text and then the SECHEM
		if (response.status === httpOk) {
			const responseText = await response.text();

			// Ignores empty or invalid responses
			if (responseText && !responseText.includes(null)) {
				let sechem;

				// TAU/BGU response
				if (isResponseFunc(responseText)) {
					sechem = parseResponseFunc(responseText);
				}

				// Returns the processed sechem result
				return parseFloat(sechem);
			} else {
				// Handles service unavailable error
				const error = new Error(serviceUnavailableError);
				error.name = abortError; // Displays the same output as timeout error
				throw error;
			}
		} else if (response.status === httpServiceUnavailable) {
			// Handles service unavailable error
			const error = new Error(serviceUnavailableError);
			error.name = abortError; // Displays the same output as timeout error
			throw error;
		} else {
			// Handles HTTP unexpected error
			const error = new Error(
				unexpectedHttpError.format(response.status)
			);
			error.name = httpUnexpectedError; // Displays different output than timeout error
			throw error;
		}
	} catch (error) {
		// Ensures timeout is cleared on errors
		clearTimeout(timeoutId);

		// Logs error with Google Analytics
		gtag(eventKey, httpErrorEventName, {
			event_category: sechemHttpErrorEventCategory,
			event_label: sechemHttpErrorLabel.format(
				url,
				headers,
				data,
				error.name,
				error.message
			),
		});

		if (error.name === abortError) {
			// Handles timeout-specific/service unavailable errors
			return httpTimeoutError;
		}
		if (error.name === httpUnexpectedError) {
			// Handles HTTP unexpected error
			return httpUnexpectedError;
		}

		// Also returns the httpUnexpectedError as default
		return httpUnexpectedError;
	}
};

// Handles fetch abort when timeout exceeds (service/server unavailable)
const handleFetchAbort = function (timeout) {
	const controller = new AbortController(); // Controller to handle fetch abort
	const signal = controller.signal;

	// Sets up the timeout
	const timeoutId = setTimeout(() => {
		controller.abort(); // Aborts the fetch if it exceeds the timeout
	}, timeout);

	return [signal, timeoutId];
};

export default sendPostRequest;
