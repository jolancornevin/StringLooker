import StringLooker, {ALGORITHM} from '../src/fuzmoisearch';

describe("FuzMoiSearch cache dehaviour", function () {
    it("Should use cache on duplicate request", function () {
        let list = ['bonjour', 'bonsoir'],
            search = 'bonjou',
            fuzzy = new StringLooker(list, {comparator: ALGORITHM.FUZZY}),
            // We spy on format result because we always use it when doing a request and it's easy to spy
            spy = spyOn(StringLooker, '_formatResult').and.callThrough();

        expect(fuzzy.search(search)).toEqual(['bonjour']);
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();

        expect(fuzzy.search(search)).toEqual(['bonjour']);
        expect(spy).not.toHaveBeenCalled();
    });

    it("Should add element to list", function () {
        let list = ['bonjour', 'bonsoir'],
            search = 'bonjou',
            fuzzy = new StringLooker(list, {comparator: ALGORITHM.FUZZY}),
            // We spy on format result because we always use it when doing a request and it's easy to spy
            spy = spyOn(StringLooker, '_formatResult').and.callThrough();

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
            fuzzy = new StringLooker(list, {comparator: ALGORITHM.FUZZY}),
            // We spy on format result because we always use it when doing a request and it's easy to spy
            spy = spyOn(StringLooker, '_formatResult').and.callThrough();

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
            fuzzy = new StringLooker(list, {comparator: ALGORITHM.FUZZY}),
            // We spy on format result because we always use it when doing a request and it's easy to spy
            spy = spyOn(StringLooker, '_formatResult').and.callThrough();

        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuh', 'bonjoureuhe', 'bonjoureuheuh']);
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();

        fuzzy.reset();

        expect(fuzzy.search(search)).toEqual(['bonjour', 'bonjoureuh', 'bonjoureuhe', 'bonjoureuheuh']);
        expect(spy).toHaveBeenCalled();
    });
});

describe("FuzMoiSearch FUZZY comparator behaviour", function () {
    it("Should return empty array by default", function () {
        let fuzzy = new StringLooker(null, {comparator: ALGORITHM.FUZZY});
        expect(fuzzy.search()).toEqual([]);
    });

    it("Should return result when matching a string in array of string and in right order", function () {
        var list = ['bonjour', 'bonsoir'],
            search = 'bonjou';

        expect(new StringLooker(list, {comparator: ALGORITHM.FUZZY}).search(search)).toEqual(['bonjour']);

        search = 'bon';
        expect(new StringLooker(list, {comparator: ALGORITHM.FUZZY}).search(search)).toEqual(['bonjour', 'bonsoir']);
    });
});


describe("FuzMoiSearch SIMI comparator behaviour", function () {
    it("Should return empty array by default", function () {
        let fuzzy = new StringLooker(null, {comparator: ALGORITHM.SIMI});
        expect(fuzzy.search()).toEqual([]);
    });

    it("Should return result when matching a string in array of string and in right order", function () {
        var list = ['interna', 'intersideral', 'splinter', 'sdgjmds', 'mint', 'nope'],
            search = 'int';
        expect(new StringLooker(list, {comparator: ALGORITHM.SIMI, threshold: 1}).search(search)).toEqual(
            ['interna', 'intersideral', 'mint', 'splinter', 'nope']
        );
    });
});

describe("FuzMoiSearch STRICT_MATCH comparator behaviour", function () {
    it("Should return empty array by default", function () {
        let fuzzy = new StringLooker(null, {comparator: ALGORITHM.STRICT_MATCH});
        expect(fuzzy.search()).toEqual([]);
    });

    it("Should return result when matching a string in array of string and in right order", function () {
        var list = ['nope', 'sdgjmds', 'mint', 'nope'];
        expect(new StringLooker(list, {comparator: ALGORITHM.STRICT_MATCH}).search('int')).toEqual([]);
        expect(new StringLooker(list, {comparator: ALGORITHM.STRICT_MATCH}).search('nope')).toEqual(['nope', 'nope']);
    });
});

describe("FuzMoiSearch START_WITH comparator behaviour", function () {
    it("Should return empty array by default", function () {
        let fuzzy = new StringLooker(null, {comparator: ALGORITHM.START_WITH});
        expect(fuzzy.search()).toEqual([]);
    });

    it("Should return result when matching a string in array of string and in right order", function () {
        var list = ['nope', 'sdgjmds', 'inter', 'nope', 'noperator'];
        expect(new StringLooker(list, {comparator: ALGORITHM.START_WITH}).search('int')).toEqual(['inter']);
        expect(new StringLooker(list, {comparator: ALGORITHM.START_WITH}).search('nope')).toEqual(['nope', 'nope', 'noperator']);
    });
});

describe("FuzMoiSearch custom comparator behaviour", function () {
    it("Should return empty array by default", function () {
        let fuzzy = new StringLooker(null, {comparator: () => {}});
        expect(fuzzy.search()).toEqual([]);
    });

    it("Should return result when matching a string in array of string and in right order", function () {
        var list = ['123', '12', '123456'];
        expect(new StringLooker(list, {comparator: (target, query) => {
            return 100 - target.length + query.length
        }}).search('12')).toEqual(['12', '123', '123456']);
    });
});
