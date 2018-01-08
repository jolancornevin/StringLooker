import FuzzySearch from '../src/fuzmoisearch';

describe("FuzMoiSearch", function () {
    it("Should return empty array by default", function () {
        let fuzzy = new FuzzySearch();
        expect(fuzzy.search()).toEqual([]);
    });

    it("Should return result when matching a string in array of string", function () {
        var list = ['bonjour', 'bonsoir'],
            search = 'bonjou';
        expect(new FuzzySearch(list).search(search)).toEqual(['bonjour']);

        search = 'bon';
        expect(new FuzzySearch(list).search(search)).toEqual(['bonjour', 'bonsoir']);
    });

    it("Should use cache on duplicate request", function () {
        let list = ['bonjour', 'bonsoir'],
            search = 'bonjou',
            fuzzy = new FuzzySearch(list),
            // We spy on format result because we always use it when doing a request and it's easy to spy
            spy = spyOn(FuzzySearch, '_formatResult').and.callThrough();

        expect(fuzzy.search(search)).toEqual(['bonjour']);
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();

        expect(fuzzy.search(search)).toEqual(['bonjour']);
        expect(spy).not.toHaveBeenCalled();
    });

    it("Should add element to list", function () {
        let list = ['bonjour', 'bonsoir'],
            search = 'bonjou',
            fuzzy = new FuzzySearch(list),
            // We spy on format result because we always use it when doing a request and it's easy to spy
            spy = spyOn(FuzzySearch, '_formatResult').and.callThrough();

        expect(fuzzy.search(search)).toEqual(['bonjour']);
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();

        fuzzy.add('bonjoureuh');
        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuh']);
        expect(spy).not.toHaveBeenCalled();
        spy.calls.reset();

        fuzzy.add('bonjoureuheuh');
        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuh', 'bonjoureuheuh']);
        expect(spy).not.toHaveBeenCalled();

        fuzzy.add('bonjoureuhe');
        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuh', 'bonjoureuhe', 'bonjoureuheuh']);
        expect(spy).not.toHaveBeenCalled();
    });

    it("Should remove element to list", function () {
        let list = ['bonjour', 'bonjoureuh', 'bonjoureuhe', 'bonjoureuheuh', 'bonsoir'],
            search = 'bonjou',
            fuzzy = new FuzzySearch(list),
            // We spy on format result because we always use it when doing a request and it's easy to spy
            spy = spyOn(FuzzySearch, '_formatResult').and.callThrough();

        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuh', 'bonjoureuhe', 'bonjoureuheuh']);
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();

        fuzzy.remove('bonjoureuh');
        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuhe', 'bonjoureuheuh']);
        expect(spy).not.toHaveBeenCalled();
        spy.calls.reset();

        fuzzy.remove('bonjoureuheuh');
        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuhe']);
        expect(spy).not.toHaveBeenCalled();
    });

    it("Should clean cache", function () {
        let list = ['bonjour', 'bonjoureuh', 'bonjoureuhe', 'bonjoureuheuh', 'bonsoir'],
            search = 'bonjou',
            fuzzy = new FuzzySearch(list),
            // We spy on format result because we always use it when doing a request and it's easy to spy
            spy = spyOn(FuzzySearch, '_formatResult').and.callThrough();

        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuh', 'bonjoureuhe', 'bonjoureuheuh']);
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();

        fuzzy.reset();
        
        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuh', 'bonjoureuhe', 'bonjoureuheuh']);
        expect(spy).toHaveBeenCalled();
    });
});
