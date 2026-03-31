// ~~~~~~~~~~~~~~~ \\
// Config Wrappers \\
// ~~~~~~~~~~~~~~~ \\

import { objectDataType } from "../../configs/html-config.js";
import { defaultOpt } from "../../utils/general-config.js";
import { bagrutAvgConfig, subjectsConfig } from "../bagrut-config.js";

///////////////////////////////////////////////////////////////////
/////////////////////////// BAGRUT AVG ////////////////////////////
///////////////////////////////////////////////////////////////////

// Returns the config for a given education type
export function getEducationBagrutConfig(educationID) {
	return bagrutAvgConfig?.[educationID] ?? null;
}

// Returns the universities config dict under a specific education
export function getUniversitiesForEducation(educationID) {
	return getEducationBagrutConfig(educationID)?.universities ?? null;
}

// Returns the university config under a given education
export function getUniversityBagrutConfig(educationID, universityID) {
	return (
		getEducationBagrutConfig(educationID)?.universities?.[universityID] ??
		null
	);
}

// Returns the default table subjects for an education type
export function getDefaultSubjects(educationID) {
	return getEducationBagrutConfig(educationID)?.defaultTableSubjects ?? [];
}

// Gets all educationType keys
export function getAllEducationsOptions() {
	return Object.entries(bagrutAvgConfig).map(([id, data]) => ({
		value: id,
		text: data.optText,
	}));
}

// Gets all university keys under an educationType
export function getUniversitySelectOptions(educationID) {
	return Object.entries(getUniversitiesForEducation(educationID) || {})
		.sort(([a], [b]) => (a === defaultOpt ? -1 : b === defaultOpt ? 1 : 0))
		.map(([_, uni]) => ({
			value: uni.id,
			text: uni.optText,
		}));
}

///////////////////////////////////////////////////////////////////
/////////////////////// BAGRUT SUBJECTS ///////////////////////////
///////////////////////////////////////////////////////////////////

// Returns the full subjectsConfig object
export function getAllSubjectsConfig() {
	return subjectsConfig;
}

// Returns the full subject config object for a given subject ID
export function getSubjectConfig(subjectID) {
	return subjectsConfig?.[subjectID] ?? null;
}

// Returns the specific variant config for a subject + variant
export function getSubjectVariantConfig(subjectID, variantID) {
	return getSubjectConfig(subjectID)?.[variantID] ?? null;
}

// Gets all education keys under a subject (excluding text key)
export function getSubjectVariantOptions(subjectName) {
	const full = getSubjectConfig(subjectName);
	if (!full) return [];

	return Object.entries(full)
		.filter(([key]) => key !== "text")
		.map(([educationID, data]) => ({
			value: educationID,
			text: data.text,
		}));
}

// Gets all subject keys (exculding none objectKeys & titleBae key)
export function getAllSubjectsOptions() {
	return Object.entries(subjectsConfig)
		.filter(
			([key, value]) =>
				typeof value === objectDataType && key !== "titleBase"
		) // skip titleBase and non-object values
		.map(([key, value]) => ({
			value: key,
			text: value.optText ?? value.text,
		}));
}
