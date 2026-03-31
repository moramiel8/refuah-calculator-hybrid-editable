// ~~~~~~~~~~~~~~~~~~~~~~~~~ \\
// Universities Stats Config \\
// ~~~~~~~~~~~~~~~~~~~~~~~~~ \\

import { getUniSechemYears } from "../sechem/utils/handle-google-sheet.js";
import { noSechemValidity } from "../utils/general-config.js";

///////////////////////////////////////////////////////////////////
/////////////////////////// SECHEM ////////////////////////////////
///////////////////////////////////////////////////////////////////

const uniSechemYears = (await getUniSechemYears()) ?? null;

export const uniStats = {
	TAU: {
		eng: { min: 120 },
		heb: { min: 105 },
		math: { min: '4 יח"ל ציון עובר+' },
		BAGRUT: {
			avg: { min: 55, max: 117, round: 2 },
			psycho: { min: 700 },
			validity: uniSechemYears?.["TAU-FIRST"] ?? noSechemValidity,
		},
		PREP: {
			avg: { min: 90, max: 100 },
			psycho: { min: 700 },
			validity: uniSechemYears?.["TAU-PREP"] ?? noSechemValidity,
		},
		PD: {
			avg: { min: 80 },
			psycho: { min: 700 },
			validity: uniSechemYears?.["TAU-PD"] ?? noSechemValidity,
		},
		FD: {
			avg: { min: 80 },
			psycho: { min: 700 },
			validity: uniSechemYears?.["TAU-FD"] ?? noSechemValidity,
		},
		FINAL: {
			cognitive: { min: 200, max: 800 },
			ishiuti: { min: 150, max: 250, threshold: 150 },
			validity: uniSechemYears?.["TAU-FINAL"] ?? noSechemValidity,
		},
	},
	HUJI: {
		eng: { min: 120 },
		heb: { min: 105 },
		math: { min: '4 יח"ל ציון 80+ או 5 יח"ל ציון 70+ או קורס בשנה א' },
		BAGRUT: {
			avg: { min: 60, max: 127, round: 1 },
			psycho: { min: 700 },
			validity: uniSechemYears?.["HUJI-FIRST"] ?? noSechemValidity,
		},
		PREP: {
			avg: { min: 60, max: 113 },
			psycho: { min: 700 },
			validity_new: uniSechemYears?.["HUJI-PREP-NEW"] ?? noSechemValidity,
			validity_old: uniSechemYears?.["HUJI-PREP-OLD"] ?? noSechemValidity,
		},
		PD: {
			avg: { min: 60 },
			psycho: { min: 700 },
			validity: uniSechemYears?.["HUJI-PD"] ?? noSechemValidity,
		},
		FD: {
			avg: { min: 60 },
			psycho: { min: 700 },
			validity: uniSechemYears?.["HUJI-FD"] ?? noSechemValidity,
		},
		HUL: {
			prep: {
				min: 65,
				max: 107,
				validity: uniSechemYears?.["HUJI-HUL-PREP"] ?? noSechemValidity,
			},
			psycho: {
				min: 700,
				validity:
					uniSechemYears?.["HUJI-HUL-PSYCHO"] ?? noSechemValidity,
			},
			french: {
				min: 7,
				max: 20,
				validity:
					uniSechemYears?.["HUJI-HUL-FRENCH"] ?? noSechemValidity,
			},
		},
		FINAL: {
			cognitive: { min: 16, max: 30 },
			ishiuti: { min: 150, max: 250, threshold: 175 },
			validity: uniSechemYears?.["HUJI-FINAL"] ?? noSechemValidity,
		},
	},
	TECH: {
		eng: { min: 120 },
		heb: { min: 121 },
		math: { min: '5 יח"ל ציון 70+ או 4+ יח"ל ובחינת סיווג ציון 70+' },
		BAGRUT: {
			avg: { min: 0, max: 119, round: 2 },
			psycho: { min: 200 },
			validity: uniSechemYears?.["TECH-FIRST"] ?? noSechemValidity,
		},
		PREP: {
			avg: { min: 0, max: 119 },
			psycho: { min: 200 },
			validity: uniSechemYears?.["TECH-PREP"] ?? noSechemValidity,
		},
		PD: {
			avg: { min: 80 },
			psycho: { min: 700 },
			cognitive: { min: 90 },
			validity: uniSechemYears?.["TECH-PD"] ?? noSechemValidity,
		},
		FD: {
			avg: { min: 80 },
			psycho: { min: 700 },
			validity: uniSechemYears?.["TECH-FD"] ?? noSechemValidity,
		},
		SAT: {
			eng: { min: 600 },
			validity: uniSechemYears?.["TECH-SAT"] ?? noSechemValidity,
		},
		ACT: {
			math: { min: 12 },
			eng: { min: 11 },
			validity: uniSechemYears?.["TECH-ACT"] ?? noSechemValidity,
		},
		FINAL: {
			cognitive: { min: 0, max: 100.5 },
			ishiuti: { min: 150, max: 250, threshold: 190 },
			validity_bp: uniSechemYears?.["TECH-BP-FINAL"] ?? noSechemValidity,
			validity_deg:
				uniSechemYears?.["TECH-DEG-FINAL"] ?? noSechemValidity,
		},
	},
	BGU: {
		eng: { min: 120 },
		heb: { min: 116 },
		math: { min: "כל ציון" },
		BAGRUT: {
			avg: { min: 0, max: 120, round: 2 },
			psycho: { min: 680 },
			validity: uniSechemYears?.["BGU-FIRST"] ?? noSechemValidity,
		},
		PREP: {
			avg: { min: 0, max: 100 },
			psycho: { min: 680 },
			validity_prep_only:
				uniSechemYears?.["BGU-PREP-ONLY"] ?? noSechemValidity,
			validity_prep_bagrut:
				uniSechemYears?.["BGU-PREP-BAGRUT"] ?? noSechemValidity,
		},
		PD: {
			avg: { min: 95 },
			psycho: { min: 660 },
			validity_pd3: uniSechemYears?.["BGU-PD3"] ?? noSechemValidity,
			validity_pd4: uniSechemYears?.["BGU-PD4+"] ?? noSechemValidity,
		},
		FD: {
			avg: { min: 90 },
			psycho: { min: 660 },
			validity: uniSechemYears?.["BGU-FD"] ?? noSechemValidity,
		},
	},
	BIU: {
		eng: { min: 120 },
		heb: { min: 120 },
		math: { min: '4 יח"ל ציון 85+ או 5 יח"ל ציון 80+' },
		BAGRUT: {
			avg: { min: 101, max: 126, round: 2 },
			psycho: { min: 680 },
			validity: uniSechemYears?.["BIU-FIRST"] ?? noSechemValidity,
		},
		PREP: {
			avg: { min: 101, max: 114 },
			psycho: { min: 680 },
			math: { min: '5 יח"ל ציון 80+' },
			validity: uniSechemYears?.["BIU-FIRST"] ?? noSechemValidity,
		},
		FINAL: {
			ishiuti: { min: 200, max: 800, threshold: 200 },
			validity: uniSechemYears?.["BIU-FINAL"] ?? noSechemValidity,
		},
	},
	HAIFA: {
		eng: { min: 120 },
		heb: { min: 120 },
		math: { min: '4 יח"ל ציון 80+ או 5 יח"ל ציון 70+' },
		BAGRUT: {
			avg: { min: 101, max: 125, round: 2 },
			psycho: { min: 680 },
			validity: uniSechemYears?.["HAIFA-FIRST"] ?? noSechemValidity,
		},
		PREP: {
			avg: { min: 90, max: 100 },
			psycho: { min: 680 },
			math: { min: '4 יח"ל ציון 80+ או 5 יח"ל ציון 70+' },
			validity: uniSechemYears?.["HAIFA-PREP"] ?? noSechemValidity,
		},
		FD: {
			avg: { min: 85 },
			psycho: { min: 680 },
			validity: uniSechemYears?.["HAIFA-FD"] ?? noSechemValidity,
		},
		SAT: {
			eng: { min: 600 },
			validity: uniSechemYears?.["HAIFA-SAT"] ?? noSechemValidity,
		},
	},
	ARIEL: {
		eng: { min: 50 },
		heb: { min: 50 },
		math: { min: "?" },
		BAGRUT: {
			avg: { min: 0, max: 126, round: 2 },
			psycho: { min: 200 },
			validity: uniSechemYears?.["ARIEL-FIRST"] ?? noSechemValidity,
		},
		FINAL: {
			cognitive: { min: 0, max: 1 },
			ishiuti: { min: 150, max: 250, threshold: 150 },
			validity: uniSechemYears?.["ARIEL-FINAL"] ?? noSechemValidity,
		},
	},
	TZAMERET: {
		eng: { min: 120 },
		heb: { min: 105 },
		math: { min: '4 יח"ל ציון 80+ או 5 יח"ל ציון 70+ או קורס בשנה א' },
		BAGRUT: {
			avg: { min: 60, max: 127, round: 1 },
			psycho: { min: 675 },
			validity: uniSechemYears?.["TZAMERET-FIRST"] ?? noSechemValidity,
		},
		PREP: {
			avg: { min: 60, max: 113 },
			psycho: { min: 675 },
			validity: uniSechemYears?.["TZAMERET-PREP"] ?? noSechemValidity,
		},
		FINAL: {
			cognitive: { min: 16, max: 30 },
			ishiuti: { min: 150, max: 250, threshold: 175 },
			validity: uniSechemYears?.["TZAMERET-FINAL"] ?? noSechemValidity,
		},
	},
};
