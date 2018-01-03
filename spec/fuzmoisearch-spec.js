const fuzmoiseach = require('../fuzmoisearch');

describe("FuzMoiSearch", function() {
    it("Should return empty array by default", function() {
        expect(fuzmoiseach()).toEqual([]);
    });
});