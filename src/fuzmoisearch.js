import fuzzysort from 'fuzzysort';

export default class FuzzySearch {
    constructor(list, query, threshold) {
        this.list = list || [];
        this.query = query || '';
        this.threshold = threshold || -Infinity;
    }

    static _formatResult(results) {
        var sortedResults = [],
            result = null,
            resultsLen = results.length;

        for (var resultIndex = 0; resultIndex < resultsLen; resultIndex++) {
            result = results[resultIndex];
            sortedResults.push(result['target']);
        }

        return sortedResults;
    }

    search() {
        var allResults = fuzzysort.go(this.query, this.list, {'threshold': this.threshold});
        return FuzzySearch._formatResult(allResults);
    }
}
