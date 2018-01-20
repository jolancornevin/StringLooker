const xOrThreshold = (x, threshold) => {
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
const insertSort = (element, array) => {
    let index = 0,
        arrayLen = array.length;

    for (; index < arrayLen && element.score <= array[index].score; index++);
    array.splice(index, 0, element);

    return {
        "array": array,
        "index": index
    };
};

const quickSort = (arr) => {return _quickSort(arr, 0, arr.length - 1)}
const _quickSort = (arr, left, right) => {
    var len = arr.length,
        pivot,
        partitionIndex;

    if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);

        //sort left and right
        _quickSort(arr, left, partitionIndex - 1);
        _quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
};

const partition = (arr, pivot, left, right) => {
    var pivotValue = arr[pivot].score,
        partitionIndex = left;

    for(var i = left; i < right; i++) {
        if(arr[i].score > pivotValue) {
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
};

const swap = (arr, i, j) => {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
};

export {xOrThreshold, insertSort, quickSort}
