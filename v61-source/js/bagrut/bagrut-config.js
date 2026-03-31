// ~~~~~~~~~~~~~ \\
// Bagrut Config \\
// ~~~~~~~~~~~~~ \\

import {
	bagrutBaseText,
	bagrutExtFinalText,
	bagrutExtText,
} from "../configs/results-strs-config.js";
import {
	arielImg,
	bguImg,
	biuImg,
	defaultImg,
	defaultUni,
	haifaImg,
	hujiImg,
	tauImg,
	techImg,
} from "../utils/general-config.js";
import {
	checkMizrafSubjects,
	isFailureGrade,
	isFiveUnitsBonusSubject,
	isFiveUnitsHebrew,
	isFiveUnitsMath,
	isFiveUnitsSubject,
	isFourUnitsBonusSubject,
	isFourUnitsEnglish,
	isFourUnitsMath,
	isFourUnitsSubject,
	isGemer,
	isMizrafSubject,
	isNoBonusSubject,
} from "./utils/bagrut-general-rules.js";

///////////////////////////////////////////////////////////////////
/////////////////////// Subjects Constants ////////////////////////
///////////////////////////////////////////////////////////////////

// Mandatory Subjects Lists by EducationTypes
export const hebMandatorySubjects = [
	"עברית",
	"אנגלית",
	"היסטוריה",
	"אזרחות",
	"מתמטיקה",
];
export const arabMandatorySubjects = [
	"ערבית",
	"אנגלית",
	"היסטוריה",
	"אזרחות",
	"מתמטיקה",
];

// Ivrit Kasha Safa
const bible = ["תנך", 'תנ"ך'];
const physics = ["פיזיקה", "פיסיקה"];
const compSci = ["מדעי המחשב", "מחשבים", "מדמח", 'מדמ"ח'];
const toshba = [
	'תושב"ע',
	"תושבע",
	'תורה שבע"פ',
	"תורה שבעפ",
	"תורה שבעל פה",
	'תושבע"פ',
	"תושבעפ",
];

// Science & technology subjects
const sciSubjects = [...physics, ...["ביולוגיה", "כימיה"]];
const techSubjects = [
	...compSci,
	...[
		"בקרת מכונות",
		"אלקטרוניקה ומחשבים",
		"מדעי ההנדסה",
		"ביוטכנולוגיה",
		"מערכות ביוטכנולוגיה",
		"יישומי ביוטכנולוגיה",
	],
];

// Mizraf subject - for Technion average calculations
export const mizrafTechSubjects = [...sciSubjects, ...techSubjects];

// Subjects with a very high bonus score (25+ for 5 units)
const bonusSubjects = [
	...sciSubjects,
	...["אנגלית", "היסטוריה", "ספרות", ...bible],
];

///////////////////////////////////////////////////////////////////
/////////////////// Universities Constants ////////////////////////
///////////////////////////////////////////////////////////////////

// Default Scopes
export const defaultEducation = "default-education";
export const defaultSubject = "default-subject";

// Bagrut Calc Types Constants
export const bagrutAvgCalc = "BAGRUT-AVG-CALC";
export const bagrutSubjectCalc = "BAGRUT-SUBJECT-CALC";

// Universities Constants
export const tauBagrut = "TAU-BAGRUT";
export const hujiBagrut = "HUJI-BAGRUT";
export const techBagrut = "TECH-BAGRUT";
export const bguBagrut = "BGU-BAGRUT";
export const biuBagrut = "BIU-BAGRUT";
export const haifaBagrut = "HAIFA-BAGRUT";
export const arielBagrut = "ARIEL-BAGRUT";

// State Education Constants
const stateEducation = "STATE-EDUCATION";
const religiousStateEducation = "RELIGIOUS-STATE-EDUCATION";
const religiousStateEducationSecOpt = "RELIGIOUS-STATE-EDUCATION-SECOND-OPTION";
const arabStateEducation = "ARAB-STATE-EDUCATION";
const druzeStateEducation = "DRUZE-STATE-EDUCATION";
export const generalStateEducation = "GENERAL-STATE-EDUCATION";
const threeUnitsEducation = "THREE-UNITS-EDUCATION";
const fourUnitsEducation = "FOUR-UNITS-EDUCATION";
const fiveUnitsEducation = "FIVE-UNITS-EDUCATION";

///////////////////////////////////////////////////////////////////
/////////////////// Bagrut Average Constants //////////////////////
///////////////////////////////////////////////////////////////////

// Exam Types
export const examTypeGemer = "עבודה";
export const examTypeExam = "בחינה";

// Subjects
export const math = "מתמטיקה";
export const english = "אנגלית";
export const hebrew = "עברית";

// Units
export const unitsMinVal = 1;
export const unitsMaxVal = 10;
export const fiveUnits = 5;
export const fourUnits = 4;

// Bonuses
export const noBonus = 0;
export const thirtyFiveBonus = 35;
export const thirtyBonus = 30;
export const twentyFiveBonus = 25;
export const twentyBonus = 20;
export const fifteenBonus = 15;
export const twelvePlusHalfBonus = 12.5;
export const tenBonus = 10;
export const minBonusGrade = 60;

// Grades
export const noAverage = 0;
export const gradeMinVal = 0;
export const gradeMaxVal = 100;

// Other Constants
export const minMizrafSubjects = 2; // techBagrut checkMizraf()

// Dict Constants
export const funcKey = "func";

// Refs Constants
const tauRef = "https://go.tau.ac.il/he/ba/how-to-calculate";
const hujiRef = "https://info.huji.ac.il/reception-components/bagrut-bonus";
const techRef =
	"https://admissions.technion.ac.il/calculation-of-the-median-grade/";
const bguRef =
	"https://www.bgu.ac.il/media/0p3ppz0n/%D7%99%D7%93%D7%99%D7%A2%D7%95%D7%9F-%D7%AA%D7%95%D7%90%D7%A8-%D7%A8%D7%90%D7%A9%D7%95%D7%9F.pdf";
const biuRef =
	"https://www.biu.ac.il/registration-and-admission/information/general-admission-req/matriculation-calculation";
const haifaRef =
	"https://www.haifa.ac.il/%D7%97%D7%99%D7%A9%D7%95%D7%91-%D7%A6%D7%99%D7%95%D7%9F-%D7%A7%D7%91%D7%9C%D7%94-%D7%A1%D7%9B%D7%9D/";
const arielRef =
	"https://pniot.ariel.ac.il/projects/tzmm/NewCalcMark/CalcMark.asp";

// Bagrut Average Config
export const bagrutAvgConfig = {
	[defaultEducation]: {
		optText: "בחירת סוג תעודת בגרות",
		titleBase: "חישוב ממוצע בגרות",
	},
	[stateEducation]: {
		optText: "ממלכתי",
		titleBase: "חישוב ממוצע בגרות",
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				minUnitsRequired: 0,
				logoImage: defaultImg.cloneNode(),
				mandatorySubjects: [],
				bonusSubjects: [],
				noBonusSubjects: [],
				ref: {
					url: "",
					display: false,
				},
				dialog: {
					title: "",
					text: "",
					display: false,
				},
			},
			[tauBagrut]: {
				id: tauBagrut,
				optText: "תל אביב",
				name: "תל אביב",
				minUnitsRequired: 20,
				logoImage: tauImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects],
				bonusSubjects: [...bonusSubjects],
				noBonusSubjects: [],
				ref: {
					url: tauRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות תל אביב",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math or English → 12.5 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units) ||
							isFourUnitsEnglish(subject, units),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[hujiBagrut]: {
				id: hujiBagrut,
				optText: "העברית",
				name: "העברית",
				minUnitsRequired: 20,
				logoImage: hujiImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects],
				bonusSubjects: [
					...bonusSubjects,
					...compSci,
					...["מחשבת ישראל", "ערבית", "אזרחות", "מתמטיקה"],
				],
				noBonusSubjects: [],
				ref: {
					url: hujiRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות העברית",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+ (3 יח"ל מאושר רק לבעלי צרפתית 5 יח"ל בציון 60+)<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br><h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units, examType }) =>
							isFiveUnitsMath(subject, units, examType),
						bonus: thirtyFiveBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 15 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: fifteenBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[techBagrut]: {
				id: techBagrut,
				optText: "טכניון",
				name: "טכניון",
				minUnitsRequired: 21,
				logoImage: techImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects, ...bible, "ספרות"],
				bonusSubjects: [
					...bonusSubjects,
					...techSubjects,
					...["ערבית"],
				],
				noBonusSubjects: ["מערכות רפואיות"],
				ref: {
					url: techRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות הטכניון",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• ציון עובר במתמטיקה 4 יח"ל+<br>• 21 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• ספרות<br>• תנ"ך<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• דוגמאות למקצועות <u>ללא בונוס</u> בטכניון:<br>&nbsp;&nbsp;&nbsp;&nbsp;- מערכות רפואיות<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 30 bonus + triggers Mizraf check",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyBonus,
						postAction: () => checkMizrafSubjects(),
					},
					{
						name: "Mizraf Subject → triggers Mizraf check",
						condition: ({ subject, units, examType, grade }) =>
							isMizrafSubject(subject, units, examType, grade),
						bonus: null, // We'll return null/undefined to skip setting value here
						postAction: () => checkMizrafSubjects(),
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[bguBagrut]: {
				id: bguBagrut,
				optText: "בן גוריון",
				name: "בן גוריון",
				minUnitsRequired: 20,
				logoImage: bguImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects],
				bonusSubjects: [...bonusSubjects, ...compSci],
				noBonusSubjects: [],
				ref: {
					url: bguRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות בן גוריון",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 20 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units English → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsEnglish(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[biuBagrut]: {
				id: biuBagrut,
				optText: "בר אילן",
				name: "בר אילן",
				minUnitsRequired: 20,
				logoImage: biuImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects],
				bonusSubjects: [
					...bonusSubjects,
					...compSci,
					...toshba,
					...["תלמוד", "מחשבת ישראל", "אזרחות"],
				],
				noBonusSubjects: [],
				ref: {
					url: biuRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות בר אילן",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br><h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 12.5 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[haifaBagrut]: {
				id: haifaBagrut,
				optText: "חיפה",
				name: "חיפה",
				minUnitsRequired: 20,
				logoImage: haifaImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects, ...bible, "ספרות"],
				bonusSubjects: [...bonusSubjects],
				noBonusSubjects: [],
				ref: {
					url: haifaRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות חיפה",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+ (3 יח"ל מאושר רק לבעלי צרפתית/רוסית 4+ יח"ל בציון עובר)<br>• ציון עובר במתמטיקה 3 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• ספרות<br>• תנ"ך<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 20 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 20 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[arielBagrut]: {
				id: arielBagrut,
				optText: "אריאל",
				name: "אריאל",
				minUnitsRequired: 21,
				logoImage: arielImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects, ...bible],
				bonusSubjects: [], // Every Subject is a bonus Subject (except a few...)
				noBonusSubjects: ["אמהרית", "אמנות המחול", "קרמינולוגיה"],
				ref: {
					url: arielRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות אריאל",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 21 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• תנ"ך<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• דוגמאות למקצועות <u>ללא בונוס</u> באריאל:<br>&nbsp;&nbsp;&nbsp;&nbsp;- אמהרית<br>&nbsp;&nbsp;&nbsp;&nbsp;- אמנות המחול<br>&nbsp;&nbsp;&nbsp;&nbsp;- קרמינולוגיה<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 25 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyFiveBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "4 units English → 12.5 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsEnglish(subject, units),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "5 units Hebrew → 20 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsHebrew(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "General 5 units subject → 25 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
		},

		defaultTableSubjects: [
			{ subject: 'תנ"ך', units: 2, bonus: 0 },
			{ subject: "ספרות", units: 2, bonus: 0 },
			{ subject: "עברית", units: 2, bonus: 0 },
			{ subject: "היסטוריה", units: 2, bonus: 0 },
			{ subject: "אזרחות", units: 2, bonus: 0 },
			{ subject: "אנגלית", units: 5, bonus: 0 },
			{ subject: "מתמטיקה", units: 5, bonus: 0 },
		],
	},
	[religiousStateEducation]: {
		optText: "ממלכתי דתי",
		titleBase: "חישוב ממוצע בגרות",
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				minUnitsRequired: 0,
				logoImage: defaultImg.cloneNode(),
				mandatorySubjects: [],
				bonusSubjects: [],
				noBonusSubjects: [],
				ref: {
					url: "",
					display: false,
				},
				dialog: {
					title: "",
					text: "",
					display: false,
				},
			},
			[tauBagrut]: {
				id: tauBagrut,
				optText: "תל אביב",
				name: "תל אביב",
				minUnitsRequired: 20,
				logoImage: tauImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects],
				bonusSubjects: [...bonusSubjects],
				noBonusSubjects: [],
				ref: {
					url: tauRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות תל אביב",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math or English → 12.5 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units) ||
							isFourUnitsEnglish(subject, units),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[hujiBagrut]: {
				id: hujiBagrut,
				optText: "העברית",
				name: "העברית",
				minUnitsRequired: 20,
				logoImage: hujiImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects],
				bonusSubjects: [
					...bonusSubjects,
					...compSci,
					...["מחשבת ישראל", "ערבית", "אזרחות", "מתמטיקה"],
				],
				noBonusSubjects: [],
				ref: {
					url: hujiRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות העברית",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+ (3 יח"ל מאושר רק לבעלי צרפתית 5 יח"ל בציון 60+)<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br><h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units, examType }) =>
							isFiveUnitsMath(subject, units, examType),
						bonus: thirtyFiveBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 15 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: fifteenBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[techBagrut]: {
				id: techBagrut,
				optText: "טכניון",
				name: "טכניון",
				minUnitsRequired: 21,
				logoImage: techImg.cloneNode(),
				mandatorySubjects: [
					...hebMandatorySubjects,
					...bible,
					"ספרות",
					"מחשבת ישראל",
					"ספרות ומחשבת ישראל",
				],
				bonusSubjects: [
					...bonusSubjects,
					...techSubjects,
					...["ערבית"],
				],
				noBonusSubjects: ["מערכות רפואיות"],
				ref: {
					url: techRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות הטכניון",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• ציון עובר במתמטיקה 4 יח"ל+<br>• 21 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• ספרות ומחשבת ישראל<br>• תנ"ך<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• דוגמאות למקצועות <u>ללא בונוס</u> בטכניון:<br>&nbsp;&nbsp;&nbsp;&nbsp;- מערכות רפואיות<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 30 bonus + triggers Mizraf check",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyBonus,
						postAction: () => checkMizrafSubjects(),
					},
					{
						name: "Mizraf Subject → triggers Mizraf check",
						condition: ({ subject, units, examType, grade }) =>
							isMizrafSubject(subject, units, examType, grade),
						bonus: null, // We'll return null/undefined to skip setting value here
						postAction: () => checkMizrafSubjects(),
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[bguBagrut]: {
				id: bguBagrut,
				optText: "בן גוריון",
				name: "בן גוריון",
				minUnitsRequired: 20,
				logoImage: bguImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects],
				bonusSubjects: [...bonusSubjects, ...compSci],
				noBonusSubjects: [],
				ref: {
					url: bguRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות בן גוריון",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 20 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units English → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsEnglish(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[biuBagrut]: {
				id: biuBagrut,
				optText: "בר אילן",
				name: "בר אילן",
				minUnitsRequired: 20,
				logoImage: biuImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects],
				bonusSubjects: [
					...bonusSubjects,
					...compSci,
					...toshba,
					...["תלמוד", "מחשבת ישראל", "אזרחות"],
				],
				noBonusSubjects: [],
				ref: {
					url: biuRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות בר אילן",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br><h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 12.5 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[haifaBagrut]: {
				id: haifaBagrut,
				optText: "חיפה",
				name: "חיפה",
				minUnitsRequired: 20,
				logoImage: haifaImg.cloneNode(),
				mandatorySubjects: [
					...hebMandatorySubjects,
					...bible,
					"ספרות",
					"מחשבת ישראל",
					"ספרות ומחשבת ישראל",
				],
				bonusSubjects: [...bonusSubjects],
				noBonusSubjects: [],
				ref: {
					url: haifaRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות חיפה",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+ (3 יח"ל מאושר רק לבעלי צרפתית/רוסית 4+ יח"ל בציון עובר)<br>• ציון עובר במתמטיקה 3 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• ספרות ומחשבת ישראל<br>• תנ"ך<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 20 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 20 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[arielBagrut]: {
				id: arielBagrut,
				optText: "אריאל",
				name: "אריאל",
				minUnitsRequired: 21,
				logoImage: arielImg.cloneNode(),
				mandatorySubjects: [...hebMandatorySubjects, ...bible],
				bonusSubjects: [], // Every Subject is a bonus Subject (except a few...)
				noBonusSubjects: ["אמהרית", "אמנות המחול", "קרמינולוגיה"],
				ref: {
					url: arielRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות אריאל",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 21 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• תנ"ך<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• דוגמאות למקצועות <u>ללא בונוס</u> באריאל:<br>&nbsp;&nbsp;&nbsp;&nbsp;- אמהרית<br>&nbsp;&nbsp;&nbsp;&nbsp;- אמנות המחול<br>&nbsp;&nbsp;&nbsp;&nbsp;- קרמינולוגיה<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 25 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyFiveBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "4 units English → 12.5 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsEnglish(subject, units),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "5 units Hebrew → 20 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsHebrew(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "General 5 units subject → 25 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
		},

		defaultTableSubjects: [
			{ subject: 'תנ"ך', units: 3, bonus: 0 },
			{
				subject: [
					{ subject: "ספרות ומחשבת ישראל" },
					{ subject: "ספרות" },
					{ subject: "מחשבת ישראל" },
				],
				units: 2,
				bonus: 0,
			},
			{
				subject: [{ subject: 'תושבע"פ' }, { subject: "תלמוד" }],
				units: 3,
				bonus: 0,
			},
			{ subject: "עברית", units: 2, bonus: 0 },
			{ subject: "היסטוריה", units: 2, bonus: 0 },
			{ subject: "אזרחות", units: 2, bonus: 0 },
			{ subject: "אנגלית", units: 5, bonus: 0 },
			{ subject: "מתמטיקה", units: 5, bonus: 0 },
		],
	},
	[arabStateEducation]: {
		optText: "ערבי",
		titleBase: "חישוב ממוצע בגרות",
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				minUnitsRequired: 0,
				logoImage: defaultImg.cloneNode(),
				mandatorySubjects: [],
				bonusSubjects: [],
				noBonusSubjects: [],
				ref: {
					url: "",
					display: false,
				},
				dialog: {
					title: "",
					text: "",
					display: false,
				},
			},
			[tauBagrut]: {
				id: tauBagrut,
				optText: "תל אביב",
				name: "תל אביב",
				minUnitsRequired: 20,
				logoImage: tauImg.cloneNode(),
				mandatorySubjects: [...arabMandatorySubjects],
				bonusSubjects: [...bonusSubjects, "ערבית"],
				noBonusSubjects: [],
				ref: {
					url: tauRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות תל אביב",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• ערבית<br>• אזרחות<br>• היסטוריה<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math or English → 12.5 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units) ||
							isFourUnitsEnglish(subject, units),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[hujiBagrut]: {
				id: hujiBagrut,
				optText: "העברית",
				name: "העברית",
				minUnitsRequired: 20,
				logoImage: hujiImg.cloneNode(),
				mandatorySubjects: [...arabMandatorySubjects],
				bonusSubjects: [
					...bonusSubjects,
					...compSci,
					...["מחשבת ישראל", "ערבית", "אזרחות", "מתמטיקה"],
				],
				noBonusSubjects: [],
				ref: {
					url: hujiRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות העברית",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+ (3 יח"ל מאושר רק לבעלי צרפתית 5 יח"ל בציון 60+)<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• ערבית<br>• אזרחות<br>• היסטוריה<br><h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units, examType }) =>
							isFiveUnitsMath(subject, units, examType),
						bonus: thirtyFiveBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 15 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: fifteenBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[techBagrut]: {
				id: techBagrut,
				optText: "טכניון",
				name: "טכניון",
				minUnitsRequired: 21,
				logoImage: techImg.cloneNode(),
				mandatorySubjects: [
					...arabMandatorySubjects,
					"עברית",
					"תרבות ומורשת איסלאם",
					"מורשת ודת נוצרית",
				],
				bonusSubjects: [
					...bonusSubjects,
					...techSubjects,
					...["ערבית", "עברית"],
				],
				noBonusSubjects: ["מערכות רפואיות"],
				ref: {
					url: techRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות הטכניון",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• ציון עובר במתמטיקה 4 יח"ל+<br>• 21 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• תרבות ומורשת איסלאם/מורשת ודת נוצרית<br>• ערבית<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• דוגמאות למקצועות <u>ללא בונוס</u> בטכניון:<br>&nbsp;&nbsp;&nbsp;&nbsp;- מערכות רפואיות<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 30 bonus + triggers Mizraf check",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyBonus,
						postAction: () => checkMizrafSubjects(),
					},
					{
						name: "Mizraf Subject → triggers Mizraf check",
						condition: ({ subject, units, examType, grade }) =>
							isMizrafSubject(subject, units, examType, grade),
						bonus: null, // We'll return null/undefined to skip setting value here
						postAction: () => checkMizrafSubjects(),
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[bguBagrut]: {
				id: bguBagrut,
				optText: "בן גוריון",
				name: "בן גוריון",
				minUnitsRequired: 20,
				logoImage: bguImg.cloneNode(),
				mandatorySubjects: [...arabMandatorySubjects],
				bonusSubjects: [...bonusSubjects, ...compSci, "ערבית", "עברית"],
				noBonusSubjects: [],
				ref: {
					url: bguRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות בן גוריון",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• ערבית<br>• אזרחות<br>• היסטוריה<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 20 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units English → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsEnglish(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[biuBagrut]: {
				id: biuBagrut,
				optText: "בר אילן",
				name: "בר אילן",
				minUnitsRequired: 20,
				logoImage: biuImg.cloneNode(),
				mandatorySubjects: [...arabMandatorySubjects],
				bonusSubjects: [...bonusSubjects, ...compSci, ...["אזרחות"]],
				noBonusSubjects: [],
				ref: {
					url: biuRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות בר אילן",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• ערבית<br>• אזרחות<br>• היסטוריה<br><h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 12.5 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[haifaBagrut]: {
				id: haifaBagrut,
				optText: "חיפה",
				name: "חיפה",
				minUnitsRequired: 20,
				logoImage: haifaImg.cloneNode(),
				mandatorySubjects: [
					...arabMandatorySubjects,
					"עברית",
					"תרבות ומורשת איסלאם",
					"מורשת ודת נוצרית",
				],
				bonusSubjects: [
					...bonusSubjects,
					...techSubjects,
					...["ערבית", "עברית"],
				],
				noBonusSubjects: [],
				ref: {
					url: haifaRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות חיפה",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+ (3 יח"ל מאושר רק לבעלי צרפתית/רוסית 4+ יח"ל בציון עובר)<br>• ציון עובר במתמטיקה 3 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• תרבות ומורשת איסלאם/מורשת ודת נוצרית<br>• ערבית<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 20 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 20 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[arielBagrut]: {
				id: arielBagrut,
				optText: "אריאל",
				name: "אריאל",
				minUnitsRequired: 21,
				logoImage: arielImg.cloneNode(),
				mandatorySubjects: [
					...arabMandatorySubjects,
					"עברית",
					"תרבות ומורשת איסלאם",
					"מורשת ודת נוצרית",
				],
				bonusSubjects: [], // Every Subject is a bonus Subject (except a few...)
				noBonusSubjects: ["אמהרית", "אמנות המחול", "קרמינולוגיה"],
				ref: {
					url: arielRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות אריאל",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 21 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• תרבות ומורשת איסלאם/מורשת ודת נוצרית<br>• ערבית<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• דוגמאות למקצועות <u>ללא בונוס</u> באריאל:<br>&nbsp;&nbsp;&nbsp;&nbsp;- אמהרית<br>&nbsp;&nbsp;&nbsp;&nbsp;- אמנות המחול<br>&nbsp;&nbsp;&nbsp;&nbsp;- קרמינולוגיה<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 25 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyFiveBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "4 units English → 12.5 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsEnglish(subject, units),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "5 units Hebrew → 20 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsHebrew(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "General 5 units subject → 25 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
		},

		defaultTableSubjects: [
			{ subject: "ערבית", units: 3, bonus: 0 },
			{ subject: "עברית", units: 3, bonus: 0 },
			{ subject: "היסטוריה", units: 2, bonus: 0 },
			{
				subject: [
					{ subject: "תרבות ומורשת איסלאם" },
					{ subject: "מורשת ודת נוצרית" },
				],
				units: 1,
				bonus: 0,
			},
			{ subject: "אזרחות", units: 2, bonus: 0 },
			{ subject: "אנגלית", units: 5, bonus: 0 },
			{ subject: "מתמטיקה", units: 5, bonus: 0 },
		],
	},
	[druzeStateEducation]: {
		optText: "דרוזי",
		titleBase: "חישוב ממוצע בגרות",
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				minUnitsRequired: 0,
				logoImage: defaultImg.cloneNode(),
				mandatorySubjects: [],
				bonusSubjects: [],
				noBonusSubjects: [],
				ref: {
					url: "",
					display: false,
				},
				dialog: {
					title: "",
					text: "",
					display: false,
				},
			},
			[tauBagrut]: {
				id: tauBagrut,
				optText: "תל אביב",
				name: "תל אביב",
				minUnitsRequired: 20,
				logoImage: tauImg.cloneNode(),
				mandatorySubjects: [...arabMandatorySubjects],
				bonusSubjects: [...bonusSubjects, "ערבית"],
				noBonusSubjects: [],
				ref: {
					url: tauRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות תל אביב",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• ערבית<br>• אזרחות<br>• היסטוריה<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math or English → 12.5 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units) ||
							isFourUnitsEnglish(subject, units),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[hujiBagrut]: {
				id: hujiBagrut,
				optText: "העברית",
				name: "העברית",
				minUnitsRequired: 20,
				logoImage: hujiImg.cloneNode(),
				mandatorySubjects: [...arabMandatorySubjects],
				bonusSubjects: [
					...bonusSubjects,
					...compSci,
					...["מחשבת ישראל", "ערבית", "אזרחות", "מתמטיקה"],
				],
				noBonusSubjects: [],
				ref: {
					url: hujiRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות העברית",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+ (3 יח"ל מאושר רק לבעלי צרפתית 5 יח"ל בציון 60+)<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• ערבית<br>• אזרחות<br>• היסטוריה<br><h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units, examType }) =>
							isFiveUnitsMath(subject, units, examType),
						bonus: thirtyFiveBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 15 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: fifteenBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[techBagrut]: {
				id: techBagrut,
				optText: "טכניון",
				name: "טכניון",
				minUnitsRequired: 21,
				logoImage: techImg.cloneNode(),
				mandatorySubjects: [
					...arabMandatorySubjects,
					"עברית",
					"תרבות ומורשת דרוזית",
				],
				bonusSubjects: [
					...bonusSubjects,
					...techSubjects,
					...["ערבית", "עברית"],
				],
				noBonusSubjects: ["מערכות רפואיות"],
				ref: {
					url: techRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות הטכניון",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• ציון עובר במתמטיקה 4 יח"ל+<br>• 21 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• תרבות ומורשת דרוזית<br>• ערבית<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• דוגמאות למקצועות <u>ללא בונוס</u> בטכניון:<br>&nbsp;&nbsp;&nbsp;&nbsp;- מערכות רפואיות<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 30 bonus + triggers Mizraf check",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyBonus,
						postAction: () => checkMizrafSubjects(),
					},
					{
						name: "Mizraf Subject → triggers Mizraf check",
						condition: ({ subject, units, examType, grade }) =>
							isMizrafSubject(subject, units, examType, grade),
						bonus: null, // We'll return null/undefined to skip setting value here
						postAction: () => checkMizrafSubjects(),
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[bguBagrut]: {
				id: bguBagrut,
				optText: "בן גוריון",
				name: "בן גוריון",
				minUnitsRequired: 20,
				logoImage: bguImg.cloneNode(),
				mandatorySubjects: [...arabMandatorySubjects],
				bonusSubjects: [...bonusSubjects, ...compSci, "עברית"],
				noBonusSubjects: [],
				ref: {
					url: bguRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות בן גוריון",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• ערבית<br>• אזרחות<br>• היסטוריה<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 20 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units English → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsEnglish(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[biuBagrut]: {
				id: biuBagrut,
				optText: "בר אילן",
				name: "בר אילן",
				minUnitsRequired: 20,
				logoImage: biuImg.cloneNode(),
				mandatorySubjects: [...arabMandatorySubjects],
				bonusSubjects: [...bonusSubjects, ...compSci, ...["אזרחות"]],
				noBonusSubjects: [],
				ref: {
					url: biuRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות בר אילן",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• ערבית<br>• אזרחות<br>• היסטוריה<br><h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 12.5 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[haifaBagrut]: {
				id: haifaBagrut,
				optText: "חיפה",
				name: "חיפה",
				minUnitsRequired: 20,
				logoImage: haifaImg.cloneNode(),
				mandatorySubjects: [
					...arabMandatorySubjects,
					"עברית",
					"תרבות ומורשת דרוזית",
				],
				bonusSubjects: [
					...bonusSubjects,
					...techSubjects,
					...["ערבית", "עברית"],
				],
				noBonusSubjects: [],
				ref: {
					url: haifaRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות חיפה",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+ (3 יח"ל מאושר רק לבעלי צרפתית/רוסית 4+ יח"ל בציון עובר)<br>• ציון עובר במתמטיקה 3 יח"ל+<br>• 20 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• תרבות ומורשת דרוזית<br>• ערבית<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 20 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 20 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "5 units bonus subject → 25 bonus",
						condition: ({ subject, units }, config) =>
							isFiveUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyFiveBonus,
					},
					{
						name: "4 units bonus subject → 20 bonus",
						condition: ({ subject, units }, config) =>
							isFourUnitsBonusSubject(
								subject,
								units,
								config.bonusSubjects
							),
						bonus: twentyBonus,
					},
					{
						name: "General 5 units subject → 20 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
			[arielBagrut]: {
				id: arielBagrut,
				optText: "אריאל",
				name: "אריאל",
				minUnitsRequired: 21,
				logoImage: arielImg.cloneNode(),
				mandatorySubjects: [
					...arabMandatorySubjects,
					"עברית",
					"תרבות ומורשת דרוזית",
				],
				bonusSubjects: [], // Every Subject is a bonus Subject (except a few...)
				noBonusSubjects: ["אמהרית", "אמנות המחול", "קרמינולוגיה"],
				ref: {
					url: arielRef,
					display: true,
				},
				dialog: {
					title: "ממוצע בגרות אריאל",
					text: '<h3><u>דרישות מינימליות</u>:</h3>• זכאות לבגרות<br>• ציון עובר באנגלית 4 יח"ל+<br>• 21 יח"ל לפחות<h3><u>מקצועות כלולים בחישוב (תמיד)</u>:</h3>• מתמטיקה<br>• אנגלית<br>• עברית<br>• אזרחות<br>• היסטוריה<br>• תרבות ומורשת דרוזית<br>• ערבית<h3><u>הערות נוספות</u>:</h3>• <u>לא בהכרח</u> כל מקצוע מורחב מזכה בבונוס.<br>• יש לוודא בקישור מטה כי <u>המקצוע מזכה בבונוס</u>.<br>• דוגמאות למקצועות <u>ללא בונוס</u> באריאל:<br>&nbsp;&nbsp;&nbsp;&nbsp;- אמהרית<br>&nbsp;&nbsp;&nbsp;&nbsp;- אמנות המחול<br>&nbsp;&nbsp;&nbsp;&nbsp;- קרמינולוגיה<br>• <u>אין להוסיף לחישוב</u> מקצוע שלא מזכה בבונוס!',
					display: true,
				},
				bonusRules: [
					{
						name: "Failing grade → no bonus",
						condition: ({ subject, grade }, config) =>
							isNoBonusSubject(subject, config.noBonusSubjects) ||
							isFailureGrade(grade),
						bonus: noBonus,
					},
					{
						name: "Gemer → 25 bonus",
						condition: ({ examType, units }) =>
							isGemer(examType, units),
						bonus: twentyFiveBonus,
					},
					{
						name: "5 units Math → 35 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsMath(subject, units),
						bonus: thirtyFiveBonus,
					},
					{
						name: "4 units Math → 15 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsMath(subject, units),
						bonus: fifteenBonus,
					},
					{
						name: "4 units English → 12.5 bonus",
						condition: ({ subject, units }) =>
							isFourUnitsEnglish(subject, units),
						bonus: twelvePlusHalfBonus,
					},
					{
						name: "5 units Hebrew → 20 bonus",
						condition: ({ subject, units }) =>
							isFiveUnitsHebrew(subject, units),
						bonus: twentyBonus,
					},
					{
						name: "General 5 units subject → 25 bonus",
						condition: ({ units }) => isFiveUnitsSubject(units),
						bonus: twentyFiveBonus,
					},
					{
						name: "General 4 units subject → 10 bonus",
						condition: ({ units }) => isFourUnitsSubject(units),
						bonus: tenBonus,
					},
				],
			},
		},

		defaultTableSubjects: [
			{ subject: "ערבית", units: 3, bonus: 0 },
			{ subject: "עברית", units: 3, bonus: 0 },
			{ subject: "היסטוריה", units: 2, bonus: 0 },
			{
				subject: "תרבות ומורשת דרוזית",
				units: 1,
				bonus: 0,
			},
			{ subject: "אזרחות", units: 2, bonus: 0 },
			{ subject: "אנגלית", units: 5, bonus: 0 },
			{ subject: "מתמטיקה", units: 5, bonus: 0 },
		],
	},
};

///////////////////////////////////////////////////////////////////
//////////// Bagrut Subjects Final Grade Constants ////////////////
///////////////////////////////////////////////////////////////////

// Calc Types
export const flatCalc = "flat";
export const groupedCalc = "grouped";
export const subjectBase = "בסיס";
export const subjectExt = "השלמה";
export const subjFullExt = "הרחבה";

// Bagrut Subjects Final Grade Config
export const subjectsConfig = {
	titleBase: "חישוב ציון סופי ב",
	[defaultSubject]: {
		optText: "בחירת מקצוע",
		text: "מקצוע",
	},
	HISTORY: {
		text: "היסטוריה",
		[stateEducation]: {
			value: stateEducation,
			text: "ממלכתי",
			type: "grouped",
			groups: [
				{
					groupLabel: 'שאלוני בסיס (2 יח"ל)',
					groupWeight: 2,
					resultsText: bagrutBaseText.format(2),
					fields: [
						{
							id: "22262",
							label: "שאלון 22262 (30%)",
							placeholder: "ציון 22262 (30%)",
							weight: 0.3,
						},
						{
							id: "22261",
							label: "שאלון 22261 (70%)",
							placeholder: "ציון 22261 (70%)",
							weight: 0.7,
						},
					],
				},
				{
					groupLabel: 'שאלוני הרחבה (3 יח"ל)',
					groupWeight: 3,
					resultsText: bagrutExtText.format(3),
					fields: [
						{
							id: "22382",
							label: "שאלון 22382 (30%)",
							placeholder: "ציון 22382 (30%)",
							weight: 0.3,
						},
						{
							id: "22381",
							label: "שאלון 22381 (70%)",
							placeholder: "ציון 22381 (70%)",
							weight: 0.7,
						},
					],
				},
			],
			finalCombineMethod: "weighted",
		},
		[religiousStateEducation]: {
			value: religiousStateEducation,
			text: "ממלכתי דתי",
			type: "grouped",
			groups: [
				{
					groupLabel: 'שאלוני בסיס (2 יח"ל)',
					groupWeight: 2,
					resultsText: bagrutBaseText.format(2),
					fields: [
						{
							id: "29282",
							label: "שאלון 29282 (30%)",
							placeholder: "ציון 29282 (30%)",
							weight: 0.3,
						},
						{
							id: "29281",
							label: "שאלון 29281 (70%)",
							placeholder: "ציון 29281 (70%)",
							weight: 0.7,
						},
					],
				},
				{
					groupLabel: 'שאלוני הרחבה (3 יח"ל)',
					groupWeight: 3,
					resultsText: bagrutExtText.format(3),
					fields: [
						{
							id: "29382",
							label: "שאלון 29382 (30%)",
							placeholder: "ציון 29382 (30%)",
							weight: 0.3,
						},
						{
							id: "29381",
							label: "שאלון 29381 (70%)",
							placeholder: "ציון 29381 (70%)",
							weight: 0.7,
						},
					],
				},
			],
			finalCombineMethod: "weighted",
		},
	},
	BIBLE: {
		text: 'תנ"ך',
		[stateEducation]: {
			value: stateEducation,
			text: "ממלכתי",
			type: "grouped",
			groups: [
				{
					groupLabel: 'שאלוני בסיס (2 יח"ל)',
					groupWeight: 2,
					resultsText: bagrutBaseText.format(2),
					fields: [
						{
							id: "1262",
							label: "שאלון 1262 (30%)",
							placeholder: "ציון 1262 (30%)",
							weight: 0.3,
						},
						{
							id: "1261",
							label: "שאלון 1261 (70%)",
							placeholder: "ציון 1261 (70%)",
							weight: 0.7,
						},
					],
				},
				{
					groupLabel: 'שאלוני הרחבה (3 יח"ל)',
					groupWeight: 3,
					resultsText: bagrutExtText.format(3),
					fields: [
						{
							id: "1361",
							label: "שאלון 1361 (30%)",
							placeholder: "ציון 1361 (30%)",
							weight: 0.3,
						},
						{
							id: "1362",
							label: "שאלון 1362 (70%)",
							placeholder: "ציון 1362 (70%)",
							weight: 0.7,
						},
					],
				},
			],
			finalCombineMethod: "weighted",
		},
		[religiousStateEducation]: {
			value: religiousStateEducation,
			text: "ממלכתי דתי - אופציה א",
			type: "grouped",
			groups: [
				{
					groupLabel: 'שאלוני בסיס (3 יח"ל)',
					groupWeight: 3,
					resultsText: bagrutBaseText.format(3),
					fields: [
						{
							id: "2382",
							label: "שאלון 2104/2383/2382 (30%)",
							placeholder: "ציון 2104/2383/2382 (30%)",
							weight: 0.3,
						},
						{
							id: "2381",
							label: "שאלון 2112/2381 (35%)",
							placeholder: "ציון 2112/2381 (35%)",
							weight: 0.35,
						},
						{
							id: "2371",
							label: "שאלון 2103/2371 (35%)",
							placeholder: "ציון 2103/2371 (35%)",
							weight: 0.35,
						},
					],
				},
				{
					groupLabel: 'שאלוני הרחבה (2 יח"ל)',
					groupWeight: 2,
					resultsText: bagrutExtText.format(2),
					fields: [
						{
							id: "2572",
							label: "שאלון 2572 (100%)",
							placeholder: "ציון 2572 (100%)",
							weight: 1,
						},
					],
				},
			],
			finalCombineMethod: "weighted",
		},
		[religiousStateEducationSecOpt]: {
			value: religiousStateEducationSecOpt,
			text: "ממלכתי דתי - אופציה ב",
			type: "grouped",
			groups: [
				{
					groupLabel: 'שאלוני בסיס (3 יח"ל)',
					groupWeight: 3,
					resultsText: bagrutBaseText.format(3),
					fields: [
						{
							id: "2382",
							label: "שאלון 2104/2383/2382 (30%)",
							placeholder: "ציון 2104/2383/2382 (30%)",
							weight: 0.3,
						},
						{
							id: "2585",
							label: "שאלון 2115/2581/2585 (35%)",
							placeholder: "ציון 2115/2581/2585 (35%)",
							weight: 0.35,
						},
						{
							id: "2575",
							label: "שאלון 2212/2571/2575 (35%)",
							placeholder: "ציון 2212/2571/2575 (35%)",
							weight: 0.35,
						},
					],
				},
				{
					groupLabel: 'שאלוני הרחבה (2 יח"ל)',
					groupWeight: 2,
					resultsText: bagrutExtText.format(2),
					fields: [
						{
							id: "2551",
							label: "שאלון 2551 (60%)",
							placeholder: "ציון 2551 (60%)",
							weight: 0.6,
						},
						{
							id: "2572",
							label: "שאלון 2562/2563 (40%)",
							placeholder: "ציון 2562/2563 (40%)",
							weight: 0.4,
						},
					],
				},
			],
			finalCombineMethod: "weighted",
		},
	},
	LITERATURE: {
		text: "ספרות",
		[stateEducation]: {
			value: stateEducation,
			text: "ממלכתי",
			type: "grouped",
			groups: [
				{
					groupLabel: 'שאלוני בסיס (2 יח"ל)',
					groupWeight: 2,
					resultsText: bagrutBaseText.format(2),
					fields: [
						{
							id: "8282",
							label: "שאלון 8282 (30%)",
							placeholder: "ציון 8282 (30%)",
							weight: 0.3,
						},
						{
							id: "8281",
							label: "שאלון 8281 (70%)",
							placeholder: "ציון 8281 (70%)",
							weight: 0.7,
						},
					],
				},
				{
					groupLabel: 'שאלוני הרחבה (3 יח"ל)',
					groupWeight: 3,
					resultsText: bagrutExtText.format(3),
					fields: [
						{
							id: "8382",
							label: "שאלון 8382 (30%)",
							placeholder: "ציון 8382 (30%)",
							weight: 0.3,
						},
						{
							id: "8381",
							label: "שאלון 8381 (70%)",
							placeholder: "ציון 8381 (70%)",
							weight: 0.7,
						},
					],
				},
			],
			finalCombineMethod: "weighted",
		},
		[religiousStateEducation]: {
			value: religiousStateEducation,
			text: "ממלכתי דתי",
			type: "grouped",
			groups: [
				{
					groupLabel: 'שאלון בסיס (2 יח"ל)',
					groupWeight: 2,
					resultsText: bagrutBaseText.format(2),
					fields: [
						{
							id: "9182",
							label: "שאלון ספרות 9182 (50%)",
							placeholder: "ציון ספרות 9182 (50%)",
							weight: 0.5,
						},
						{
							id: "38182",
							label: "שאלון מחשבת ישראל 38182 (50%)",
							placeholder: "ציון מחשבת ישראל 38182 (50%)",
							weight: 0.5,
						},
					],
				},
				{
					groupLabel: 'שאלוני הרחבה (3 יח"ל)',
					groupWeight: 3,
					resultsText: bagrutExtText.format(3),
					fields: [
						{
							id: "9382",
							label: "שאלון 9382 (30%)",
							placeholder: "ציון 9382 (30%)",
							weight: 0.3,
						},
						{
							id: "9392",
							label: "שאלון 9392 (70%)",
							placeholder: "ציון 9392 (70%)",
							weight: 0.7,
						},
					],
				},
			],
			finalCombineMethod: "weighted",
		},
	},
	HEBREW: {
		text: "לשון",
		[generalStateEducation]: {
			value: generalStateEducation,
			text: "כללי",
			type: "flat",
			resultsText: bagrutBaseText.format(2),
			fields: [
				{
					id: "1282",
					label: "שאלון 1282 (30%)",
					placeholder: "ציון 1282 (30%)",
					weight: 0.3,
				},
				{
					id: "1281",
					label: "שאלון 1281 (70%)",
					placeholder: "ציון 1281 (70%)",
					weight: 0.7,
				},
			],
		},
	},
	CIVICS: {
		text: "אזרחות",
		[generalStateEducation]: {
			value: generalStateEducation,
			text: "כללי",
			type: "grouped",
			groups: [
				{
					groupLabel: 'שאלוני בסיס (2 יח"ל)',
					groupWeight: 2,
					resultsText: bagrutBaseText.format(2),
					fields: [
						{
							id: "34282",
							label: "שאלון 34282 (20%)",
							placeholder: "ציון 34282 (20%)",
							weight: 0.2,
						},
						{
							id: "34281",
							label: "שאלון 34281 (80%)",
							placeholder: "ציון 34281 (80%)",
							weight: 0.8,
						},
					],
				},
				{
					groupLabel: 'שאלוני הרחבה (3 יח"ל)',
					groupWeight: 3,
					resultsText: bagrutExtText.format(3),
					fields: [
						{
							id: "34371",
							label: "שאלון 34371 (30%)",
							placeholder: "ציון 34371 (30%)",
							weight: 0.3,
						},
						{
							id: "34372",
							label: "שאלון 34372 (70%)",
							placeholder: "ציון 34372 (70%)",
							weight: 0.7,
						},
					],
				},
			],
			finalCombineMethod: "weighted",
		},
	},
	ENGLISH: {
		text: "אנגלית",
		[fiveUnitsEducation]: {
			value: fiveUnitsEducation,
			text: '5 יח"ל',
			type: "flat",
			resultsText: bagrutExtFinalText.format(5),
			fields: [
				{
					id: "16585",
					label: "בחינה בעל פה 16585 (20%)",
					placeholder: "ציון בחינה בעל פה 16585 (20%)",
					weight: 0.2,
				},
				{
					id: "16471",
					label: "\u200F16471 (27%) E שאלון",
					placeholder: "\u200F16471 (27%) E ציון",
					weight: 0.27,
				},
				{
					id: "16584",
					label: "\u200F16584 (26%) F שאלון",
					placeholder: "\u200F16584 (26%) F ציון",
					weight: 0.26,
				},
				{
					id: "16582",
					label: "\u200F16582 (27%) G שאלון",
					placeholder: "\u200F16582 (27%) G ציון",
					weight: 0.27,
				},
			],
		},
		[fourUnitsEducation]: {
			value: fourUnitsEducation,
			text: '4 יח"ל',
			type: "flat",
			resultsText: bagrutExtFinalText.format(4),
			fields: [
				{
					id: "16485",
					label: "בחינה בעל פה 16485 (20%)",
					placeholder: "ציון בחינה בעל פה 16485 (20%)",
					weight: 0.2,
				},
				{
					id: "16382",
					label: "\u200F16382 (27%) C שאלון",
					placeholder: "\u200F16382 (27%) C ציון",
					weight: 0.27,
				},
				{
					id: "16483",
					label: "\u200F16483 (26%) D שאלון",
					placeholder: "\u200F16483 (26%) D ציון",
					weight: 0.26,
				},
				{
					id: "16471",
					label: "\u200F16471 (27%) E שאלון",
					placeholder: "\u200F16471 (27%) E ציון",
					weight: 0.27,
				},
			],
		},
		[threeUnitsEducation]: {
			value: threeUnitsEducation,
			text: '3 יח"ל',
			type: "flat",
			resultsText: bagrutExtFinalText.format(3),
			fields: [
				{
					id: "16385",
					label: "בחינה בעל פה 16385 (20%)",
					placeholder: "ציון בחינה בעל פה 16385 (20%)",
					weight: 0.2,
				},
				{
					id: "16381",
					label: "\u200F16381 (27%) A שאלון",
					placeholder: "\u200F16381 (27%) A ציון",
					weight: 0.27,
				},
				{
					id: "16383",
					label: "\u200F16383 (26%) B שאלון",
					placeholder: "\u200F16383 (26%) B ציון",
					weight: 0.26,
				},
				{
					id: "16382",
					label: "\u200F16382 (27%) C שאלון",
					placeholder: "\u200F16382 (27%) C ציון",
					weight: 0.27,
				},
			],
		},
	},
	"ENGLISH-NO-ORAL": {
		text: 'אנגלית - ללא בע"פ',
		[generalStateEducation]: {
			value: generalStateEducation,
			text: "כללי",
			type: "flat",
			resultsText: bagrutExtFinalText.format("?"),
			fields: [
				{
					id: "engFirst",
					label: "שאלון ראשון (33%)",
					placeholder: "ציון שאלון ראשון (33%)",
					weight: 0.33,
				},
				{
					id: "engSecond",
					label: "שאלון שני (33%)",
					placeholder: "ציון שאלון שני (33%)",
					weight: 0.33,
				},
				{
					id: "engThird",
					label: "שאלון שלישי (33%)",
					placeholder: "ציון שאלון שלישי (33%)",
					weight: 0.33,
				},
			],
		},
	},
	MATH: {
		text: "מתמטיקה",
		[fiveUnitsEducation]: {
			value: fiveUnitsEducation,
			text: '5 יח"ל',
			type: "flat",
			resultsText: bagrutExtFinalText.format(5),
			fields: [
				{
					id: "806",
					label: "שאלון 806/35581/35571 (60%)",
					placeholder: "ציון 806/35581/35571 (60%)",
					weight: 0.6,
				},
				{
					id: "807",
					label: "שאלון 807/35582/35572 (40%)",
					placeholder: "ציון 807/35582/35572 (40%)",
					weight: 0.4,
				},
			],
		},
		[fourUnitsEducation]: {
			value: fourUnitsEducation,
			text: '4 יח"ל',
			type: "flat",
			resultsText: bagrutExtFinalText.format(4),
			fields: [
				{
					id: "804",
					label: "שאלון 804/35481/35471 (65%)",
					placeholder: "ציון 804/35481/35471 (65%)",
					weight: 0.65,
				},
				{
					id: "807",
					label: "שאלון 805/35482/35472 (35%)",
					placeholder: "ציון 805/35482/35472 (35%)",
					weight: 0.35,
				},
			],
		},
		[threeUnitsEducation]: {
			value: threeUnitsEducation,
			text: '3 יח"ל',
			type: "flat",
			resultsText: bagrutExtFinalText.format(3),
			fields: [
				{
					id: "801",
					label: "שאלון 801/35182/35172 (25%)",
					placeholder: "ציון 801/35182/35172 (25%)",
					weight: 0.25,
				},
				{
					id: "802",
					label: "שאלון 802/35381/35371 (35%)",
					placeholder: "ציון 802/35381/35371 (35%)",
					weight: 0.35,
				},
				{
					id: "803",
					label: "שאלון 803/35382/35372 (40%)",
					placeholder: "ציון 803/35382/35372 (40%)",
					weight: 0.4,
				},
			],
		},
	},
	PHYSICS: {
		text: "פיזיקה",
		[generalStateEducation]: {
			value: generalStateEducation,
			text: "כללי",
			type: "flat",
			resultsText: bagrutExtFinalText.format(5),
			fields: [
				{
					id: "36386",
					label: "בחינת מעבדה 36386 (15%)",
					placeholder: "ציון בחינת מעבדה 36386 (15%)",
					weight: 0.15,
				},
				{
					id: "36361",
					label: "שאלון מכניקה 36361 (30%)",
					placeholder: "ציון מכניקה 36361 (30%)",
					weight: 0.3,
				},
				{
					id: "36371",
					label: "שאלון חשמל 36371 (25%)",
					placeholder: "ציון חשמל 36371 (25%)",
					weight: 0.25,
				},
				{
					id: "crina",
					label: "(30%) שאלון קרינה וחומר/חלופה אחרת",
					placeholder: "ציון קרינה וחומר/חלופה אחרת (30%)",
					weight: 0.3,
				},
			],
		},
	},
	CHEMISTRY: {
		text: "כימיה",
		[generalStateEducation]: {
			value: generalStateEducation,
			text: "כללי",
			type: "flat",
			resultsText: bagrutExtFinalText.format(5),
			fields: [
				{
					id: "37388",
					label: "בחינת מעבדה 37388/37376 (15%)",
					placeholder: "ציון בחינת מעבדה 37388/37376 (15%)",
					weight: 0.15,
				},
				{
					id: "37381",
					label: "שאלון חיצוני 37381/37387 (55%)",
					placeholder: "ציון חיצוני 37381/37387 (55%)",
					weight: 0.55,
				},
				{
					id: "37283",
					label: "שאלון פנימי 37283 (30%)",
					placeholder: "ציון פנימי 37283 (30%)",
					weight: 0.3,
				},
			],
		},
	},
	BIOLOGY: {
		text: "ביולוגיה",
		[generalStateEducation]: {
			value: generalStateEducation,
			text: "כללי",
			type: "flat",
			resultsText: bagrutExtFinalText.format(5),
			fields: [
				{
					id: "43386",
					label: "בחינת מעבדה 43386 (15%)",
					placeholder: "ציון בחינת מעבדה 43386 (15%)",
					weight: 0.15,
				},
				{
					id: "43381",
					label: "שאלון חיצוני 43381 (55%)",
					placeholder: "ציון חיצוני 43381 (55%)",
					weight: 0.55,
				},
				{
					id: "43283",
					label: "שאלון ביוחקר 43283 (30%)",
					placeholder: "ציון ביוחקר 43283 (30%)",
					weight: 0.3,
				},
			],
		},
	},
	"GENERAL-SUBJECT": {
		text: "מקצוע מורחב אחר",
		[generalStateEducation]: {
			value: generalStateEducation,
			text: "כללי",
			type: "flat",
			resultsText: bagrutExtFinalText.format(5),
			fields: [
				{
					id: "alt",
					label: "הערכה חלופית (30%)",
					placeholder: "ציון הערכה חלופית (30%)",
					weight: 0.3,
				},
				{
					id: "external",
					label: "שאלון חיצוני (70%)",
					placeholder: "ציון חיצוני (70%)",
					weight: 0.7,
				},
			],
		},
	},
};

///////////////////////////////////////////////////////////////////
//////////////////////// Main Constants ///////////////////////////
///////////////////////////////////////////////////////////////////

// Do Not Move those strings from this file!!!! An important DEPENDENCY!!!
export const bagrutImportStart =
	"Bagrut Frame Loading Process Has Just Started!";
export const bagrutImportEnd = "Bagrut Frame Has Been Successfully Loaded!";
