/**
 * Talisman metrics/distance/jaro-winkler
 * =======================================
 *
 * Function computing the Jaro-Winkler score.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
 *
 * [Article]:
 * Winkler, W. E. (1990). "String Comparator Metrics and Enhanced Decision Rules
 * in the Fellegi-Sunter Model of Record Linkage".
 * Proceedings of the Section on Survey Research Methods
 * (American Statistical Association): 354–359.
 *
 * [Tags]: semimetric, string metric.
 */
import jaro from './jaro';

/**
 * Function returning the Jaro-Winkler score between two sequences.
 *
 * @param  {object} options - Custom options.
 * @param  {mixed}  a       - The first sequence.
 * @param  {mixed}  b       - The second sequence.
 * @return {number}         - The Jaro-Winkler score between a & b.
 */
function customJaroWinkler(options, a, b) {
    options = options || {};

    const {
        boostThreshold = 0.7,
        scalingFactor = 0.1
    } = options;

    if (scalingFactor > 0.25)
        throw Error('talisman/metrics/distance/jaro-winkler: the scaling factor should not exceed 0.25.');

    if (boostThreshold < 0 || boostThreshold > 1)
        throw Error('talisman/metrics/distance/jaro-winkler: the boost threshold should be comprised between 0 and 1.');

    // Fast break
    if (a === b)
        return 1;

    // Computing Jaro-Winkler score
    const dj = jaro(a, b);

    if (dj < boostThreshold)
        return dj;


    const p = scalingFactor;
    let l = 0;

    const prefixLimit = Math.min(a.length, b.length, 4);

    // Common prefix (up to 4 characters)
    for (let i = 0; i < prefixLimit; i++) {
        if (a[i] === b[i])
            l++;
        else
            break;
    }

    return dj + (l * p * (1 - dj));
}

/**
 * Jaro-Winkler standard function.
 */
const jaroWinkler = customJaroWinkler.bind(null, null);

/**
 * Jaro-Winkler distance is 1 - the Jaro-Winkler score.
 */
const distance = (a, b) => 1 - jaroWinkler(a, b);

/**
 * Exporting.
 */
export default jaroWinkler;
export {
    customJaroWinkler as custom,
    jaroWinkler as similarity,
    distance
};