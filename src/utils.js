const _xOrThreshold = (x, threshold) => {
    if (x != null && x != undefined)
        return x;
    return threshold;
};


/**
 * Insert in the ordered array.
 *
 * @param element
 * @param array
 * @returns {*}
 * @private
 */
const _insertSort = (element, array) => {
    let index = 0,
        arrayLen = array.length;

    for (; index < arrayLen && element.score <= array[index].score; index++);
    array.splice(index, 0, element);

    return {
        "array": array,
        "index": index
    };
};

export {_xOrThreshold, _insertSort}
