import fuzzysort from 'fuzzysort';

const ENABLED = 'ENABLED';
/**
 * A small helper class that fuzzy search a string into a list of strings.
 * It uses a cache to avoid doing to many searchs
 */
export default class FuzzySearch {
    constructor(list = [], options = {}) {
        // TODO prepare
        this.list = list;
        this.options = options;
        this.options.threshold = options.threshold || -Infinity;
        this.cache = new Map();
    }

    /**
     * This method is formating the results of the query to remove all meta data of the fuzzy library
     *
     * We need to keep the original results for the add and remove methods, to sort results
     * @param results
     * @returns {Object}
     * @private
     */
    static _formatResult(results = []) {
        return {
            'fuzzy': results,
            'results': results.map(result => result['target'] || '')
        };
    }

    /**
     * Call this method to do a query on the list and look for matching strings
     * @param query
     * @returns [string]
     */
    search(query = '') {
        const cachedRes = this.cache.get(query);
        if (cachedRes)
            return cachedRes.results;

        const result = FuzzySearch._formatResult(
            fuzzysort.go(query, this.list, this.options)
        );

        this.cache.set(query, result);

        return result.results;
    }

    /**
     * Add a new target to the list and also re-compute all indexes to update their results.
     *
     * @param target
     */
    add(target) {
        // TODO prepare
        this.list.push(target);

        this.cache.forEach((cachedValue, cachedQuery) => {
            // Find if the cached query can be found in the new target
            let fuzzyResult = fuzzysort.single(cachedQuery, target),
                indexFuzzy = 0,
                fuzzyLen = cachedValue.fuzzy.length;

            // fuzzysort returns null if it doesn't find anything
            if (fuzzyResult && fuzzyResult.score > this.options.threshold) {
                // Iterate in our cached results until we find a target that have a worst score than the new target
                while (indexFuzzy < fuzzyLen && fuzzyResult.score > cachedValue.fuzzy[indexFuzzy++]);

                // Insert the new element in the cached results at the right place
                if (indexFuzzy == fuzzyLen) {
                    cachedValue.fuzzy.push(fuzzyResult);
                    cachedValue.results.push(target);
                } else {
                    cachedValue.fuzzy.splice(indexFuzzy - 1, 0, fuzzyResult);
                    cachedValue.results.splice(indexFuzzy - 1, 0, target);
                }
            }
        })
    }
}
