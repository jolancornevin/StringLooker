/**
 * Created by jolancornevin
 */

const memoize = require('fast-memoize');
const fuzzysort = require('fuzzysort');

function _formatResult(results) {
    var sortedResults = [],
          result = null,
          resultsLen = results.length;

    for (var resultIndex = 0; resultIndex < resultsLen; resultIndex ++) {
        result = results[resultIndex];
        sortedResults.push(result['target']);
    }

    return sortedResults;
}

function fuzmoiseach(list, search, threshold) {
    list = list || [];
    search = search || '';
    threshold = threshold || -Infinity;

    // Do the search
    var allResults = fuzzysort.go(search, list, {threshold: threshold});
    return _formatResult(allResults);
}


module.exports = fuzmoiseach;
