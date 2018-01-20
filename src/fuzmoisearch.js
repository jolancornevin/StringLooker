import fuzzysort from 'fuzzysort';
import {xOrThreshold, insertSort, quickSort} from './utils'
import jaroWinkler from './talisman/jaro-winkler';

const ENABLED = 'ENABLED';
const ALGORITHM = {
    'FUZZY': (target, query) => {
        // fuzzysort.single can return null
        let score = fuzzysort.single(query, target);
        if (score)
        // fuzzy returns negative scores
            return 10000 - (score.score * -1);
    },
    'SIMI': (target, query, query_len) => {
        // This makes sure that element that start with the query are prioritised
        if (target.startsWith(query)) {
            return 10000 + query_len - target.length;
        } else {
            // jaro return a score between 0 and 1. We want a negative one and between 0 and 100 instead
            return (jaroWinkler(query, target) * 100);
        }
    },
    'STRICT_MATCH': (target, query) => {
        if (target == query)
            return 10000;
    },
    'START_WITH': (target, query, query_len) => {
        if (target.startsWith(query))
            return 10000 + query_len - target.length;
    }
};
export {ALGORITHM, ENABLED}


/**
 * A small helper class that fuzzy search a string into a list of strings.
 * It uses a cache to avoid doing to many search
 */
export default class StringLooker {
    constructor(list = [], options = {}) {
        this.list = list;
        this.options = options;
        this.cache = new Map();

        this.options.threshold = options.threshold || -1;

        if (typeof options.comparator !== 'function')
            options.comparator = null;

        this.options.algorithm = options.comparator || ALGORITHM['SIMI'];
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
     * This methods does the actual search among strings, depending on the algorithm,
     * and return the sorted array of results, from best to worst match
     * @param query
     * @returns {{fuzzy, results}|*}
     * @private
     */
    _doSearch(query) {
        if (!this.list)
            return StringLooker._formatResult([]);

        let result = [],
            query_len = query.length,
            that = this;

        this.list.forEach(function (_element) {
            let element = {
                target: _element,
                score: null
            };

            element.score = xOrThreshold(
                that.options.algorithm(element.target, query, query_len),
                that.options.threshold
            );

            if (element.score > that.options.threshold) {
                result.push(element);
            }
        });

        return StringLooker._formatResult(quickSort(result));
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

    /**
     * Reset the cache
     */
    reset() {
        this.cache = new Map();
    }

    /**
     * Add the new target to the list and also re-compute all related indexes
     *
     * @param target
     */
    add(target) {
        if (!target)
            return;

        this.list.push(target);

        let that = this;
        this.cache.forEach((cachedResults, cachedQuery) => {
            // Find if the cached query can be found in the new target
            let element = {
                target: target,
                score: that.options.algorithm(target, cachedQuery, cachedQuery.length)
            };

            // fuzzysort returns null if it doesn't find anything
            if (element.score && element.score > this.options.threshold) {
                let index = insertSort(element, cachedResults.scored).index;
                cachedResults.list.splice(index, 0, element.target);
            }
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

        this.cache.forEach((cachedResults, cachedQuery) => {
            let indexToRemove = 0, listLen = cachedResults.list.length;
            while (cachedResults.list[indexToRemove] != target && indexToRemove++ < listLen);
            // Delete the target in the cached results
            cachedResults.scored.splice(indexToRemove, 1);
            cachedResults.list.splice(indexToRemove, 1);
        });
    }
}
