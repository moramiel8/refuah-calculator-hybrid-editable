// ~~~~~~~~~~~ \\
// Sechem Main \\
// ~~~~~~~~~~~ \\

import { sechemImportEnd, sechemImportStart } from "./sechem-config.js";
import updateSechemVisualChanges from "./utils/handle-sechem-visual-changes.js";
import initiateSechemCalc from "./utils/handle-sechem-calc.js";

const initiateSechemFrame = () => {
	console.log(sechemImportStart);
	console.log(sechemImportEnd);
};

export default initiateSechemFrame;
