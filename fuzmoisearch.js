/**
 * Created by jolancornevin
 */

const memoize = require('fast-memoize');
const fuzzysort = require('fuzzysort');

const options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    minMatchCharLength: 1
};


function fuzmoiseach(list, search, threshold) {
    list = list || [];
    search = search || '';
    threshold = threshold || -0.5;

    var allResults = fuzzysort.go(search, list),
        sortedResults = [],
        result = null;

    var resultsLen = allResults.length;

    for (var resultIndex = 0; resultIndex < resultsLen; resultIndex ++) {
        result = allResults[resultIndex];
        if (result['score'] > threshold)
            sortedResults.push(result);
    }

    return sortedResults;
}


module.exports = fuzmoiseach;