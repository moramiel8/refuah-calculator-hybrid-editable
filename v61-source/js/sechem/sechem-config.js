// ~~~~~~~~~~~~~ \\
// SECHEM Config \\
// ~~~~~~~~~~~~~ \\

import {
	bottomInputID,
	extTopInputID,
	topInputID,
} from "../configs/html-config.js";
import {
	bguBagrut2PrepConvFunc,
	bguBagrutReqArgs,
	bguPrep2BagrutConvFunc,
	bguPrepReqArgs,
	bguRevBagrutReqArgs,
	defaultConvFunc,
	isBguBagrutResponse,
	isBguPrepResponse,
	isTauResponse,
	parseBguBagrutResponse,
	parseBguPrepResponse,
	parseBguSechemResponse,
	parseTauResponse,
	tauBagrut2PrepConvFunc,
	tauPrep2BagrutConvFunc,
	tauReqArgs,
} from "../configs/http-config.js";
import {
	arielBagrutFormula,
	haifaBagrutFormula,
	haifaFDFormula,
	haifaSat2PsychoFormula,
	hujiBagrutFormula,
	hujiFDFormula,
	hujiFinalFormula,
	hujiHulFrenchFormula,
	hujiHulPrepFormula,
	hujiHulPsychoFormula,
	hujiNewPrepFormula,
	hujiOldPrepFormula,
	hujiPDFormula,
	morkamFormula,
	tauFDFormula,
	tauFinalFormula,
	tauPDFormula,
	techAct2PsychoFormula,
	techBagrutFormula,
	techFinalFormula,
	techPrepFormula,
	techSat2PsychoFormula,
} from "../configs/sechem-formulas-config.js";
import { uniStats } from "../configs/uni-stats-config.js";
import {
	defaultUni,
	tauImg,
	hujiImg,
	techImg,
	bguImg,
	biuImg,
	defaultImg,
	haifaImg,
	tzameretImg,
	maluImg,
	arielImg,
} from "../utils/general-config.js";
import { getCurrentYear } from "../utils/general-methods.js";

///////////////////////////////////////////////////////////////////
////////////////////// Scores Constants ///////////////////////////
///////////////////////////////////////////////////////////////////

// Psycho
export const minPsycho = 200;
export const maxPsycho = 800;
export const psychoStep = 1;

// Bagrut
export const minBagrut = 0;

// Preparatory
export const minPrep = 0;

// Degree
export const minDegreeAvg = 0;
export const maxDegreeAvg = 100;

// SAT
export const minSAT = 200;
export const maxSAT = 800;

// ACT
export const minACT = 1;
export const maxACT = 36;

// Morkam
export const minMorkam = 150;
export const maxMorkam = 250;

// Constant Thresholds
export const bguFirstSechemThreshold = 735;
export const bguDegreeSechemThreshold = 0;
export const biuFirstSechemThreshold = 0;
export const haifaFirstSechemThreshold = 680;
export const haifaDegreeSechemThreshold = 643;

// Scores' Precision
export const bagrutPrec = 2;
export const psychoPrec = 0;

// Specials
export const ogBagrutYear = 1928;
export const noSechemDelta = 0;

// Uni With No Sechem Scope
export const undefinedUni = "undefined";

///////////////////////////////////////////////////////////////////
/////////////////// Universities Constants ////////////////////////
///////////////////////////////////////////////////////////////////

// Default Scopes
export const defaultAC = "default-ac";
export const defaultFAC = "default-final-ac";
export const defaultIshiutiCalc = "default-ishiuti-calc";
export const defaultTau = "default-tau";
export const defaultHuji = "default-huji";
export const defaultTech = "default-tech";
export const defaultBgu = "default-bgu";
export const defaultBiu = "default-biu";
export const defaultHaifa = "default-haifa";

// First/Bagrut Sechem Scope
export const firstVar = "FIRST";
export const bagrutAC = "BAGRUT";
export const tauFirst = "TAU-FIRST";
export const hujiFirst = "HUJI-FIRST";
export const techFirst = "TECH-FIRST";
export const bguFirst = "BGU-FIRST";
export const biuFirst = "BIU-FIRST";
export const haifaFirst = "HAIFA-FIRST";
export const arielFirst = "ARIEL-FIRST";

// Preparatory Sechem Scope
export const prepAC = "PREP";
export const tauPrep = "TAU-PREP";
export const hujiPrep = "HUJI-PREP";
export const hujiPrepNew = "HUJI-PREP-NEW";
export const hujiPrepOld = "HUJI-PREP-OLD";
export const techPrep = "TECH-PREP";
export const bguPrep = "BGU-PREP";
export const bguPrepBagrut = "BGU-PREP-BAGRUT";
export const bguPrepOnly = "BGU-PREP-ONLY";
export const biuPrep = "BIU-PREP";
export const haifaPrep = "HAIFA-PREP";

// Partial Degree Scope
export const pdAC = "PD";
export const tauPD = "TAU-PD";
export const hujiPD = "HUJI-PD";
export const techPD = "TECH-PD";
export const bguPD = "BGU-PD";
export const bguPD3 = "BGU-PD-3";
export const bguPD4 = "BGU-PD-4+";

// Full Degree Scope
export const fdAC = "FD";
export const tauFD = "TAU-FD";
export const hujiFD = "HUJI-FD";
export const techFD = "TECH-FD";
export const bguFD = "BGU-FD";
export const haifaFD = "HAIFA-FD";

// Alternative Calculators Scope
export const altAC = "ALT";
export const hujiAlt = "HUJI-ALT";
export const hujiHulPrep = "HUJI-HUL-PREP";
export const hujiHulPsycho = "HUJI-HUL-PSYCHO";
export const hujiHulFrench = "HUJI-HUL-FRENCH";
export const techAlt = "TECH-ALT";
export const techSat = "TECH-SAT";
export const techAct = "TECH-ACT";
export const haifaAlt = "HAIFA-ALT";
export const haifaSat = "HAIFA-SAT";

// Tzameret Scope
export const tzameretAC = "TZAMERET";
export const tzameretFirst = "TZAMERET-FIRST";
export const tzameretPrep = "TZAMERET-PREP";

// Final Sechem Scope
export const finalVar = "FINAL";
export const finalAC = "FINAL";
export const tauFinal = "TAU-FINAL";
export const hujiFinal = "HUJI-FINAL";
export const techFinal = "TECH-FINAL";
export const techBPFinal = "TECH-BP-FINAL";
export const techDegFinal = "TECH-DEG-FINAL";
export const bguFinal = "BGU-FINAL";
export const biuFinal = "BIU-FINAL";
export const haifaFinal = "HAIFA-FINAL";
export const arielFinal = "ARIEL-FINAL";
export const tzameretFinal = "TZAMERET-FINAL";

// Ishiuti Calculators Scope
export const ishiutiAC = "ISHIUTI";
export const morkamCalc = "MORKAM";

///////////////////////////////////////////////////////////////////
///////////////// Find Required Scores Constants //////////////////
///////////////////////////////////////////////////////////////////

// Sechem Types & Grade Translator
export const gradesTypeTranslator = {
	bagrut: "בגרות",
	prep: "מכינה",
	degree: "רקע אקדמי",
	psycho: "פסיכומטרי",
	first: "סכם ראשוני",
	cognitive: "סכם קוגניטיבי",
	mor: 'מו"ר',
	morkam: 'מרק"ם',
	kabala: "סכם קבלה",
};

// Sechem Options
export const bagrutPsychoOpt = "בגרות-פסיכו";
export const psychoOnlyOpt = "פסיכו בלבד";
export const prepPsychoOpt = "מכינה-פסיכו";
export const prepBagrutPsychoOpt = "מכינה-בגרות-פסיכו";
export const degreePsychoOpt = "תואר-פסיכו";
export const morkamOpt = 'מרק"ם';
export const morOpt = 'מו"ר';
export const morOnlyOpt = 'מו"ר בלבד';
export const kabalaOpt = "סכם קבלה";

///////////////////////////////////////////////////////////////////
//////////////////////// SECHEM Config ////////////////////////////
///////////////////////////////////////////////////////////////////

// Label Text & Titles Constants
const labelDefaultText = "(? - ?)";
export const yearTitle = "שנה";
export const finalSechemTitle = "סכם סופי";
export const firstWaveTitle = "גל ראשון";
export const finalWaveTitle = "גל אחרון";

// Input Names
export const psychoVar = "psycho";
export const bagrutVar = "bagrut";
export const prepVar = "prep";
const degreeVar = "degree";
const cognitiveVar = "cognitive";
const morkamVar = "morkam";
const kabalaVar = "kabala";
const satEngVar = "sat-eng";
const satMathVar = "sat-math";
const actEngVar = "act-eng";
const actMathVar = "act-math";
const bioVar = "bio";
const stationsVar = "stations";
const compVar = "comp";

// Calc Types & Modes
export const apiType = "api";
export const dualApiType = "dual-api";
export const mathType = "math";
export const singleMode = "single";
export const doubleMode = "double";

// First Admission Channels Config
export const ADMISSION_CHANNELS = {
	[defaultAC]: {
		label: "בחירת אפיק קבלה",
		name: "",
		titleBase: "חישוב ציונים ראשוניים",
		universities: {
			default: {
				id: defaultAC,
				optText: "",
				name: "",
				logo: defaultImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-ac-top",
						label: labelDefaultText,
						min: minBagrut,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-ac-bottom",
						label: labelDefaultText,
						min: minBagrut,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-ac-ext-top",
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
		},
	},
	BAGRUT: {
		label: "בגרויות",
		titleBase: "חישוב סכם בגרויות",
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				logo: defaultImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-bagrut-top",
						label: labelDefaultText,
						min: minBagrut,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-bagrut-bottom",
						label: labelDefaultText,
						min: minBagrut,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-bagrut-ext-top",
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
			[tauFirst]: {
				id: tauFirst,
				optText: "תל אביב",
				name: "תל אביב",
				logo: tauImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: bagrutVar,
						label: `:ממוצע בגרות (${uniStats.TAU.BAGRUT.avg.max} - ${uniStats.TAU.BAGRUT.avg.min})`,
						min: minBagrut,
						max: uniStats.TAU.BAGRUT.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TAU.BAGRUT.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם בגרויות תל אביב",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TAU.BAGRUT.psycho.min}+<br>• בגרות - ${uniStats.TAU.BAGRUT.avg.min}+<br>• ציון אנגלית - ${uniStats.TAU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.TAU.heb.min}+<br>• מתמטיקה - ${uniStats.TAU.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• בגרות - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TAU.BAGRUT.validity}<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: apiType,
					calcFuncs: {
						isResponse: isTauResponse,
						parseResponse: parseTauResponse,
						convertScore: {
							name: bagrutVar,
							forward: defaultConvFunc,
							inverse: defaultConvFunc,
						},
						requestArgs: tauReqArgs,
					},
					requiredStats: {
						minBagrut: uniStats.TAU.BAGRUT.avg.min,
						maxBagrut: uniStats.TAU.BAGRUT.avg.max,
						minPsycho: uniStats.TAU.BAGRUT.psycho.min,
						maxPsycho: maxPsycho,
						visualLabel: bagrutPsychoOpt,
					},
				},
			},
			[hujiFirst]: {
				id: hujiFirst,
				optText: "העברית",
				name: "העברית",
				logo: hujiImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: bagrutVar,
						label: `:ממוצע בגרות (${uniStats.HUJI.BAGRUT.avg.max} - ${uniStats.HUJI.BAGRUT.avg.min})`,
						min: minBagrut,
						max: uniStats.HUJI.BAGRUT.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HUJI.BAGRUT.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם בגרויות העברית",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HUJI.BAGRUT.psycho.min}+<br>• בגרות - ${uniStats.HUJI.BAGRUT.avg.min}+<br>• ציון אנגלית - ${uniStats.HUJI.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.HUJI.heb.min}+<br>• מתמטיקה - ${uniStats.HUJI.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 70%<br>• בגרות - 30%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HUJI.BAGRUT.validity}<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 3,
					calcFuncs: {
						formula: hujiBagrutFormula,
					},
					requiredStats: {
						minBagrut: uniStats.HUJI.BAGRUT.avg.min,
						maxBagrut: uniStats.HUJI.BAGRUT.avg.max,
						minPsycho: uniStats.HUJI.BAGRUT.psycho.min,
						maxPsycho: maxPsycho,
						bagrutStep: 0.1,
						visualLabel: bagrutPsychoOpt,
						formula: hujiBagrutFormula,
					},
				},
			},
			[techFirst]: {
				id: techFirst,
				optText: "טכניון",
				name: "טכניון",
				logo: techImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: bagrutVar,
						label: `:ממוצע בגרות (${uniStats.TECH.BAGRUT.avg.max} - ${uniStats.TECH.BAGRUT.avg.min})`,
						min: minBagrut,
						max: uniStats.TECH.BAGRUT.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TECH.BAGRUT.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם בגרויות טכניון",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TECH.BAGRUT.psycho.min}+<br>• בגרות - ${uniStats.TECH.BAGRUT.avg.min}+<br>• ציון אנגלית - ${uniStats.TECH.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.TECH.heb.min}+<br>• מתמטיקה - ${uniStats.TECH.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• בגרות - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TECH.BAGRUT.validity}<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 3,
					calcFuncs: {
						formula: techBagrutFormula,
					},
					requiredStats: {
						minBagrut: uniStats.TECH.BAGRUT.avg.min,
						maxBagrut: uniStats.TECH.BAGRUT.avg.max,
						minPsycho: uniStats.TECH.BAGRUT.psycho.min,
						maxPsycho: maxPsycho,
						bagrutStep: 0.01,
						visualLabel: bagrutPsychoOpt,
						formula: techBagrutFormula,
					},
				},
			},
			[bguFirst]: {
				id: bguFirst,
				optText: "בן גוריון",
				name: "בן גוריון",
				logo: bguImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: bagrutVar,
						label: `:ממוצע בגרות (${uniStats.BGU.BAGRUT.avg.max} - ${uniStats.BGU.BAGRUT.avg.min})`,
						min: minBagrut,
						max: uniStats.BGU.BAGRUT.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.BGU.BAGRUT.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם בגרויות בן גוריון",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.BGU.BAGRUT.psycho.min}+<br>• בגרות - ${uniStats.BGU.BAGRUT.avg.min}+<br>• ציון אנגלית - ${uniStats.BGU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.BGU.heb.min}+<br>• מתמטיקה - ${uniStats.BGU.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• בגרות - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.BGU.BAGRUT.validity}<br>• העומדים בסף הסכם המוחלט של ${bguFirstSechemThreshold}, ימשיכו למבחני האישיות.<br>• לסכם זה <u>אין משקל</u> כחלק מהסכם הסופי - ציון המעבר של כל אחד משלבי המיון בבן גוריון הוא <u>בינארי</u>!`,
					display: true,
				},
				calculation: {
					type: apiType,
					calcFuncs: {
						isResponse: isBguBagrutResponse,
						parseResponse: parseBguSechemResponse,
						convertScore: {
							name: bagrutVar,
							forward: defaultConvFunc,
							inverse: defaultConvFunc,
						},
						requestArgs: bguBagrutReqArgs,
					},
					requiredStats: {
						minBagrut: uniStats.BGU.BAGRUT.avg.min,
						maxBagrut: uniStats.BGU.BAGRUT.avg.max,
						minPsycho: uniStats.BGU.BAGRUT.psycho.min,
						maxPsycho: maxPsycho,
						visualLabel: bagrutPsychoOpt,
					},
				},
			},
			[biuFirst]: {
				id: biuFirst,
				optText: "בר אילן",
				name: "בר אילן",
				logo: biuImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: bagrutVar,
						label: `:ממוצע בגרות (${uniStats.BIU.BAGRUT.avg.max} - ${uniStats.BIU.BAGRUT.avg.min})`,
						min: minBagrut,
						max: uniStats.BIU.BAGRUT.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.BIU.BAGRUT.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם בגרויות בר אילן",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.BIU.BAGRUT.psycho.min}+<br>• בגרות - ${uniStats.BIU.BAGRUT.avg.min}+<br>• ציון אנגלית - ${uniStats.BIU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.BIU.heb.min}+<br>• מתמטיקה - ${uniStats.BIU.math.min}<br><h3><u>הערות נוספות</u>:</h3>• בשלב ממיין זה <u>אין סכם מספרי</u>, אלא נתוני סף בלבד.<br>• העומדים בנתוני הסף ימשיכו למבחני האישיות.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: null,
					calcFuncs: {
						formula: null,
					},
					requiredStats: {
						minBagrut: uniStats.BIU.BAGRUT.avg.min,
						maxBagrut: uniStats.BIU.BAGRUT.avg.max,
						minPsycho: uniStats.BIU.BAGRUT.psycho.min,
						maxPsycho: maxPsycho,
						bagrutStep: 0.01,
						visualLabel: bagrutPsychoOpt,
						formula: null,
					},
				},
			},
			[haifaFirst]: {
				id: haifaFirst,
				optText: "חיפה",
				name: "חיפה",
				logo: haifaImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: "BAGRUT-YEAR",
						label: ":שנת תעודת הבגרות",
						min: 0,
						max: getCurrentYear(),
						allowDecimal: false,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HAIFA.BAGRUT.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: bagrutVar,
						label: `:ממוצע בגרות (${uniStats.HAIFA.BAGRUT.avg.max} - ${uniStats.HAIFA.BAGRUT.avg.min})`,
						min: minBagrut,
						max: uniStats.HAIFA.BAGRUT.avg.max,
						allowDecimal: true,
						display: true,
					},
				},
				dialog: {
					title: "סכם בגרויות חיפה",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${
						uniStats.HAIFA.BAGRUT.psycho.min
					}+<br>• בגרות - ${
						uniStats.HAIFA.BAGRUT.avg.min
					}+<br>• ציון אנגלית - ${
						uniStats.HAIFA.eng.min
					}+<br>• ציון עברית (למי שנדרש) - ${
						uniStats.HAIFA.heb.min
					}+<br>• מתמטיקה - ${
						uniStats.HAIFA.math.min
					}<br><h3><u>משקלים בחישוב</u>:</h3>• <b><u>בגרות ${
						getCurrentYear() - 6
					}-${getCurrentYear()}</u>:</b> פסיכומטרי - 70%, בגרות - 30%<br>• <b><u>בגרות ${
						getCurrentYear() - 10
					}-${
						getCurrentYear() - 7
					}</u>:</b> פסיכומטרי - 85%, בגרות - 15%<br>• <b><u>בגרות ${
						getCurrentYear() - 11
					} ומטה</u>:</b> פסיכומטרי - 100%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${
						uniStats.HAIFA.BAGRUT.validity
					}<br>• העומדים בסף הסכם המוחלט של ${haifaFirstSechemThreshold}, ימשיכו למבחני האישיות.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 0,
					calcFuncs: {
						formula: haifaBagrutFormula,
					},
					requiredStats: {
						minBagrut: uniStats.HAIFA.BAGRUT.avg.min,
						maxBagrut: uniStats.HAIFA.BAGRUT.avg.max,
						minPsycho: uniStats.HAIFA.BAGRUT.psycho.min,
						maxPsycho: maxPsycho,
						bagrutStep: 0.01,
						visualLabel: bagrutPsychoOpt,
						formula: haifaBagrutFormula,
					},
				},
			},
			[arielFirst]: {
				id: arielFirst,
				optText: "אריאל",
				name: "אריאל",
				logo: arielImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: bagrutVar,
						label: `:ממוצע בגרות (${uniStats.ARIEL.BAGRUT.avg.max} - ${uniStats.ARIEL.BAGRUT.avg.min})`,
						min: minBagrut,
						max: uniStats.ARIEL.BAGRUT.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.ARIEL.BAGRUT.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם בגרויות אריאל",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.ARIEL.BAGRUT.psycho.min}+<br>• בגרות - ${uniStats.ARIEL.BAGRUT.avg.min}+<br>• ציון אנגלית - ${uniStats.ARIEL.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.ARIEL.heb.min}+<br>• מתמטיקה - ${uniStats.ARIEL.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• בגרות - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>אין מה להיבהל - עדין לא נפתח מסלול שש שנתי באריאל באופן רשמי! אנחנו בסה"כ מכינים את התשתית</u>!`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 1,
					calcFuncs: {
						formula: arielBagrutFormula,
					},
					requiredStats: {
						minBagrut: uniStats.ARIEL.BAGRUT.avg.min,
						maxBagrut: uniStats.ARIEL.BAGRUT.avg.max,
						minPsycho: uniStats.ARIEL.BAGRUT.psycho.min,
						maxPsycho: maxPsycho,
						bagrutStep: 0.01,
						visualLabel: bagrutPsychoOpt,
						formula: arielBagrutFormula,
					},
				},
			},
		},
	},
	PREP: {
		label: "מכינה אקדמית",
		titleBase: "חישוב סכם מכינה אקדמית",
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				logo: defaultImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-prep-top",
						label: labelDefaultText,
						min: minPrep,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-prep-bottom",
						label: labelDefaultText,
						min: minPrep,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-prep-ext-top",
						label: "",
						min: minPrep,
						max: minPrep,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
			[tauPrep]: {
				id: tauPrep,
				optText: "תל אביב",
				name: "תל אביב",
				logo: tauImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: prepVar,
						label: `:ממוצע מכינה (${uniStats.TAU.PREP.avg.max} - ${uniStats.TAU.PREP.avg.min})`,
						min: minPrep,
						max: uniStats.TAU.PREP.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TAU.PREP.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minPrep,
						max: minPrep,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם מכינה תל אביב",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TAU.PREP.psycho.min}+<br>• מכינה - ${uniStats.TAU.PREP.avg.min}+ (ללא בונוסים)<br>• ציון אנגלית - ${uniStats.TAU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.TAU.heb.min}+<br>• מתמטיקה - ${uniStats.TAU.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• מכינה - 50%<br><h3><u>מכינות מוכרות</u>:</h3>• העברית, ת"א, בר אילן, הטכניון, בן גוריון, חיפה, אריאל.<br>• <b><u>מסלולים</u>:</b> מדעי הטבע או מדעים מדויקים.<h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TAU.PREP.validity}<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: apiType,
					calcFuncs: {
						isResponse: isTauResponse,
						parseResponse: parseTauResponse,
						convertScore: {
							name: prepVar,
							forward: tauPrep2BagrutConvFunc,
							inverse: tauBagrut2PrepConvFunc,
						},
						requestArgs: tauReqArgs,
					},
					requiredStats: {
						minPrep: uniStats.TAU.PREP.avg.min,
						maxPrep: uniStats.TAU.PREP.avg.max,
						minPsycho: uniStats.TAU.PREP.psycho.min,
						maxPsycho: maxPsycho,
						visualLabel: prepPsychoOpt,
					},
				},
			},
			[hujiPrep]: {
				id: hujiPrep,
				optText: "העברית",
				name: "העברית",
				logo: hujiImg.cloneNode(),
				showSechemTable: true,
				subChannels: {
					default: {
						id: defaultHuji,
						optText: "בחירת מכינה ושנה",
						name: "",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: "no-prep-top",
								label: labelDefaultText,
								min: minPrep,
								max: null,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: "no-prep-bottom",
								label: labelDefaultText,
								min: minPrep,
								max: null,
								allowDecimal: true,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								name: "no-prep-ext-top",
								label: "",
								min: minPrep,
								max: minPrep,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: null,
							text: null,
							display: false,
						},
					},
					[hujiPrepNew]: {
						id: hujiPrepNew,
						optText: 'העברית תשפ"א ואילך',
						showSechemTable: true,
						inputs: {
							top: {
								id: topInputID,
								name: prepVar,
								label: `:ממוצע מכינה (${uniStats.HUJI.PREP.avg.max} - ${uniStats.HUJI.PREP.avg.min})`,
								min: minPrep,
								max: uniStats.HUJI.PREP.avg.max,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: psychoVar,
								label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HUJI.PREP.psycho.min})`,
								min: 0,
								max: maxPsycho,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: minPrep,
								max: minPrep,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "סכם מכינה העברית",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HUJI.PREP.psycho.min}+<br>• מכינה - ${uniStats.HUJI.PREP.avg.min}+<br>• ציון אנגלית - ${uniStats.HUJI.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.HUJI.heb.min}+<br>• מתמטיקה - ${uniStats.HUJI.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• מכינה - 50%<br><h3><u>מכינות מוכרות</u>:</h3>• העברית - שנת תשפ"א ואילך (2021-2022).<br>• <b><u>מסלולים</u>:</b> מדעי הטבע<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HUJI.PREP.validity_new}<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
							display: true,
						},
						calculation: {
							type: mathType,
							mode: doubleMode,
							round: 3,
							calcFuncs: {
								formula: hujiNewPrepFormula,
							},
							requiredStats: {
								formula: hujiNewPrepFormula,
								minPrep: uniStats.HUJI.PREP.avg.min,
								maxPrep: uniStats.HUJI.PREP.avg.max,
								minPsycho: uniStats.HUJI.PREP.psycho.min,
								maxPsycho: maxPsycho,
								prepStep: 0.01,
								visualLabel: prepPsychoOpt,
							},
						},
					},
					[hujiPrepOld]: {
						id: hujiPrepOld,
						optText: 'העברית עד תש"ף ואחרות',
						showSechemTable: true,
						inputs: {
							top: {
								id: topInputID,
								name: prepVar,
								label: `:ממוצע מכינה (${uniStats.HUJI.PREP.avg.max} - ${uniStats.HUJI.PREP.avg.min})`,
								min: minPrep,
								max: uniStats.HUJI.PREP.avg.max,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: psychoVar,
								label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HUJI.PREP.psycho.min})`,
								min: 0,
								max: maxPsycho,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: minPrep,
								max: minPrep,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "סכם מכינה העברית",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HUJI.PREP.psycho.min}+<br>• מכינה - ${uniStats.HUJI.PREP.avg.min}+<br>• ציון אנגלית - ${uniStats.HUJI.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.HUJI.heb.min}+<br>• מתמטיקה - ${uniStats.HUJI.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• מכינה - 50%<br><h3><u>מכינות מוכרות</u>:</h3>• העברית - עד שנת תש"ף (2020-2021), ת"א, בר אילן והטכניון.<br>• <b><u>מסלולים</u>:</b> מדעי הטבע<br>• בוגרי מכינות שאינן העברית, נדרשים לפנות למדור רישום וקבלה לשם <u>המרת ציון המכינה</u> למחשבון העברית!<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HUJI.PREP.validity_old}<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
							display: true,
						},
						calculation: {
							type: mathType,
							mode: doubleMode,
							round: 3,
							calcFuncs: {
								formula: hujiOldPrepFormula,
							},
							requiredStats: {
								formula: hujiOldPrepFormula,
								minPrep: uniStats.HUJI.PREP.avg.min,
								maxPrep: uniStats.HUJI.PREP.avg.max,
								minPsycho: uniStats.HUJI.PREP.psycho.min,
								maxPsycho: maxPsycho,
								prepStep: 0.01,
								visualLabel: prepPsychoOpt,
							},
						},
					},
				},
			},
			[techPrep]: {
				id: techPrep,
				optText: "טכניון",
				name: "טכניון",
				logo: techImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: bagrutVar,
						label: `:ממוצע בגרות (${uniStats.TECH.BAGRUT.avg.max} - ${uniStats.TECH.BAGRUT.avg.min})`,
						min: minBagrut,
						max: uniStats.TECH.PREP.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TECH.PREP.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: prepVar,
						label: `:ממוצע מכינה (${uniStats.TECH.PREP.avg.max} - ${uniStats.TECH.PREP.avg.min})`,
						min: minPrep,
						max: uniStats.TECH.PREP.avg.max,
						allowDecimal: true,
						display: true,
					},
				},
				dialog: {
					title: "סכם מכינה טכניון",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TECH.PREP.psycho.min}+<br>• מכינה - ${uniStats.TECH.PREP.avg.min}+<br>• ציון אנגלית - ${uniStats.TECH.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.TECH.heb.min}+<br>• מתמטיקה - ${uniStats.TECH.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• מכינה - 25%<br>• בגרות - 25%<br><h3><u>מכינות מוכרות</u>:</h3>• הטכניון<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TECH.PREP.validity}<br>• מכינת הטכניון <u>אינה מחליפה</u> בגרות! הציונים משוקללים יחד. <br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 3,
					calcFuncs: {
						formula: techPrepFormula,
					},
					requiredStats: {
						formula: techPrepFormula,
						minBagrut: uniStats.TECH.BAGRUT.avg.min,
						maxBagrut: uniStats.TECH.BAGRUT.avg.max,
						minPrep: uniStats.TECH.PREP.avg.min,
						maxPrep: uniStats.TECH.PREP.avg.max,
						minPsycho: uniStats.TECH.PREP.psycho.min,
						maxPsycho: maxPsycho,
						bagrutStep: 0.01,
						prepStep: 0.01,
						visualLabel: prepBagrutPsychoOpt,
					},
				},
			},
			[bguPrep]: {
				id: bguPrep,
				optText: "בן גוריון",
				name: "בן גוריון",
				logo: bguImg.cloneNode(),
				showSechemTable: false,
				subChannels: {
					default: {
						id: defaultBgu,
						optText: "בחירת הרכב ציון",
						name: "",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: "no-prep-top",
								label: labelDefaultText,
								min: minPrep,
								max: null,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: "no-prep-bottom",
								label: labelDefaultText,
								min: minPrep,
								max: null,
								allowDecimal: true,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								name: "no-prep-ext-top",
								label: "",
								min: minPrep,
								max: minPrep,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: null,
							text: null,
							display: false,
						},
					},
					[bguPrepOnly]: {
						id: bguPrepOnly,
						optText: "חישוב ללא בגרות",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: "",
								label: "",
								min: minPrep,
								max: minPrep,
								allowDecimal: true,
								display: false,
							},
							bottom: {
								id: bottomInputID,
								name: psychoVar,
								label: `:פסיכומטרי (${maxPsycho} - ${uniStats.BGU.PREP.psycho.min})`,
								min: 0,
								max: maxPsycho,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								name: prepVar,
								label: `:ממוצע מכינה (${uniStats.BGU.PREP.avg.max} - ${uniStats.BGU.PREP.avg.min})`,
								min: minPrep,
								max: uniStats.BGU.PREP.avg.max,
								allowDecimal: true,
								display: true,
							},
						},
						dialog: {
							title: "סכם מכינה בן גוריון",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.BGU.PREP.psycho.min}+<br>• מכינה - ${uniStats.BGU.PREP.avg.min}+<br>• ציון אנגלית - ${uniStats.BGU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.BGU.heb.min}+<br>• מתמטיקה - ${uniStats.BGU.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 70%<br>• מכינה - 30%<br><h3><u>מכינות מוכרות</u>:</h3>• בן גוריון והטכניון.<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.BGU.PREP.validity_prep_only}<br>• ניתן לחשב את הסכם גם באמצעות המחשבון שמכליל את הבגרות בחישוב - <b>ילקח הציון הגבוה מהשניים!</b><br>• העומדים בסף הסכם המוחלט של ${bguFirstSechemThreshold}, ימשיכו למבחני האישיות.<br>• לסכם זה <u>אין משקל</u> כחלק מהסכם הסופי - ציון המעבר של כל אחד משלבי המיון בבן גוריון הוא <u>בינארי</u>!`,
							display: true,
						},
						calculation: {
							type: apiType,
							calcFuncs: {
								isResponse: isBguBagrutResponse,
								parseResponse: parseBguSechemResponse,
								convertScore: {
									name: prepVar,
									forward: bguPrep2BagrutConvFunc,
									inverse: bguBagrut2PrepConvFunc,
								},
								requestArgs: bguBagrutReqArgs,
							},
							requiredStats: {
								minPrep: uniStats.BGU.PREP.avg.min,
								maxPrep: uniStats.BGU.PREP.avg.max,
								minPsycho: uniStats.BGU.PREP.psycho.min,
								maxPsycho: maxPsycho,
								visualLabel: prepPsychoOpt,
							},
						},
					},
					[bguPrepBagrut]: {
						id: bguPrepBagrut,
						optText: "חישוב כולל בגרות",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: bagrutVar,
								label: `:ממוצע בגרות (${uniStats.BGU.BAGRUT.avg.max} - ${uniStats.BGU.BAGRUT.avg.min})`,
								min: minBagrut,
								max: uniStats.BGU.BAGRUT.avg.max,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: psychoVar,
								label: `:פסיכומטרי (${maxPsycho} - ${uniStats.BGU.PREP.psycho.min})`,
								min: 0,
								max: maxPsycho,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								name: prepVar,
								label: `:ממוצע מכינה (${uniStats.BGU.PREP.avg.max} - ${uniStats.BGU.PREP.avg.min})`,
								min: minPrep,
								max: uniStats.BGU.PREP.avg.max,
								allowDecimal: true,
								display: true,
							},
						},
						dialog: {
							title: "סכם מכינה בן גוריון",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.BGU.PREP.psycho.min}+<br>• מכינה - ${uniStats.BGU.PREP.avg.min}+<br>• ציון אנגלית - ${uniStats.BGU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.BGU.heb.min}+<br>• מתמטיקה - ${uniStats.BGU.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• מכינה - 25%<br>• בגרות - 25%<br><h3><u>מכינות מוכרות</u>:</h3>• בן גוריון והטכניון.<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.BGU.PREP.validity_prep_bagrut}<br>• ניתן לחשב את הסכם גם באמצעות המחשבון שמשמיט את הבגרות מהחישוב - <b>ילקח הציון הגבוה מהשניים!</b><br>• העומדים בסף הסכם המוחלט של ${bguFirstSechemThreshold}, ימשיכו למבחני האישיות.<br>• לסכם זה <u>אין משקל</u> כחלק מהסכם הסופי - ציון המעבר של כל אחד משלבי המיון בבן גוריון הוא <u>בינארי</u>!`,
							display: true,
						},
						calculation: {
							type: dualApiType,
							calcFuncs: {
								bagrutFuncs: {
									requestArgs: bguBagrutReqArgs,
									isResponse: isBguBagrutResponse,
									parseResponse: parseBguSechemResponse,
									convertScore: {
										name: bagrutVar,
										forward: defaultConvFunc,
										inverse: defaultConvFunc,
									},
								},
								prepFuncs: {
									requestArgs: bguPrepReqArgs,
									isResponse: isBguPrepResponse,
									parseResponse: parseBguPrepResponse,
									convertScore: {
										name: prepVar,
										forward: defaultConvFunc,
										inverse: defaultConvFunc,
									},
								},
								revBagrutFuncs: {
									requestArgs: bguRevBagrutReqArgs,
									isResponse: isBguBagrutResponse,
									parseResponse: parseBguBagrutResponse,
									convertScore: {
										name: bagrutVar,
										forward: defaultConvFunc,
										inverse: defaultConvFunc,
									},
								},
							},
							requiredStats: {
								minBagrut: uniStats.BGU.BAGRUT.avg.min,
								maxBagrut: uniStats.BGU.BAGRUT.avg.max,
								minPrep: uniStats.BGU.PREP.avg.min,
								maxPrep: uniStats.BGU.PREP.avg.max,
								minPsycho: uniStats.BGU.PREP.psycho.min,
								maxPsycho: maxPsycho,
								visualLabel: prepPsychoOpt,
							},
						},
					},
				},
			},
			[biuPrep]: {
				id: biuPrep,
				optText: "בר אילן",
				name: "בר אילן",
				logo: biuImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: prepVar,
						label: `:ממוצע מכינה (${uniStats.BIU.PREP.avg.max} - ${uniStats.BIU.PREP.avg.min})`,
						min: minPrep,
						max: uniStats.BIU.PREP.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.BIU.PREP.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minPrep,
						max: minPrep,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם מכינה בר אילן",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.BIU.PREP.psycho.min}+<br>• מכינה - ${uniStats.BIU.PREP.avg.min}+<br>• ציון אנגלית - ${uniStats.BIU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.BIU.heb.min}+<br>• מתמטיקה - ${uniStats.BIU.PREP.math.min}<br><h3><u>מכינות מוכרות</u>:</h3>• בר אילן, תל אביב, הטכניון, בן גוריון. כמו כן, העברית ואריאל, בכפוף לעמידה במבחן קבלה נוסף במתמטיקה ברמת 5+ יח"ל.<br>• <b><u>מסלולים</u>:</b> הנדסה ומדעים מדוייקים.<br><h3><u>הערות נוספות</u>:</h3>• בשלב ממיין זה <u>אין סכם מספרי</u>, אלא נתוני סף בלבד.<br>• העומדים בנתוני הסף ימשיכו למבחני האישיות.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: null,
					calcFuncs: {
						formula: null,
					},
					requiredStats: {
						minPrep: uniStats.BIU.PREP.avg.min,
						maxPrep: uniStats.BIU.PREP.avg.max,
						minPsycho: uniStats.BIU.PREP.psycho.min,
						maxPsycho: maxPsycho,
						prepStep: 0.01,
						visualLabel: prepPsychoOpt,
						formula: null,
					},
				},
			},
			[haifaPrep]: {
				id: haifaPrep,
				optText: "חיפה",
				name: "חיפה",
				logo: haifaImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: prepVar,
						label: `:ממוצע מכינה (${uniStats.HAIFA.PREP.avg.max} - ${uniStats.HAIFA.PREP.avg.min})`,
						min: minPrep,
						max: uniStats.HAIFA.PREP.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HAIFA.PREP.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minPrep,
						max: minPrep,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם מכינה חיפה",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HAIFA.PREP.psycho.min}+<br>• מכינה - ${uniStats.HAIFA.PREP.avg.min}+ (ללא בונוסים)<br>• ציון אנגלית - ${uniStats.HAIFA.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.HAIFA.heb.min}+<br>• מתמטיקה - ${uniStats.HAIFA.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - ?<br>• מכינה - ?<br><h3><u>מכינות מוכרות</u>:</h3>• העברית, ת"א, בר אילן, הטכניון, בן גוריון, חיפה, אריאל, בראודה, תל חי ורופין<br>• <b><u>מסלולים</u>:</b> מדעי הטבע או מדעים מדוייקים והנדסה<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HAIFA.PREP.validity}<br>• העומדים בסף הסכם המוחלט של ${haifaFirstSechemThreshold}, ימשיכו למבחני האישיות.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
			},
		},
	},
	PD: {
		label: "רקע אקדמי חלקי",
		titleBase: "חישוב סכם רקע אקדמי חלקי",
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				logo: defaultImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-pd-top",
						label: labelDefaultText,
						min: minDegreeAvg,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-pd-bottom",
						label: labelDefaultText,
						min: minDegreeAvg,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-pd-ext-top",
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
			[tauPD]: {
				id: tauPD,
				optText: "תל אביב",
				name: "תל אביב",
				logo: tauImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: degreeVar,
						label: `:ממוצע אקדמי חלקי (${maxDegreeAvg} - ${uniStats.TAU.PD.avg.min})`,
						min: minDegreeAvg,
						max: maxDegreeAvg,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TAU.PD.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם רקע אקדמי חלקי תל אביב",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TAU.PD.psycho.min}+<br>• רקע אקדמי - ${uniStats.TAU.PD.avg.min}+ (40 ש"ס לפחות)<br>• ציון אנגלית - ${uniStats.TAU.eng.min}+/הצלחה בקורס ברמה מתקדמים א<br>• ציון עברית (למי שנדרש) - ${uniStats.TAU.heb.min}+<br>• מתמטיקה - ${uniStats.TAU.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• רקע אקדמי - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TAU.PD.validity}<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 2,
					calcFuncs: {
						formula: tauPDFormula,
					},
					requiredStats: {
						minDegree: uniStats.TAU.PD.avg.min,
						maxDegree: maxDegreeAvg,
						minPsycho: uniStats.TAU.PD.psycho.min,
						maxPsycho: maxPsycho,
						degreeStep: 0.01,
						visualLabel: degreePsychoOpt,
						formula: tauPDFormula,
					},
				},
			},
			[hujiPD]: {
				id: hujiPD,
				optText: "העברית",
				name: "העברית",
				logo: hujiImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: degreeVar,
						label: `:ממוצע אקדמי חלקי (${maxDegreeAvg} - ${uniStats.HUJI.PD.avg.min})`,
						min: minDegreeAvg,
						max: maxDegreeAvg,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HUJI.PD.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם רקע אקדמי חלקי העברית",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HUJI.PD.psycho.min}+<br>• רקע אקדמי - ${uniStats.HUJI.PD.avg.min}+ (45 נ"ז לפחות)<br>• ציון אנגלית - ${uniStats.HUJI.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.HUJI.heb.min}+<br>• מתמטיקה - ${uniStats.HUJI.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• רקע אקדמי - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HUJI.PD.validity}<br>• <u>רקע אקדמי רלוונטי מהעברית בלבד</u>: רפואת שיניים, רוקחות, ביוטכנולוגיה, צירוף פסיכולוגיה ומדעי החיים, מדעי החיים, כימיה, פיסיקה, מדעים ביו-רפואיים, מדעי המוח וההתנהגות, מדעי הקוגניציה והמוח, מדעי המחשב, מדעי בעלי החיים ורפואה וטרינרית.<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 3,
					calcFuncs: {
						formula: hujiPDFormula,
					},
					requiredStats: {
						minDegree: uniStats.HUJI.PD.avg.min,
						maxDegree: maxDegreeAvg,
						minPsycho: uniStats.HUJI.PD.psycho.min,
						maxPsycho: maxPsycho,
						degreeStep: 0.01,
						visualLabel: degreePsychoOpt,
						formula: hujiPDFormula,
					},
				},
			},
			[techPD]: {
				id: techPD,
				optText: "טכניון",
				name: "טכניון",
				logo: techImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: degreeVar,
						label: `:ממוצע אקדמי חלקי (${maxDegreeAvg} - ${uniStats.TECH.PD.avg.min})`,
						min: minDegreeAvg,
						max: maxDegreeAvg,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TECH.PD.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם רקע אקדמי חלקי טכניון",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TECH.PD.psycho.min}+<br>• רקע אקדמי - ${uniStats.TECH.PD.avg.min}+ (3 סמסטרים לפחות)<br>• ציון אנגלית - ${uniStats.TECH.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.TECH.heb.min}+<br>• ציון סכם "רגיל" - ${uniStats.TECH.PD.cognitive.min}+<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• רקע אקדמי - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TECH.PD.validity}<br>• מועמדים בעלי רקע אקדמי חלקי או מלא <u>ידורגו ביניהם</u> במסגרת האפיק. ניתן בונוס של <u>3 נקודות בסכם</u> לתלמידים שלמדו מקצועות <u>הנדסה, מתמטיקה או פיסיקה</u>. בכל שנה נקבע מספר המקומות על פי החלטת הדיקן - מספר זה לא יעלה על <u>15% מסך המתקבלים</u>.<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם. מועמדים שלא יעברו את סף הזימון על סמך <u>הרקע האקדמי</u>, ימשיכו באופן אוטומטי את תהליך המיון <u>במסלול הסכם "הרגיל"</u>, ללא התחשבות ברקע האקדמי שלהם - <b>ובלבד שעברו את דרישות הסף להגשת מועמדות על בסיס רקע אקדמי!</b><br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
			},
			[bguPD]: {
				id: bguPD,
				optText: "בן גוריון",
				name: "בן גוריון",
				logo: bguImg.cloneNode(),
				showSechemTable: false,
				subChannels: {
					default: {
						id: defaultBgu,
						optText: "בחירת הרכב ציון",
						name: "",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: "no-pd-top",
								label: labelDefaultText,
								min: minDegreeAvg,
								max: null,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: "no-pd-bottom",
								label: labelDefaultText,
								min: minDegreeAvg,
								max: null,
								allowDecimal: true,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								name: "no-pd-ext-top",
								label: "",
								min: minDegreeAvg,
								max: minDegreeAvg,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: null,
							text: null,
							display: false,
						},
					},
					[bguPD3]: {
						id: bguPD3,
						optText: "בדיוק 3 סמסטרים",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: degreeVar,
								label: `:ממוצע אקדמי חלקי (${maxDegreeAvg} - ${uniStats.BGU.PD.avg.min})`,
								min: minDegreeAvg,
								max: maxDegreeAvg,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: psychoVar,
								label: `:פסיכומטרי (${maxPsycho} - ${uniStats.BGU.PD.psycho.min})`,
								min: 0,
								max: maxPsycho,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: minDegreeAvg,
								max: minDegreeAvg,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "סכם רקע אקדמי חלקי בן גוריון",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.BGU.PD.psycho.min}+<br>• רקע אקדמי - ${uniStats.BGU.PD.avg.min}+ (60 נק"ז)<br>• ציון אנגלית - ${uniStats.BGU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.BGU.heb.min}+<br>• מתמטיקה - ${uniStats.BGU.math.min}<br><h3><u>הערות נוספות</u>:</h3>• רקע אקדמי <u>מהארץ בלבד</u>.<br>• בדיוק 3 סמסטרים <u>רצופים מאותו מוסד</u>.<br>• בשלב ממיין זה <u>אין סכם מספרי</u>, אלא נתוני סף בלבד.<br>• העומדים בנתוני הסף ימשיכו למבחני האישיות.<br>• ציון המעבר של כל אחד משלבי המיון בבן גוריון הוא <u>בינארי</u>.`,
							display: true,
						},
						calculation: {
							type: mathType,
							mode: doubleMode,
							round: null,
							calcFuncs: {
								formula: null,
							},
							requiredStats: {
								minDegree: uniStats.BGU.PD.avg.min,
								maxDegree: maxDegreeAvg,
								minPsycho: uniStats.BGU.PD.psycho.min,
								maxPsycho: maxPsycho,
								degreeStep: 0.01,
								visualLabel: degreePsychoOpt,
								formula: null,
							},
						},
					},
					[bguPD4]: {
						id: bguPD4,
						optText: "מעל 4 סמסטרים",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: degreeVar,
								label: `:ממוצע אקדמי חלקי (${maxDegreeAvg} - ${uniStats.BGU.FD.avg.min})`,
								min: minDegreeAvg,
								max: maxDegreeAvg,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: psychoVar,
								label: `:פסיכומטרי (${maxPsycho} - ${uniStats.BGU.FD.psycho.min})`,
								min: 0,
								max: maxPsycho,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: minDegreeAvg,
								max: minDegreeAvg,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "סכם רקע אקדמי חלקי בן גוריון",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.BGU.FD.psycho.min}+<br>• רקע אקדמי - ${uniStats.BGU.FD.avg.min}+ (80 נק"ז)<br>• ציון אנגלית - ${uniStats.BGU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.BGU.heb.min}+<br>• מתמטיקה - ${uniStats.BGU.math.min}<br><h3><u>הערות נוספות</u>:</h3>• רקע אקדמי <u>מהארץ בלבד</u>.<br>• לפחות 4 סמסטרים <u>רצופים מאותו מוסד</u>.<br>• בשלב ממיין זה <u>אין סכם מספרי</u>, אלא נתוני סף בלבד.<br>• העומדים בנתוני הסף ימשיכו למבחני האישיות.<br>• ציון המעבר של כל אחד משלבי המיון בבן גוריון הוא <u>בינארי</u>.`,
							display: true,
						},
						calculation: {
							type: mathType,
							mode: doubleMode,
							round: null,
							calcFuncs: {
								formula: null,
							},
							requiredStats: {
								minDegree: uniStats.BGU.FD.avg.min,
								maxDegree: maxDegreeAvg,
								minPsycho: uniStats.BGU.FD.psycho.min,
								maxPsycho: maxPsycho,
								degreeStep: 0.01,
								visualLabel: degreePsychoOpt,
								formula: null,
							},
						},
					},
				},
			},
		},
	},
	FD: {
		label: "רקע אקדמי מלא",
		titleBase: "חישוב סכם רקע אקדמי מלא",
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				logo: defaultImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-fd-top",
						label: labelDefaultText,
						min: minDegreeAvg,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-fd-bottom",
						label: labelDefaultText,
						min: minDegreeAvg,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-fd-ext-top",
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
			[tauFD]: {
				id: tauFD,
				optText: "תל אביב",
				name: "תל אביב",
				logo: tauImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: degreeVar,
						label: `:ממוצע אקדמי מלא (${maxDegreeAvg} - ${uniStats.TAU.FD.avg.min})`,
						min: minDegreeAvg,
						max: maxDegreeAvg,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TAU.FD.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם רקע אקדמי מלא תל אביב",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TAU.FD.psycho.min}+<br>• רקע אקדמי - ${uniStats.TAU.FD.avg.min}+<br>• ציון אנגלית - ${uniStats.TAU.eng.min}+/הצלחה בקורס ברמה מתקדמים א<br>• ציון עברית (למי שנדרש) - ${uniStats.TAU.heb.min}+<br>• מתמטיקה - ${uniStats.TAU.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• רקע אקדמי - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TAU.FD.validity}<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.<br>• קיים אפיק קבלה נוסף, המיועד לבעלי הצטיינות יתרה בתואר ראשון - <u>ללא פסיכומטרי</u>!`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 2,
					calcFuncs: {
						formula: tauFDFormula,
					},
					requiredStats: {
						minDegree: uniStats.TAU.PD.avg.min,
						maxDegree: maxDegreeAvg,
						minPsycho: uniStats.TAU.PD.psycho.min,
						maxPsycho: maxPsycho,
						degreeStep: 0.01,
						visualLabel: degreePsychoOpt,
						formula: tauFDFormula,
					},
				},
			},
			[hujiFD]: {
				id: hujiFD,
				optText: "העברית",
				name: "העברית",
				logo: hujiImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: degreeVar,
						label: `:ממוצע אקדמי מלא (${maxDegreeAvg} - ${uniStats.HUJI.FD.avg.min})`,
						min: minDegreeAvg,
						max: maxDegreeAvg,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HUJI.FD.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם רקע אקדמי מלא העברית",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HUJI.FD.psycho.min}+<br>• רקע אקדמי - ${uniStats.HUJI.FD.avg.min}+<br>• ציון אנגלית - ${uniStats.HUJI.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.HUJI.heb.min}+<br>• מתמטיקה - ${uniStats.HUJI.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• רקע אקדמי - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HUJI.FD.validity}<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 3,
					calcFuncs: {
						formula: hujiFDFormula,
					},
					requiredStats: {
						minDegree: uniStats.HUJI.FD.avg.min,
						maxDegree: maxDegreeAvg,
						minPsycho: uniStats.HUJI.FD.psycho.min,
						maxPsycho: maxPsycho,
						degreeStep: 0.01,
						visualLabel: degreePsychoOpt,
						formula: hujiFDFormula,
					},
				},
			},
			[techFD]: {
				id: techFD,
				optText: "טכניון",
				name: "טכניון",
				logo: techImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: degreeVar,
						label: `:ממוצע אקדמי מלא (${maxDegreeAvg} - ${uniStats.TECH.FD.avg.min})`,
						min: minDegreeAvg,
						max: maxDegreeAvg,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TECH.FD.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם רקע אקדמי מלא טכניון",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TECH.FD.psycho.min}+<br>• רקע אקדמי - ${uniStats.TECH.FD.avg.min}+<br>• ציון אנגלית - ${uniStats.TECH.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.TECH.heb.min}+<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• רקע אקדמי - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TECH.FD.validity}<br>• מועמדים בעלי רקע אקדמי חלקי או מלא <u>ידורגו ביניהם</u> במסגרת האפיק. ניתן בונוס של <u>3 נקודות בסכם</u> לתלמידים שלמדו מקצועות <u>הנדסה, מתמטיקה או פיסיקה</u>. בכל שנה נקבע מספר המקומות על פי החלטת הדיקן - מספר זה לא יעלה על <u>15% מסך המתקבלים</u>.<br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם. מועמדים שלא יעברו את סף הזימון על סמך <u>הרקע האקדמי</u>, ימשיכו באופן אוטומטי את תהליך המיון <u>במסלול הסכם "הרגיל"</u>, ללא התחשבות ברקע האקדמי שלהם - <b>ובלבד שעברו את דרישות הסף להגשת מועמדות על בסיס רקע אקדמי!</b><br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
			},
			[bguFD]: {
				id: bguFD,
				optText: "בן גוריון",
				name: "בן גוריון",
				logo: bguImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: degreeVar,
						label: `:ממוצע אקדמי מלא (${maxDegreeAvg} - ${uniStats.BGU.FD.avg.min})`,
						min: minDegreeAvg,
						max: maxDegreeAvg,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.BGU.FD.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם רקע אקדמי מלא בן גוריון",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.BGU.FD.psycho.min}+<br>• רקע אקדמי - ${uniStats.BGU.FD.avg.min}+<br>• ציון אנגלית - ${uniStats.BGU.eng.min}+<br>• ציון עברית (למי שנדרש) - ${uniStats.BGU.heb.min}+<br>• מתמטיקה - ${uniStats.BGU.math.min}<br><h3><u>הערות נוספות</u>:</h3>• רקע אקדמי <u>מהארץ בלבד</u>.<br>• בשלב ממיין זה <u>אין סכם מספרי</u>, אלא נתוני סף בלבד.<br>• העומדים בנתוני הסף ימשיכו למבחני האישיות.<br>• ציון המעבר של כל אחד משלבי המיון בבן גוריון הוא <u>בינארי</u>.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: null,
					calcFuncs: {
						formula: null,
					},
					requiredStats: {
						minDegree: uniStats.BGU.FD.avg.min,
						maxDegree: maxDegreeAvg,
						minPsycho: uniStats.BGU.FD.psycho.min,
						maxPsycho: maxPsycho,
						degreeStep: 0.01,
						visualLabel: degreePsychoOpt,
						formula: null,
					},
				},
			},
			[haifaFD]: {
				id: haifaFD,
				optText: "חיפה",
				name: "חיפה",
				logo: haifaImg.cloneNode(),
				showSechemTable: true,
				sechemDelta: -37,
				inputs: {
					top: {
						id: topInputID,
						name: degreeVar,
						label: `:ממוצע אקדמי מלא (${maxDegreeAvg} - ${uniStats.HAIFA.FD.avg.min})`,
						min: minDegreeAvg,
						max: maxDegreeAvg,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HAIFA.FD.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minDegreeAvg,
						max: minDegreeAvg,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם רקע אקדמי מלא חיפה",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HAIFA.FD.psycho.min}+<br>• רקע אקדמי - ${uniStats.HAIFA.FD.avg.min}+<br>• ציון אנגלית - ${uniStats.HAIFA.eng.min}+/קורסים באנגלית<br>• ציון עברית (למי שנדרש) - ${uniStats.HAIFA.heb.min}+<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• רקע אקדמי - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HAIFA.FD.validity}<br>• תואר ראשון בתחומי הנדסה, טכנולוגיה, מדעים ומתמטיקה (STEM).<br>• העומדים בסף הסכם המוחלט של ${haifaDegreeSechemThreshold}, ימשיכו למבחני האישיות.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 0,
					calcFuncs: {
						formula: haifaFDFormula,
					},
					requiredStats: {
						minDegree: uniStats.HAIFA.FD.avg.min,
						maxDegree: maxDegreeAvg,
						minPsycho: uniStats.HAIFA.FD.psycho.min,
						maxPsycho: maxPsycho,
						degreeStep: 0.01,
						visualLabel: degreePsychoOpt,
						formula: haifaFDFormula,
					},
				},
			},
		},
	},
	ALT: {
		label: 'חלופות לציונים מחו"ל',
		titleBase: 'חלופות לציונים מחו"ל',
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				logo: defaultImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-hul-top",
						label: labelDefaultText,
						min: 0,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-hul-bottom",
						label: labelDefaultText,
						min: 0,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-hul-ext-top",
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
			[hujiAlt]: {
				id: hujiAlt,
				optText: "העברית",
				name: "העברית",
				logo: hujiImg.cloneNode(),
				showSechemTable: true,
				subChannels: {
					default: {
						id: defaultHuji,
						optText: "בחירת אפיק קבלה",
						name: "",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: "no-hul-top",
								label: labelDefaultText,
								min: 0,
								max: null,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: "no-hul-bottom",
								label: labelDefaultText,
								min: 0,
								max: null,
								allowDecimal: true,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								name: "no-hul-ext-top",
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: null,
							text: null,
							display: false,
						},
					},
					[hujiHulPrep]: {
						id: hujiHulPrep,
						optText: "מכינת רוטברג",
						showSechemTable: true,
						inputs: {
							top: {
								id: topInputID,
								name: prepVar,
								label: `:ממוצע מכינה (${uniStats.HUJI.HUL.prep.max} - ${uniStats.HUJI.HUL.prep.min})`,
								min: minPrep,
								max: uniStats.HUJI.HUL.prep.max,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: psychoVar,
								label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HUJI.HUL.psycho.min})`,
								min: 0,
								max: maxPsycho,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: minPrep,
								max: minPrep,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "סכם מכינת רוטברג",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HUJI.HUL.psycho.min}+<br>• מכינה - ${uniStats.HUJI.HUL.prep.min}+<br>• ציון אנגלית - ${uniStats.HUJI.eng.min}+<br>• ציון עברית - ${uniStats.HUJI.heb.min}+<br>• מתמטיקה - ${uniStats.HUJI.math.min} או חלופה כחלק מהבגרות הזרה.<br>• <b>ייתכנו תנאי סף נוספים בהתאם למדינה - יש לוודא מול מדור רישום!</b><br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• מכינה - 50%<br>• בגרות - 0%<br><h3><u>מכינות מוכרות</u>:</h3>• מכינת רוטברג<br>• <b><u>מסלולים</u>:</b> מדעי הטבע או מדעים מדוייקים והנדסה<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HUJI.HUL.prep.validity}<br>• המכינה מיועדת לבעלי תעודת בגרות שאינה מאפשרת רישום ישיר ללימודים ולמועמדים שמעוניינים לשפר את סיכויי הקבלה. <b>יש לוודא מול מדור רישום אם התעודה שלכם מאפשרת רישום ישיר ללימודים או שאתם נדרשים להשלים את המכינה!</b><br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
							display: true,
						},
						calculation: {
							type: mathType,
							mode: doubleMode,
							round: 3,
							calcFuncs: {
								formula: hujiHulPrepFormula,
							},
							requiredStats: {
								formula: hujiHulPrepFormula,
								minPrep: uniStats.HUJI.HUL.prep.min,
								maxPrep: uniStats.HUJI.HUL.prep.max,
								minPsycho: uniStats.HUJI.HUL.psycho.min,
								maxPsycho: maxPsycho,
								prepStep: 0.01,
								visualLabel: prepPsychoOpt,
							},
						},
					},
					[hujiHulPsycho]: {
						id: hujiHulPsycho,
						optText: "פסיכומטרי",
						showSechemTable: true,
						inputs: {
							top: {
								id: topInputID,
								name: "",
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
							bottom: {
								id: bottomInputID,
								name: psychoVar,
								label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HUJI.HUL.psycho.min})`,
								min: 0,
								max: maxPsycho,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "סכם פסיכומטרי",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HUJI.HUL.psycho.min}+<br>• ציון אנגלית - ${uniStats.HUJI.eng.min}+<br>• ציון עברית - ${uniStats.HUJI.heb.min}+<br>• מתמטיקה - ${uniStats.HUJI.math.min} או חלופה כחלק מהבגרות הזרה.<br>• <b>ייתכנו תנאי סף נוספים בהתאם למדינה - יש לוודא מול מדור רישום!</b><br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 100%<br>• בגרות - 0%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HUJI.HUL.psycho.validity}<br>• אפיק קבלה שמיועד לבעלי תעודת בגרות שמאפשרת קבלה ישירה ללימודים. <b>יש לוודא מול מדור רישום אם התעודה שלכם מאפשרת רישום ישיר ללימודים או שאתם נדרשים להשלים את מכינת רוטברג!</b><br>• המתמיינים באפיק זה רשאים לנסות ולשפר את נתוניהם באמצעות מכינת רוטברג - <b>הסכם הגבוה נלקח!</b><br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
							display: true,
						},
						calculation: {
							type: mathType,
							mode: singleMode,
							round: 3,
							calcFuncs: {
								formula: hujiHulPsychoFormula,
							},
							requiredStats: {
								formula: hujiHulPsychoFormula,
								minPsycho: uniStats.HUJI.HUL.psycho.min,
								maxPsycho: maxPsycho,
								prepStep: 0.01,
								visualLabel: psychoOnlyOpt,
							},
						},
					},
					[hujiHulFrench]: {
						id: hujiHulFrench,
						optText: "Baccalauréat Général",
						showSechemTable: true,
						inputs: {
							top: {
								id: topInputID,
								name: bagrutVar,
								label: `:ממוצע בגרות (${uniStats.HUJI.HUL.french.max} - ${uniStats.HUJI.HUL.french.min})`,
								min: minBagrut,
								max: uniStats.HUJI.HUL.french.max,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: psychoVar,
								label: `:פסיכומטרי (${maxPsycho} - ${uniStats.HUJI.HUL.psycho.min})`,
								min: 0,
								max: maxPsycho,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: minBagrut,
								max: minBagrut,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "סכם Baccalauréat Général",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.HUJI.HUL.psycho.min}+<br>• בגרות - ${uniStats.HUJI.HUL.french.min}+<br>• ציון אנגלית - ${uniStats.HUJI.eng.min}+<br>• ציון עברית - ${uniStats.HUJI.heb.min}+<br>• מתמטיקה - ${uniStats.HUJI.math.min} או חלופה כחלק מהבגרות הזרה.<br>• <b>ייתכנו תנאי סף נוספים - יש לוודא מול מדור רישום!</b><br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 70%<br>• בגרות - 30%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HUJI.HUL.french.validity}<br>• האפיק מיועד לבעלי תעודת בגרות צרפתית מסוג Baccalauréat Général.<br>• המתמיינים באפיק זה רשאים להתמיין גם באפיקים האחרים - <b>הסכם הגבוה נלקח!</b><br>• העומדים בסף שיקבע במאי-יוני, ימשיכו למבחני המו"ר-מרק"ם.<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
							display: true,
						},
						calculation: {
							type: mathType,
							mode: doubleMode,
							round: 3,
							calcFuncs: {
								formula: hujiHulFrenchFormula,
							},
							requiredStats: {
								formula: hujiHulFrenchFormula,
								minPrep: uniStats.HUJI.HUL.french.min,
								maxPrep: uniStats.HUJI.HUL.french.max,
								minPsycho: uniStats.HUJI.HUL.psycho.min,
								maxPsycho: maxPsycho,
								prepStep: 0.01,
								visualLabel: bagrutPsychoOpt,
							},
						},
					},
				},
			},
			[techAlt]: {
				id: techAlt,
				optText: "טכניון",
				name: "טכניון",
				logo: techImg.cloneNode(),
				showSechemTable: false,
				subChannels: {
					default: {
						id: defaultTech,
						optText: "בחירת מחשבון המרה",
						name: "",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: "no-hul-top",
								label: labelDefaultText,
								min: 0,
								max: null,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: "no-hul-bottom",
								label: labelDefaultText,
								min: 0,
								max: null,
								allowDecimal: true,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								name: "no-hul-ext-top",
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: null,
							text: null,
							display: false,
						},
					},
					[techSat]: {
						id: techSat,
						optText: "פסיכומטרי <- SAT",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: satEngVar,
								label: `:ציון אנגלית (${maxSAT} - ${minSAT})`,
								min: 0,
								max: maxSAT,
								allowDecimal: false,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: satMathVar,
								label: `:ציון מתמטי (${maxSAT} - ${minSAT})`,
								min: 0,
								max: maxSAT,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "SAT טכניון",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי משוקלל - בהתאם לאפיק הנבחר<br>• ציון אנגלית - ציון אנגלית ${uniStats.TECH.SAT.eng.min}+ או לפי האפיק הנבחר<br>• ציון עברית (למי שנדרש) - ${uniStats.TECH.heb.min}+<br><h3><u>משקלים בחישוב</u>:</h3>• ציון אנגלית - 33%<br>• ציון מתמטי - 67%<br><h3><u>הערות נוספות</u>:</h3>• המחשבון מעגל את הציון המשוקלל תמיד כלפי מטה.<br>`,
							display: true,
						},
						calculation: {
							calcFuncs: {
								formula: techSat2PsychoFormula,
							},
							requiredStats: {
								minENG: null,
								minMATH: null,
							},
						},
					},
					[techAct]: {
						id: techAct,
						optText: "פסיכומטרי <- ACT",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: actEngVar,
								label: `:ציון אנגלית (${maxACT} - ${uniStats.TECH.ACT.eng.min})`,
								min: 0,
								max: maxACT,
								allowDecimal: false,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: actMathVar,
								label: `:ציון אנגלית (${maxACT} - ${uniStats.TECH.ACT.math.min})`,
								min: 0,
								max: maxACT,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "ACT טכניון",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי משוקלל - בהתאם לאפיק הנבחר<br>• ציון אנגלית - ציון אנגלית 26+ או לפי האפיק הנבחר<br>• ציון עברית (למי שנדרש) - ${uniStats.TECH.heb.min}+<br><h3><u>משקלים בחישוב</u>:</h3>• ציון אנגלית - 33%<br>• ציון מתמטי - 67%<br><h3><u>הערות נוספות</u>:</h3>• תחילה המחשבון ממיר את ציוני הACT לציוני SAT.<br>• לאחר החישוב, המחשבון מעגל את הציון המשוקלל תמיד כלפי מטה.`,
							display: true,
						},
						calculation: {
							calcFuncs: {
								formula: techAct2PsychoFormula,
							},
							requiredStats: {
								minENG: uniStats.TECH.ACT.eng.min,
								minMATH: uniStats.TECH.ACT.math.min,
							},
						},
					},
				},
			},
			[haifaAlt]: {
				id: haifaAlt,
				optText: "חיפה",
				name: "חיפה",
				logo: haifaImg.cloneNode(),
				showSechemTable: false,
				subChannels: {
					default: {
						id: defaultTech,
						optText: "בחירת מחשבון המרה",
						name: "",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: "no-hul-top",
								label: labelDefaultText,
								min: 0,
								max: null,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: "no-hul-bottom",
								label: labelDefaultText,
								min: 0,
								max: null,
								allowDecimal: true,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								name: "no-hul-ext-top",
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: null,
							text: null,
							display: false,
						},
					},
					[haifaSat]: {
						id: haifaSat,
						optText: "פסיכומטרי <- SAT",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: satEngVar,
								label: `:ציון אנגלית (${maxSAT} - ${minSAT})`,
								min: 0,
								max: maxSAT,
								allowDecimal: false,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: satMathVar,
								label: `:ציון מתמטי (${maxSAT} - ${minSAT})`,
								min: 0,
								max: maxSAT,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "SAT חיפה",
							text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי משוקלל - בהתאם לאפיק הנבחר<br>• ציון אנגלית - ציון אנגלית ${uniStats.HAIFA.SAT.eng.min}+ או לפי האפיק הנבחר<br>• ציון עברית (למי שנדרש) - ${uniStats.HAIFA.heb.min}+<br><h3><u>משקלים בחישוב</u>:</h3>• ציון אנגלית - 50%<br>• ציון מתמטי - 50%<br><h3><u>הערות נוספות</u>:</h3>• המחשבון מעגל את הציון המשוקלל בצורה סטנדרטית.<br>`,
							display: true,
						},
						calculation: {
							calcFuncs: {
								formula: haifaSat2PsychoFormula,
							},
							requiredStats: {
								minENG: null,
								minMATH: null,
							},
						},
					},
				},
			},
		},
	},
	TZAMERET: {
		label: "צמרת (עתודה רפואית)",
		titleBase: "חישוב סכם צמרת (עתודה רפואית)",
		universities: {
			default: {
				id: defaultAC,
				optText: "בחירת אפיק קבלה",
				name: "",
				logo: tzameretImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-tzameret-top",
						label: labelDefaultText,
						min: minBagrut,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-tzameret-bottom",
						label: labelDefaultText,
						min: minBagrut,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-tzameret-ext-top",
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
			[tzameretFirst]: {
				id: tzameretFirst,
				optText: "בגרויות",
				name: "בגרויות",
				logo: tzameretImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: bagrutVar,
						label: `:ממוצע בגרות (${uniStats.TZAMERET.BAGRUT.avg.max} - ${uniStats.TZAMERET.BAGRUT.avg.min})`,
						min: minBagrut,
						max: uniStats.TZAMERET.BAGRUT.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TZAMERET.BAGRUT.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minBagrut,
						max: minBagrut,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם בגרויות צמרת",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TZAMERET.BAGRUT.psycho.min}+<br>• בגרות - ${uniStats.TZAMERET.BAGRUT.avg.min}+<br>• ציון אנגלית - ${uniStats.TZAMERET.eng.min}+ וגם 5 יח"ל<br>• ציון עברית (למי שנדרש) - ${uniStats.TZAMERET.heb.min}+<br>• מתמטיקה - ${uniStats.TZAMERET.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 70%<br>• בגרות - 30%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TZAMERET.BAGRUT.validity}<br>• תיכוניסטים העומדים בסף הפסיכומטרי/מועמדים אחרי תיכון העומדים בסף ההמתנה, ימשיכו למבחני המו"ר-מרק"ם.<br>• ניתן להשוות בקירוב לסכמי העבר - מבוססים רק על נתוני סטודנטים שבחרו לשתף!<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 3,
					calcFuncs: {
						formula: hujiBagrutFormula,
					},
					requiredStats: {
						minBagrut: uniStats.TZAMERET.BAGRUT.avg.min,
						maxBagrut: uniStats.TZAMERET.BAGRUT.avg.max,
						minPsycho: uniStats.TZAMERET.BAGRUT.psycho.min,
						maxPsycho: maxPsycho,
						bagrutStep: 0.1,
						visualLabel: bagrutPsychoOpt,
						formula: hujiBagrutFormula,
					},
				},
			},
			[tzameretPrep]: {
				id: tzameretPrep,
				optText: "מכינה אקדמית",
				name: "מכינה אקדמית",
				logo: tzameretImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: prepVar,
						label: `:ממוצע מכינה (${uniStats.TZAMERET.PREP.avg.max} - ${uniStats.TZAMERET.PREP.avg.min})`,
						min: minPrep,
						max: uniStats.TZAMERET.PREP.avg.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: psychoVar,
						label: `:פסיכומטרי (${maxPsycho} - ${uniStats.TZAMERET.PREP.psycho.min})`,
						min: 0,
						max: maxPsycho,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: minPrep,
						max: minPrep,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם מכינה צמרת",
					text: `<h3><u>תנאי סף</u>:</h3>• פסיכומטרי - ${uniStats.TZAMERET.PREP.psycho.min}+<br>• מכינה - ${uniStats.TZAMERET.PREP.avg.min}+<br>• ציון אנגלית - ${uniStats.TZAMERET.eng.min}+ וגם 5 יח"ל<br>• ציון עברית (למי שנדרש) - ${uniStats.TZAMERET.heb.min}+<br>• מתמטיקה - ${uniStats.TZAMERET.math.min}<br><h3><u>משקלים בחישוב</u>:</h3>• פסיכומטרי - 50%<br>• מכינה - 50%<br><h3><u>מכינות מוכרות</u>:</h3>• העברית - שנת תשפ"א ואילך (2021-2022).<br>• <b><u>מסלולים</u>:</b> מדעי הטבע<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TZAMERET.PREP.validity}<br>• תיכוניסטים העומדים בסף הפסיכומטרי/מועמדים אחרי תיכון העומדים בסף ההמתנה, ימשיכו למבחני המו"ר-מרק"ם.<br>• ניתן להשוות בקירוב לסכמי העבר - מבוססים רק על נתוני סטודנטים שבחרו לשתף!<br>• לסכם זה <u>קיים משקל</u> כחלק מהסכם הסופי.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 3,
					calcFuncs: {
						formula: hujiNewPrepFormula,
					},
					requiredStats: {
						minPrep: uniStats.TZAMERET.PREP.avg.min,
						maxPrep: uniStats.TZAMERET.PREP.avg.max,
						minPsycho: uniStats.TZAMERET.PREP.psycho.min,
						maxPsycho: maxPsycho,
						prepStep: 0.01,
						visualLabel: prepPsychoOpt,
						formula: hujiNewPrepFormula,
					},
				},
			},
		},
	},
};

// Final Admission Channels Config
export const FINAL_ADMISSION_CHANNELS = {
	[defaultFAC]: {
		label: "בחירת מחשבון ציון סופי",
		name: "",
		titleBase: "חישוב ציונים סופיים",
		universities: {
			default: {
				id: defaultFAC,
				optText: "",
				name: "",
				logo: defaultImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-fac-top",
						label: labelDefaultText,
						min: 0,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-fac-bottom",
						label: labelDefaultText,
						min: 0,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-fac-ext-top",
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
		},
	},
	FINAL: {
		label: "חישוב סכם קבלה",
		titleBase: "חישוב סכם קבלה",
		universities: {
			default: {
				id: defaultUni,
				optText: "בחירת מוסד לימודים",
				name: "",
				logo: defaultImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-final-top",
						label: labelDefaultText,
						min: 0,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-final-bottom",
						label: labelDefaultText,
						min: 0,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-final-ext-top",
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
			[tauFinal]: {
				id: tauFinal,
				optText: "תל אביב",
				name: "תל אביב",
				logo: tauImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: cognitiveVar,
						label: `:סכם ראשוני (${uniStats.TAU.FINAL.cognitive.max} - ${uniStats.TAU.FINAL.cognitive.min})`,
						min: 0,
						max: uniStats.TAU.FINAL.cognitive.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: morkamVar,
						label: `:מו"ר (${uniStats.TAU.FINAL.ishiuti.max} - ${uniStats.TAU.FINAL.ishiuti.threshold})`,
						min: 0,
						max: uniStats.TAU.FINAL.ishiuti.max,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם קבלה תל אביב",
					text: `<h3><u>משקלים בחישוב</u>:</h3>• סכם ראשוני - 30%<br>• מו"ר-מרק"ם - 70%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TAU.FINAL.validity}<br>• גל קבלה ראשון צפוי לקבל תשובה חיובית סביב חודש אוגוסט.<br>• גלי הקבלה ימשיכו בהדרגה, עד לכשבועיים לתוך שנה"ל.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 2,
					calcFuncs: {
						formula: tauFinalFormula,
					},
					requiredStats: {
						minCognitive: uniStats.TAU.FINAL.cognitive.min,
						maxCognitive: uniStats.TAU.FINAL.cognitive.max,
						minIshiuti: uniStats.TAU.FINAL.ishiuti.min,
						maxIshiuti: uniStats.TAU.FINAL.ishiuti.max,
						uniMinIshiuti: uniStats.TAU.FINAL.ishiuti.threshold,
						cognitiveStep: 0.01,
						ishiutiStep: 1,
						visualLabel: morOpt,
					},
				},
			},
			[hujiFinal]: {
				id: hujiFinal,
				optText: "העברית",
				name: "העברית",
				logo: hujiImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: cognitiveVar,
						label: `:סכם קוגניטיבי (${uniStats.HUJI.FINAL.cognitive.max} - ${uniStats.HUJI.FINAL.cognitive.min})`,
						min: 0,
						max: uniStats.HUJI.FINAL.cognitive.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: morkamVar,
						label: `:מרק"ם (${uniStats.HUJI.FINAL.ishiuti.max} - ${uniStats.HUJI.FINAL.ishiuti.threshold})`,
						min: 0,
						max: uniStats.HUJI.FINAL.ishiuti.max,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם קבלה העברית",
					text: `<h3><u>תנאי סף</u>:</h3>• מו"ר-מרק"ם - ${uniStats.HUJI.FINAL.ishiuti.threshold}+<br><h3><u>משקלים בחישוב</u>:</h3>• סכם קוגניטיבי - 40%<br>• מו"ר-מרק"ם - 60%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.HUJI.FINAL.validity}<br>• גל קבלה ראשון צפוי לקבל תשובה חיובית סביב חודש אוגוסט.<br>• גלי הקבלה ימשיכו בהדרגה, עד לכשבועיים לתוך שנה"ל.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 3,
					calcFuncs: {
						formula: hujiFinalFormula,
					},
					requiredStats: {
						minCognitive: uniStats.HUJI.FINAL.cognitive.min,
						maxCognitive: uniStats.HUJI.FINAL.cognitive.max,
						minIshiuti: uniStats.HUJI.FINAL.ishiuti.min,
						maxIshiuti: uniStats.HUJI.FINAL.ishiuti.max,
						uniMinIshiuti: uniStats.HUJI.FINAL.ishiuti.threshold,
						cognitiveStep: 0.001,
						ishiutiStep: 1,
						visualLabel: morkamOpt,
					},
				},
			},
			[techFinal]: {
				id: techFinal,
				optText: "טכניון",
				name: "טכניון",
				logo: techImg.cloneNode(),
				showSechemTable: true,
				subChannels: {
					default: {
						id: defaultTech,
						optText: "בחירת אפיק קבלה",
						name: "",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: "no-final-top",
								label: labelDefaultText,
								min: 0,
								max: null,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: "no-final-bottom",
								label: labelDefaultText,
								min: 0,
								max: null,
								allowDecimal: true,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								name: "no-final-ext-top",
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: null,
							text: null,
							display: false,
						},
					},
					[techBPFinal]: {
						id: techBPFinal,
						optText: "בגרויות/מכינה",
						showSechemTable: true,
						inputs: {
							top: {
								id: topInputID,
								name: cognitiveVar,
								label: `:סכם ראשוני (${uniStats.TECH.FINAL.cognitive.max} - ${uniStats.TECH.FINAL.cognitive.min})`,
								min: 0,
								max: uniStats.TECH.FINAL.cognitive.max,
								allowDecimal: true,
								display: false,
							},
							bottom: {
								id: bottomInputID,
								name: morkamVar,
								label: `:מו"ר (${uniStats.TECH.FINAL.ishiuti.max} - ${uniStats.TECH.FINAL.ishiuti.threshold})`,
								min: 0,
								max: uniStats.TECH.FINAL.ishiuti.max,
								allowDecimal: false,
								display: false,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "סכם קבלה טכניון - בגרויות/מכינה",
							text: `<h3><u>תנאי סף</u>:</h3>• מו"ר-מרק"ם - ${uniStats.TECH.FINAL.ishiuti.threshold}+<br><h3><u>משקלים בחישוב</u>:</h3>• סכם ראשוני - 30%<br>• מו"ר-מרק"ם - 70%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TECH.FINAL.validity_bp}<br>• גל קבלה ראשון צפוי לקבל תשובה חיובית סביב חודש אוגוסט.<br>• גלי הקבלה ימשיכו בהדרגה, עד לכשבועיים לתוך שנה"ל.`,
							display: true,
						},
						// calculation: {
						// 	type: mathType,
						// 	mode: singleMode,
						// 	round: 0,
						// 	calcFuncs: {
						// 		formula: techFinalFormula,
						// 	},
						// 	requiredStats: {
						// 		minCognitive: uniStats.TECH.FINAL.cognitive.min,
						// 		maxCognitive: uniStats.TECH.FINAL.cognitive.max,
						// 		minIshiuti: uniStats.TECH.FINAL.ishiuti.min,
						// 		maxIshiuti: uniStats.TECH.FINAL.ishiuti.max,
						// 		uniMinIshiuti: uniStats.TECH.FINAL.ishiuti.threshold,
						// 		cognitiveStep: 0.001,
						// 		ishiutiStep: 1,
						// 		visualLabel: morOnlyOpt,
						// 	},
						// },
					},
					[techDegFinal]: {
						id: techDegFinal,
						optText: "רקע אקדמי חלקי/מלא",
						showSechemTable: false,
						inputs: {
							top: {
								id: topInputID,
								name: degreeVar,
								label: `:ממוצע אקדמי חלקי/מלא (${maxDegreeAvg} - ${uniStats.TECH.FD.avg.min})`,
								min: minDegreeAvg,
								max: maxDegreeAvg,
								allowDecimal: true,
								display: true,
							},
							bottom: {
								id: bottomInputID,
								name: morkamVar,
								label: `:מו"ר (${uniStats.TECH.FINAL.ishiuti.max} - ${uniStats.TECH.FINAL.ishiuti.threshold})`,
								min: 0,
								max: uniStats.TECH.FINAL.ishiuti.max,
								allowDecimal: false,
								display: true,
							},
							extTop: {
								id: extTopInputID,
								label: "",
								min: 0,
								max: 0,
								allowDecimal: true,
								display: false,
							},
						},
						dialog: {
							title: "סכם קבלה טכניון - רקע אקדמי חלקי/מלא",
							text: `<h3><u>משקלים בחישוב</u>:</h3>• רקע אקדמי - 50%<br>• מו"ר-מרק"ם - 50%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TECH.FINAL.validity_deg}<br>• מועמדים בעלי רקע אקדמי חלקי או מלא ידורגו ביניהם במסגרת האפיק. בכל שנה נקבע מספר המקומות על פי החלטת הדיקן - מספר זה לא יעלה על <u>15% מסך המתקבלים</u>.<br>• גל קבלה ראשון צפוי לקבל תשובה חיובית סביב חודש אוגוסט.<br>• גלי הקבלה ימשיכו בהדרגה, עד לכשבועיים לתוך שנה"ל.`,
							display: true,
						},
					},
				},
			},
			[bguFinal]: {
				id: bguFinal,
				optText: "בן גוריון",
				name: "בן גוריון",
				logo: bguImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: cognitiveVar,
						label: ``,
						min: 0,
						max: 0,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: kabalaVar,
						label: ``,
						min: 0,
						max: 0,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם קבלה בן גוריון",
					text: `<h3><u>משקלים בחישוב</u>:</h3>• נתונים קוגניטיביים - 0%<br>• נתונים אישיותיים - 100%<br><h3><u>הערות נוספות</u>:</h3>• ציון המעבר של כל אחד משלבי המיון הוא <u>בינארי</u>.<br>• הקבלה הסופית מבוססת על <u>שקלול ההערכות של כלל הראיונות הפרונטליים</u>.<br>• גל קבלה ראשון צפוי לקבל תשובה חיובית סביב חודש אוגוסט.<br>• גלי הקבלה ימשיכו בהדרגה, עד לכשבועיים לתוך שנה"ל.`,
					display: true,
				},
			},
			[biuFinal]: {
				id: biuFinal,
				optText: "בר אילן",
				name: "בר אילן",
				logo: biuImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: cognitiveVar,
						label: ``,
						min: 0,
						max: 0,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: kabalaVar,
						label: `:סכם קבלה (${uniStats.BIU.FINAL.ishiuti.max} - ${uniStats.BIU.FINAL.ishiuti.threshold})`,
						min: 0,
						max: uniStats.BIU.FINAL.ishiuti.max,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם קבלה בר אילן",
					text: `<h3><u>משקלים בחישוב</u>:</h3>• נתונים קוגניטיביים - 15%<br>• נתונים אישיותיים - 85%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.BIU.FINAL.validity}<br>• גל קבלה ראשון צפוי לקבל תשובה חיובית סביב חודש אוגוסט.<br>• גלי הקבלה ימשיכו בהדרגה, עד לכשבועיים לתוך שנה"ל.`,
					display: true,
				},
			},
			[haifaFinal]: {
				id: haifaFinal,
				optText: "חיפה",
				name: "חיפה",
				logo: haifaImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: cognitiveVar,
						label: ``,
						min: 0,
						max: 0,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: kabalaVar,
						label: ``,
						min: 0,
						max: 0,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם קבלה חיפה",
					text: ``,
					display: true,
				},
			},
			[arielFinal]: {
				id: arielFinal,
				optText: "אריאל",
				name: "אריאל",
				logo: arielImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: cognitiveVar,
						label: ``,
						min: 0,
						max: 0,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: kabalaVar,
						label: ``,
						min: 0,
						max: 0,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם קבלה אריאל",
					text: ``,
					display: true,
				},
			},
			[tzameretFinal]: {
				id: tzameretFinal,
				optText: "צמרת (עתודה רפואית)",
				name: "צמרת (עתודה רפואית)",
				logo: tzameretImg.cloneNode(),
				showSechemTable: true,
				inputs: {
					top: {
						id: topInputID,
						name: cognitiveVar,
						label: `:סכם קוגניטיבי (${uniStats.TZAMERET.FINAL.cognitive.max} - ${uniStats.TZAMERET.FINAL.cognitive.min})`,
						min: 0,
						max: uniStats.TZAMERET.FINAL.cognitive.max,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: morkamVar,
						label: `:מרק"ם (${uniStats.TZAMERET.FINAL.ishiuti.max} - ${uniStats.TZAMERET.FINAL.ishiuti.threshold})`,
						min: 0,
						max: uniStats.TZAMERET.FINAL.ishiuti.max,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: "סכם קבלה צמרת",
					text: `<h3><u>תנאי סף</u>:</h3>• מו"ר-מרק"ם - ${uniStats.TZAMERET.FINAL.ishiuti.threshold}+<br><h3><u>משקלים בחישוב</u>:</h3>• סכם קוגניטיבי - 40%<br>• מו"ר-מרק"ם - 60%<br><h3><u>הערות נוספות</u>:</h3>• <u>תוקף נוסחת הסכם המעודכנת</u>: ${uniStats.TZAMERET.FINAL.validity}<br>• העומדים בסף שיקבע, ימשיכו לראיון אישי עם סגל התוכנית.<br>• סכמי העבר הם להערכה בלבד - מבוססים רק על נתוני סטודנטים שבחרו לשתף!<br>• גל קבלה ראשון צפוי לקבל תשובה חיובית סביב חודש ספטמבר.<br>• גלי הקבלה עשויים להימשך בהדרגה עד סמוך למועד תחילת הלימודים.`,
					display: true,
				},
				calculation: {
					type: mathType,
					mode: doubleMode,
					round: 3,
					calcFuncs: {
						formula: hujiFinalFormula,
					},
					requiredStats: {
						minCognitive: uniStats.TZAMERET.FINAL.cognitive.min,
						maxCognitive: uniStats.TZAMERET.FINAL.cognitive.max,
						minIshiuti: uniStats.TZAMERET.FINAL.ishiuti.min,
						maxIshiuti: uniStats.TZAMERET.FINAL.ishiuti.max,
						uniMinIshiuti:
							uniStats.TZAMERET.FINAL.ishiuti.threshold,
						cognitiveStep: 0.001,
						ishiutiStep: 1,
						visualLabel: morkamOpt,
					},
				},
			},
		},
	},
	ISHIUTI: {
		label: "חישוב ציון אישיותי",
		titleBase: "חישוב ציון אישיותי",
		universities: {
			default: {
				id: defaultIshiutiCalc,
				optText: "בחירת מבחן אישיותי",
				name: "",
				logo: defaultImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: "no-ishiuti-top",
						label: labelDefaultText,
						min: 0,
						max: null,
						allowDecimal: true,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: "no-ishiuti-bottom",
						label: labelDefaultText,
						min: 0,
						max: null,
						allowDecimal: true,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: "no-ishiuti-ext-top",
						label: "",
						min: 0,
						max: 0,
						allowDecimal: true,
						display: false,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
			},
			[morkamCalc]: {
				id: morkamCalc,
				optText: 'מו"ר או מרק"ם',
				name: 'מו"ר או מרק"ם',
				logo: maluImg.cloneNode(),
				showSechemTable: false,
				inputs: {
					top: {
						id: topInputID,
						name: bioVar,
						label: `:שאלון ביוגרפי (${maxMorkam} - ${minMorkam})`,
						min: 0,
						max: maxMorkam,
						allowDecimal: false,
						display: true,
					},
					bottom: {
						id: bottomInputID,
						name: compVar,
						label: `:שאלון אישיות ממוחשב (${maxMorkam} - ${minMorkam})`,
						min: 0,
						max: maxMorkam,
						allowDecimal: false,
						display: true,
					},
					extTop: {
						id: extTopInputID,
						name: stationsVar,
						label: `:תחנות הערכה (${maxMorkam} - ${minMorkam})`,
						min: 0,
						max: maxMorkam,
						allowDecimal: false,
						display: true,
					},
				},
				dialog: {
					title: null,
					text: null,
					display: false,
				},
				calculation: {
					calcFuncs: {
						formula: morkamFormula,
					},
					requiredStats: {
						minBio: minMorkam,
						maxBio: maxMorkam,
						minStations: minMorkam,
						maxStations: maxMorkam,
						minComp: minMorkam,
						maxComp: maxMorkam,
					},
				},
			},
		},
	},
};

///////////////////////////////////////////////////////////////////
//////////////////////// Main Constants ///////////////////////////
///////////////////////////////////////////////////////////////////

// Do Not Move those strings from this file!!!! An important DEPENDENCY!!!
export const sechemImportStart =
	"Sechem Frame Loading Process Has Just Started!";
export const sechemImportEnd = "Sechem Frame Has Been Successfully Loaded!";
