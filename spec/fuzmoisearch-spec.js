import FuzzySearch from '../src/fuzmoisearch';

describe("FuzMoiSearch", function() {
    it("Should return empty array by default", function() {
        let fuzzy = new FuzzySearch();
        expect(fuzzy.search()).toEqual([]);
    });

    it("Should return result when matching a string in array of string", function() {
        var list = ['bonjour', 'bonsoir'],
            search = 'bonjou';
        expect(new FuzzySearch(list).search(search)).toEqual(['bonjour']);

        search = 'bon';
        expect(new FuzzySearch(list).search(search)).toEqual(['bonjour', 'bonsoir']);
    });

    it("Should use cache when redo request", function() {
        let list = ['bonjour', 'bonsoir'],
            search = 'bonjou',
            fuzzy = new FuzzySearch(list),
            spy = spyOn(FuzzySearch, '_formatResult').and.callThrough();

        expect(fuzzy.search(search)).toEqual(['bonjour']);
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();

        expect(fuzzy.search(search)).toEqual(['bonjour']);
        expect(spy).not.toHaveBeenCalled();
    });
});
