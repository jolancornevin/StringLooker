import fuzzysort from 'fuzzysort';

export default class FuzzySearch {
    constructor(list, threshold) {
        this.list = list || [];
        this.threshold = threshold || -Infinity;
        this.cache = {};
    }

    static _formatResult(results) {
        var sortedResults = [],
            result = null,
            resultsLen = results.length;

        for (let resultIndex = 0; resultIndex < resultsLen; resultIndex++) {
            result = results[resultIndex];
            sortedResults.push(result['target']);
        }

        return sortedResults;
    }

    search(query='') {
        const cachedRes = this.cache[query];
        if (cachedRes)
            return cachedRes;

        const allResults = fuzzysort.go(query, this.list, {'threshold': this.threshold}),
            result = FuzzySearch._formatResult(allResults);
        this.cache[query] = result;

        return result;
    }
}
