import fuzzysort from 'fuzzysort';
import jaroWinkler from './talisman/jaro-winkler';

const ENABLED = 'ENABLED';
const ALGORITHM = {
    'FUZZY': 'FUZZY',
    'SIMI': 'SIMI',
    'STRICT_MATCH': 'STRICT_MATCH',
    'START_WITH': 'START_WITH'
};

export {ALGORITHM, ENABLED}
/**
 * A small helper class that fuzzy search a string into a list of strings.
 * It uses a cache to avoid doing to many search
 */
export default class FuzzySearch {
    constructor(list = [], options = {}) {
        this.list = list;
        this.options = options;

        this.options.threshold = options.threshold || -Infinity;
        if (this.options.threshold > 0)
            this.options.threshold *= -1;

        this.options.algorithm = ALGORITHM[options.algorithm] || ALGORITHM['SIMI'];

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
            'scored': results,
            'list': results.map(result => result['target'] || '')
        };
    }

    /**
     * Insert in the ordered array.
     * @param element
     * @param array
     * @returns {*}
     * @private
     */
    _insertSort(element, array) {
        let index = 0,
            arrayLen = array.length;

        for (; index < arrayLen && element.score >= array[index].score; index++);
        array.splice(index, 0, element);

        return array;
    }

    /**
     * This methods does the actual search among strings, depending on the algorithm,
     * and return the sorted array of results, from best to worst match
     * @param query
     * @returns {{fuzzy, results}|*}
     * @private
     */
    _doSearch(query) {
        if (!this.list)
            return FuzzySearch._formatResult([]);

        if (this.options.algorithm == ALGORITHM['FUZZY']) {
            return FuzzySearch._formatResult(
                fuzzysort.go(query, this.list, this.options)
            );
        } else {
            let result = [],
                query_len = query.length,
                that = this;

            this.list.forEach(function (_element) {
                let element = {
                    target: _element,
                    score: that.options.threshold
                };

                switch (that.options.algorithm) {
                    case ALGORITHM['SIMI']:
                        // This makes sure that element that start with the query are prioritised
                        if (element.target.startsWith(query)) {
                            element.score = (query_len - 1000) + element.target.length;
                        } else {
                            // jaro return a score between 0 and 1. We want a negative one and between 0 and 100 instead
                            element.score = (jaroWinkler(query, element.target) * -100) || that.options.threshold;
                        }
                        break;
                    case ALGORITHM['STRICT_MATCH']:
                        if (element.target == query)
                            element.score = -1000;
                        break;
                    case ALGORITHM['START_WITH']:
                        if (element.target.startsWith(query))
                            element.score = (query_len - 1000) + element.target.length;
                        break;
                }

                if (element.score > that.options.threshold) {
                    result = that._insertSort(element, result);
                }
            });

            return FuzzySearch._formatResult(result);
        }
    }

    /**
     * Call this method to do a query on the list and look for matching strings
     * @param query
     * @returns [string]
     */
    search(query = '') {
        const cachedRes = this.cache.get(query);
        if (cachedRes)
            return cachedRes.list;

        const result = this._doSearch(query);

        this.cache.set(query, result);

        return result.list;
    }

    reset() {
        this.cache = new Map();
    }

    /**
     * Add the new target to the list and also re-compute all related indexes
     *
     * @param target
     */
    add(target) {
        this.list.push(target);

        this._iterateTroughCached(target, (indexToInsert, result, cachedValue) => {
            // Insert the new target in the cached results
            cachedValue.scored.splice(indexToInsert, 0, result);
            cachedValue.list.splice(indexToInsert, 0, target);
        });
    }

    /**
     * Remove the target from the list and re-compute all related indexes
     * @param target
     */
    remove(target) {
        let targetIndex = this.list.indexOf(target);
        if (targetIndex == -1)
            return;

        this.list.splice(targetIndex, 1);

        this._iterateTroughCached(target, (indexToDelete, _, cachedValue) => {
            // Delete the target in the cached results
            cachedValue.scored.splice(indexToDelete, 1);
            cachedValue.list.splice(indexToDelete, 1);
        });
    }

    /**
     * A generic method that iterate over the cached results and call the cb function when it find a place that match
     * @param target
     * @param cb
     * @private
     */
    _iterateTroughCached(target, cb) {
        this.cache.forEach((cachedValue, cachedQuery) => {
            // Find if the cached query can be found in the new target
            let fuzzyResult = fuzzysort.single(cachedQuery, target),
                indexFuzzy = 0,
                fuzzyLen = cachedValue.scored.length;

            // fuzzysort returns null if it doesn't find anything
            if (fuzzyResult && fuzzyResult.score > this.options.threshold) {
                // Iterate in our cached results until we find a target that have a worst score than the new target
                while (indexFuzzy < fuzzyLen && fuzzyResult.score < cachedValue.scored[indexFuzzy].score) {
                    // Do this here and not in the while statement to avoid having to decrease it at the end
                    indexFuzzy++;
                }

                cb(indexFuzzy, fuzzyResult, cachedValue);
            }
        });
    }
}