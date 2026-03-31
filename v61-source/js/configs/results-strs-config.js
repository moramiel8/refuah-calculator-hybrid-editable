// ~~~~~~~~~~~~~~~~~~~ \\
// Results Strs Config \\
// ~~~~~~~~~~~~~~~~~~~ \\

///////////////////////////////////////////////////////////////////
/////////////////////////// SECHEM ////////////////////////////////
///////////////////////////////////////////////////////////////////

// External Errors
export const sechemUnexpectedHttpError =
	'נראה שמשהו השתבש... תדווחו ל <a href=mailto:roeiduv@gmail.com>roeiduv@gmail.com</a><br>(אלא אם אתם בחו"ל ואז תנסו קודם להתחבר באמצעות VPN)';
export const httpTimeoutErrorLog =
	"שגיאה רשתית זמנית - מומלץ לנסות שוב מאוחר יותר ❗";

// Dumb User Errors
export const fillAllInputs = "יש למלא את כלל השדות הקיימים ❗";
export const invalidInputs = "חלק מהערכים שהזנת אינם חוקיים ❗";
export const chooseConvCalcLog = "יש לבחור מחשבון המרה ❗";
export const chooseIshiutiCalcLog = "יש לבחור מבחן אישיותי ❗";
export const chooseAcLog = "יש לבחור אפיק קבלה ❗";
export const chooseFAcLog = "יש לבחור מחשבון ציון סופי ❗";
export const chooseUniLog = "יש לבחור מוסד לימודים ❗";
export const choosePrepLog = "יש לבחור מחשבון סכם מכינה ❗";
export const chooseDegreeLog = "יש לבחור מחשבון סכם רקע אקדמי ❗";
export const invalidBagrutYearLog = "יש להזין שנת זכאות לבגרות תקינה ❗";

// Input Errors
export const tooLowBagrut = "ציון הבגרות שלך נמוך מהמינימום הנדרש לחוג 😥";
export const tooLowPrep = "ממוצע המכינה שלך נמוך מהמינימום הנדרש לחוג 😥";
export const tooLowDegreeAvg = "הממוצע האקדמי שלך נמוך מהמינימום הנדרש לחוג 😥";
export const tooLowPsycho = "ציון הפסיכומטרי שלך נמוך מהמינימום הנדרש לחוג 😥";
export const tooLowActEng =
	"ציון האנגלית שלך נמוך מהמינימום הנדרש לאוניברסיטה 😥";
export const tooLowActMath =
	"הציון המתמטי שלך נמוך מהמינימום הנדרש לאוניברסיטה 😥";
export const tooLowIshiuti = "הציון האישיותי שלך נמוך מהמינימום הנדרש לחוג 😥";

// Results Ok
export const noThresholdYet =
	"❔ סכם: <b>{0}</b> | טרם נקבע סף מינימלי לחוג זה השנה ❔";
export const sadLog =
	"😥 סכם: <b>{0}</b> | נמוך מהסף המינימלי הדרוש לחוג זה לשנת {1} 😥<br/><br/><u><b>אופציות לשיפור:</b></u><br/>";
export const requiredGradeLog = "{0} - {1}+<br/>";
export const improveEverythingLog = "יש לשפר את כלל הנתונים המוזנים";
export const happyLog =
	"🎉 סכם: <b>{0}</b> | עובר סף מינימלי הדרוש לחוג זה לשנת {1} 🎉";
export const happyLogWithoutSechem =
	"🎉 עובר סף מינימלי הדרוש לחוג זה לשנת {0} 🎉";
export const convertedPsychoLog =
	"🎉 ציון פסיכומטרי משוקלל: <b>{0}</b> 🎉<br>כעת ניתן להשתמש בציון הפסיכומטרי המשוקלל באפיק הקבלה הרלוונטי עבורכם 😊";
export const ishiutiGradeLog = "🤯 ציון אישיותי: <b>{0}</b> 🤯";

// General Instructive Logs
export const defaultLog = "סכם: 0";
export const sechemButtonDefaultText =
	'<i class="fas fa-paper-plane"></i> חישוב סכם';
export const sechemButtonOnClickText =
	'<i class="fas fa-spinner fa-spin"></i> מחשב סכם';
export const noFormulaLog =
	"לא הצלחנו עדין לגלות את נוסחת הסכם באפיק זה... בינתיים מוזמנים לעיין במידע המצורף 😊";
export const waitWhileCalcLog = "סבלנות... זו לא תקלה 😉";

///////////////////////////////////////////////////////////////////
/////////////////////////// BAGRUT ////////////////////////////////
///////////////////////////////////////////////////////////////////

// Defaults
export const bagrutFinalGradeDefault = "יש לבחור מקצוע 😊";
export const bagrutNoEducation = "יש לבחור סוג תעודת בגרות 😊";
export const bagrutNoCalc = "יש לבחור מחשבון בגרות 😊";

// Results Ok
export const bagrutResultText =
	'סה"כ יח"ל בחישוב: {0}/{1} | ממוצע בגרות מיטבי: {2}';
export const bagrutBaseText = 'ציון סופי בסיס ({0} יח"ל): ';
export const bagrutExtText = '\nציון סופי השלמה ({0} יח"ל): ';
export const bagrutExtFinalText = 'ציון סופי הרחבה ({0} יח"ל): ';

// Titles & Instructive Texts
export const deleteButtonTitle = "לחץ למחיקת מקצוע מחישוב הממוצע";
export const deleteButtonText = "X";
