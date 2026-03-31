// ~~~~~~~~~~~ \\
// Bagrut Main \\
// ~~~~~~~~~~~ \\

import { bagrutImportEnd, bagrutImportStart } from "./bagrut-config.js";
import bagrutCalcSelector from "./utils/handle-bagrut-visual-changes.js";
import animation from "./utils/handle-mobile-rotation.js";

const initiateBagrutFrame = () => {
	console.log(bagrutImportStart);
	console.log(bagrutImportEnd);
};

export default initiateBagrutFrame;
