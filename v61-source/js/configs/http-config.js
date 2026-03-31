// ~~~~~~~~~~~ \\
// HTTP Config \\
// ~~~~~~~~~~~ \\

import { roundDigits } from "../utils/general-methods.js";

// HTTP Methods
export const httpGet = "GET";
export const httpPost = "POST";

// HTTP Status Codes
export const httpOk = 200;
export const httpServiceUnavailable = 503;

// HTTP Timeouts
export const defaultHttpTimeout = 5000;
export const preloadHttpTimout = 1000;

// HTTP Errors
export const serviceUnavailableError = "The Requested Service is Unavailable";
export const unexpectedHttpError = "Unexpected Http Error {0}";
export const abortError = "AbortError";
export const httpTimeoutError = "HttpTimeoutError";
export const httpUnexpectedError = "HttpUnexpectedError";

// General Conversion Functions
export const defaultConvFunc = (val) => val * 1;

/////////////////////////////////////////////////////////////////////
//////////////////////////// TAU HTTP ///////////////////////////////
/////////////////////////////////////////////////////////////////////
// TAU HTTP Request Constants
const httpTauUrl = "https://go.tau.ac.il/graphql";
const httpTauHeaders = { "Content-type": "application/json" };
const httpTauDataJSON = {
	operationName: "getLastScore",
	variables: {
		scoresData: {
			prog: "calctziun",
			out: "json",
			reali10: 1,
			psicho: 200,
			bagrut: 0,
		},
	},
	query: "query getLastScore($scoresData: JSON!) {\n  getLastScore(scoresData: $scoresData) {\n    body\n    __typename\n  }\n}\n",
};

// TAU HTTP Response Constants
const httpTauHatama = "hatama";
const httpTauData = "data";
const httpTauGetLastScore = "getLastScore";
const httpTauBody = "body";
const httpTauHatamaRefua = "hatama_refua";

// TAU Sechem Formulas
// Conversion Functions
export const tauPrep2BagrutConvFunc = (prep) => {
	if (prep <= 94.22) return (1185 / 962) * prep - 9429 / 962;
	return (880 / 481) * prep - 31805 / 481;
};
export const tauBagrut2PrepConvFunc = (bagrut) => {
	if (bagrut <= 106.26) return (962 * bagrut + 9429) / 1185;
	return (481 * bagrut + 31805) / 880;
};

// Gets bagrut & psycho grades and combines them in the data dict willing to send to TAU Calculator
const formTauHttpRequestData = function (bagrut, psycho, convFnc) {
	const convBagrut = convFnc(bagrut);
	return [
		httpTauUrl,
		JSON.stringify({
			...structuredClone(httpTauDataJSON),
			variables: {
				...structuredClone(httpTauDataJSON.variables),
				scoresData: {
					...structuredClone(httpTauDataJSON.variables.scoresData),
					psicho: psycho,
					bagrut: convBagrut,
				},
			},
		}),
	];
};

// TAU HTTP Request Args (method, headers & formReqFunc)
export const tauReqArgs = [httpPost, httpTauHeaders, formTauHttpRequestData];

// Checks if the given HTTP Response was sent from TAU Calculator
export const isTauResponse = (response) => response.includes(httpTauHatama);

// Parses a given HTTP Response sent from TAU Calculator
export const parseTauResponse = (response) =>
	JSON.parse(response)[httpTauData]?.[httpTauGetLastScore]?.[httpTauBody]?.[
		httpTauHatamaRefua
	];

/////////////////////////////////////////////////////////////////////
//////////////////////////// BGU HTTP ///////////////////////////////
/////////////////////////////////////////////////////////////////////
// BGU HTTP Request Constants
// export const httpBguUrl =
// 	"https://corsproxy.io/?https://bgu4u.bgu.ac.il/pls/rgwp/!rg.acc_SubmitSekem";
const httpBguBagrutSechemUrl =
	"https://bgucr4u.bgu.ac.il/ords/sc/calculators/GetSekem?p_bagrut_average={0}&p_psychometry={1}&";
const httpBguBagrutUrl =
	"https://bgucr4u.bgu.ac.il/ords/sc/calculators/GetSekem?p_final_sekem={0}&p_psychometry={1}&";
const httpBguPrepSechemUrl =
	"https://bgucr4u.bgu.ac.il/ords/sc/calculators/GetSekemPrep/?p_prep_average={0}&p_prep_psychometry={1}&";
const httpBguHeaders = {
	"Content-type": "application/x-www-form-urlencoded",
};
// export const httpBguData =
// 	"rn_include_mitsraf=0&rn_year={0}&on_bagrut_average={1}&on_psychometry={2}&on_final_sekem=";
const httpBguData = null;

// BGU HTTP Response Constants
const httpBguFinalSekem = "p_final_sekem";
const httpBguBagrut = "p_bagrut_average";
const httpBguPsycho = "p_psychometry";
const httpBguPrepSekem = "p_sekem_prep";

// BGU Sechem Formulas
// Conversion Functions
export const bguPrep2BagrutConvFunc = (prep) => prep * 1.3;
export const bguBagrut2PrepConvFunc = (bagrut) => bagrut / 1.3;

// Gets bagrut & psycho grades and combines them in the string willing to send to BGU Calculator, in order to find bagrutSechem value
// convFnc => bagrut*1 when using real bagrut, and bagrut*1.3 when bagrut is actually prep grade (bagrut = 1.3*prep)
const formBguSechemHttpRequestData = function (bagrut, psycho, convFnc) {
	const convBagrut = convFnc(bagrut);
	return [
		httpBguBagrutSechemUrl.format(roundDigits(convBagrut, 2), psycho),
		httpBguData,
	];
};

// Gets sechem & psycho grades and combines them in the string willing to send to BGU Bagrut Calculator, in order to find bagrut value
const formBguBagrutHttpRequestData = function (
	requiredSechem,
	psycho,
	convFnc
) {
	return [httpBguBagrutUrl.format(requiredSechem, psycho), httpBguData];
};

// Gets preparatory & psycho grades and combines them in the string willing to send to BGU Preparatory Calculator, in order to find prepSechem value
const formBguPrepHttpRequestData = function (prep, psycho, convFnc) {
	return [httpBguPrepSechemUrl.format(prep, psycho), httpBguData];
};

// BGU HTTP Request Args (method, headers & formReqFunc)
export const bguBagrutReqArgs = [
	httpGet,
	httpBguHeaders,
	formBguSechemHttpRequestData,
];
export const bguPrepReqArgs = [
	httpGet,
	httpBguHeaders,
	formBguPrepHttpRequestData,
];
export const bguRevBagrutReqArgs = [
	httpGet,
	httpBguHeaders,
	formBguBagrutHttpRequestData,
];

// Checks if the given HTTP Response was sent from BGU Bagrut Calculator
export const isBguBagrutResponse = function (response) {
	return response.includes(httpBguFinalSekem);
};
// Checks if the given HTTP Response was sent from BGU Preparatory Calculator
export const isBguPrepResponse = function (response) {
	return response.includes(httpBguPrepSekem);
};
// Parses a given HTTP Response sent from BGU Bagrut Calculator, looking for sechem value
export const parseBguSechemResponse = function (response) {
	return JSON.parse(response)[httpBguFinalSekem].toString();
};
// Parses a given HTTP Response sent from BGU Bagrut Calculator, looking for bagrut value
export const parseBguBagrutResponse = function (response) {
	return JSON.parse(response)[httpBguBagrut].toString();
};
// Parses a given HTTP Response sent from BGU Preparatory Calculator, looking for prepSechem value
export const parseBguPrepResponse = function (response) {
	return JSON.parse(response)[httpBguPrepSekem].toString();
};
