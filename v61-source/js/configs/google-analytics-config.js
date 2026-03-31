// ~~~~~~~~~~~~~~~~~~~~~~~ \\
// Google Analytics Config \\
// ~~~~~~~~~~~~~~~~~~~~~~~ \\

///////////////////////////////////////////////////////////////////
/////////////////////////// SECHEM ////////////////////////////////
///////////////////////////////////////////////////////////////////

export const sechemEventName = "SECHEM_CALC";
export const sechemEventLabel = "SECHEM_TYPE = {0}{1}{2}{3}";
export const extraInputEventLabel = ", {0} = {1}";
export const sechemStr = "-SECHEM";
export const httpErrorEventName = "HTTP_ERROR";
export const sechemHttpErrorEventCategory = "SECHEM_HTTP_ERROR";
export const sechemHttpErrorLabel =
	"URL = {0}, HEADERS = {1}, DATA = {2}, NAME = {3}, MESSAGE = {4}";

///////////////////////////////////////////////////////////////////
/////////////////////////// BAGRUT ////////////////////////////////
///////////////////////////////////////////////////////////////////

// Bagrut Avg Calc
export const bagrutAvgEventName = "BAGRUT_AVG_CALC";
export const bagrutAvgEventLabel = "EDU = {0}, UNI = {1}, AVG = {2}";

// Bagrut Ref
export const bagrutRefEventName = "BAGRUT_REF_OPENED";
export const bagrutRefEventLabel = "REF_URL = {0}";

// Bagrut Subject Calc
export const bagrutSubjEventName = "BAGRUT_SUBJ_CALC";
export const bagrutSubjCategoryBase = "{0}-{1}";
export const bagrutSubjEventLabel = "SUBJ = {0}, VAR = {1}{2}";
export const bagrutSubjBase = ", BASE = {0}";
export const bagrutSubjExt = ", EXT = {0}";
export const bagrutSubjExtFinalGrade = ", EXT_FINAL_GRADE = {0}";

///////////////////////////////////////////////////////////////////
/////////////////////////// GENERAL ///////////////////////////////
///////////////////////////////////////////////////////////////////

// General Visit Log
export const visitEventName = "USER_VISIT";

// Contact Email
export const contactEmailEventName = "CONTACT_EMAIL";
export const contactEmailEventLabel = "ISSUER_FORM_ID = {0}";

// Install App
export const installAppEventName = "INSTALL_APP";
export const installAppEventLabel = "PLATFORM = {0}, USER_AGENT = {1}";

// Popup Dialog
export const popupDialogEventName = "OPEN_DIALOG";
export const popupDialogEventLabel = "DIALOG_TYPE = {0}";

// General Stuff
export const eventKey = "event";
