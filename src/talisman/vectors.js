/**
 * Talisman helpers/vectors
 * =========================
 *
 * Compilation of various helpers to deal with vectors.
 */

/**
 * Function creating a vector of n dimensions and filling it with a single
 * value if required.
 *
 * @param  {number} n    - Dimensions of the vector to create.
 * @param  {mixed}  fill - Value to be used to fill the vector.
 * @return {array}       - The resulting vector.
 */
export function vec(n, fill) {
    const vector = new Array(n);

    if (arguments.length > 1) {
        for (let i = 0; i < n; i++)
            vector[i] = fill;
    }

    return vector;
}
