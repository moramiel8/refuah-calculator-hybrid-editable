// ~~~~~~~~~~~~~~~ \\
// Config Wrappers \\
// ~~~~~~~~~~~~~~~ \\

import {
	ADMISSION_CHANNELS,
	FINAL_ADMISSION_CHANNELS,
	defaultAC,
	defaultFAC,
} from "../sechem-config.js";

// Returns the whole config according to the requested scope (first or final)
export function getAllChannels(isFirstSechem) {
	return isFirstSechem ? ADMISSION_CHANNELS : FINAL_ADMISSION_CHANNELS;
}

// Gets an admissoinChannelID and retrieves its config
export function getChannelConfig(channelID) {
	return (
		ADMISSION_CHANNELS?.[channelID] ??
		FINAL_ADMISSION_CHANNELS?.[channelID] ??
		null
	);
}

// Gets an admissoinChannelID & universityID and retrieves its config
export function getUniversityConfig(channelID, universityID) {
	const channel = getChannelConfig(channelID);
	return channel?.universities?.[universityID] ?? null;
}

// Gets an admissoinChannelID, universityID & subChannelID and retrieves its config
export function getSubchannelConfig(channelID, universityID, subchannelID) {
	const uni = getUniversityConfig(channelID, universityID);
	return uni?.subChannels?.[subchannelID] ?? null;
}

// Returns the default firstAdmissionChannel
export function getDefaultFirstChannel() {
	return defaultAC;
}

// Returns the default finalAdmissionChannel
export function getDefaultFinalChannel() {
	return defaultFAC;
}
