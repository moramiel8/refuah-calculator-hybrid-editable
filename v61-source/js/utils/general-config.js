// ~~~~~~~~~~~~~~ \\
// General Config \\
// ~~~~~~~~~~~~~~ \\

///////////////////////////////////////////////////////////////////
//////////////////////// Input Constants //////////////////////////
///////////////////////////////////////////////////////////////////

// Allowed specific control keys, shortcuts, and page navigation keys
export const allowedKeys = [
	"Backspace",
	"Delete",
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Tab",
	"Enter",
	"Escape",
	"F5",
	"F6",
	"F7",
	"F8",
	"F9",
	"F10",
	"F11",
	"F12",
];
export const ctrlShortcuts = [
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyR",
	"Minus",
	"Equal",
];
export const decimalSeperator = ".";

///////////////////////////////////////////////////////////////////
//////////////////// Universities Constants ///////////////////////
///////////////////////////////////////////////////////////////////

// Univesity Logo Images
export const defaultImg = new Image("200", "200");
defaultImg.src = "./src/img/default-uni.png";
export const tauImg = new Image("200", "200");
tauImg.src = "./src/img/tau.png";
export const hujiImg = new Image("200", "200");
hujiImg.src = "./src/img/huji.png";
export const techImg = new Image("200", "200");
techImg.src = "./src/img/tech.png";
export const bguImg = new Image("200", "200");
bguImg.src = "./src/img/bgu.png";
export const biuImg = new Image("200", "200");
biuImg.src = "./src/img/biu.png";
export const haifaImg = new Image("200", "200");
haifaImg.src = "./src/img/haifa.png";
export const arielImg = new Image("200", "200");
arielImg.src = "./src/img/ariel.png";
export const tzameretImg = new Image("200", "200");
tzameretImg.src = "./src/img/tzameret.png";
export const maluImg = new Image("200", "200");
maluImg.src = "./src/img/malu.png";

// Universities
export const defaultOpt = "default";
export const defaultUni = "default-uni";
export const TAU = "TAU";
export const HUJI = "HUJI";
export const TECH = "TECH";
export const BGU = "BGU";
export const BIU = "BIU";
export const HAIFA = "HAIFA";
export const TZAMERET = "TZAMERET";
export const hyphenSlicer = "-";

///////////////////////////////////////////////////////////////////
//////////////////// Popup Dialog Constants ///////////////////////
///////////////////////////////////////////////////////////////////

// PopupDialog Text Constants
export const noDialog2DisplayText = "לא מצאנו מה לרשום כאן...<br>יש לכם רעיון?";
export const dialogTitleBase = "מידע נוסף - {0}";
export const noSechemValidity = "?";

///////////////////////////////////////////////////////////////////
//////////////////////// Mailto Constants /////////////////////////
///////////////////////////////////////////////////////////////////

// Install Button Constants
export const mailToPar = `
            {0} Ⓒ רועי דובדבני | להצעות ולשינויים, צרו קשר במייל
            <a id="{1}" href="mailto:roeiduv@gmail.com">roeiduv@gmail.com</a>`;
export const mailToNotFoundLog = "mailto-paragraph element not found";
