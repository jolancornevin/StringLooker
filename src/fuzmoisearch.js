import fuzzysort from 'fuzzysort';

/**
 * A small helper class that fuzzy search a string into a list of strings.
 * It uses a cache to avoid doing to many searchs
 */
export default class FuzzySearch {
    constructor(list, options) {
        options = options || {};

        this.list = list || [];
        this.threshold = options.threshold || -Infinity;
        this.cache = new Map();
    }

    /**
     * This method is formating the results of the query, and returns a list of string instead of a list of objects
     * @param results
     * @returns {Array}
     * @private
     */
    static _formatResult(results) {
        return results.map(result => result['target']);
    }

    /**
     * Call this method to do a query on the list and look for matching strings
     * @param query
     * @returns [string]
     */
    search(query='') {
        const cachedRes = this.cache.get(query);
        if (cachedRes)
            return cachedRes;

        const allResults = fuzzysort.go(query, this.list, {'threshold': this.threshold}),
            result = FuzzySearch._formatResult(allResults);

        this.cache.set(query, result);

        return result;
    }
}
