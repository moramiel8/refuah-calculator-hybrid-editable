// ~~~~~~~~~~~~~~~~~~~~~ \\
// Update Bagrut Average \\
// ~~~~~~~~~~~~~~~~~~~~~ \\

import { noAverage } from "../bagrut-config.js";
import { isInvalidBagrutUnitsNum } from "./bagrut-general-rules.js";
import { isDefaultOpt, roundDigits } from "../../utils/general-methods.js";
import { hyphenSlicer } from "../../utils/general-config.js";
import { displayBagrutAvg } from "./update-bagrut-results.js";
import setBagrutResultsDivColor from "./handle-bagrut-visual-changes.js";
import { uniStats } from "../../configs/uni-stats-config.js";
import {
	defaultColor,
	invalidUnitsNumColor,
	validUnitsNumColor,
} from "../../configs/html-config.js";

// Gets the calculated bagrut-average, number of calculated units, total number of units and current university & displays the appropriate bagrut-average
const displayAvg = function (
	avg,
	unitsNum,
	totalUnitsNum,
	deltaUnits,
	education,
	university
) {
	// Gets current university's max bagrut-average and roundVar
	let uni = university.split(hyphenSlicer)[0];
	let maxUniAvg = uniStats[uni]?.BAGRUT?.avg?.max || 100;
	let uniAvgRound = uniStats[uni]?.BAGRUT?.avg?.round || 2;

	// Removes units added only for calculation purposes (etc. TECH's 5/4-units math)
	let realUnitsNum = unitsNum - deltaUnits;

	let finalAvg = avg;
	// No row was filled - bagrut-average = 0
	if (!avg || isNaN(avg)) {
		displayBagrutAvg(realUnitsNum, totalUnitsNum, noAverage);
		finalAvg = noAverage;
	}

	// Checks if current bagrut-average is bigger than university's max bagrut-average
	// If so, sets it as the max allowed value
	else if (avg > maxUniAvg) {
		displayBagrutAvg(realUnitsNum, totalUnitsNum, maxUniAvg);
		finalAvg = maxUniAvg;
	} else {
		// Rounds the given avg to the acceptable amount of digits defined by the selected university
		finalAvg = roundDigits(avg, uniAvgRound);

		// Displays the calculated bagrut avg
		displayBagrutAvg(realUnitsNum, totalUnitsNum, finalAvg);
	}

	// Sets the background color of bagrut-results-div
	if (!totalUnitsNum || isDefaultOpt(university)) {
		setBagrutResultsDivColor(defaultColor); // default gray color
	} else if (isInvalidBagrutUnitsNum(totalUnitsNum, education, university)) {
		setBagrutResultsDivColor(invalidUnitsNumColor); // red theme
	} else {
		setBagrutResultsDivColor(validUnitsNumColor); // green theme
	}

	return finalAvg;
};

export default displayAvg;
