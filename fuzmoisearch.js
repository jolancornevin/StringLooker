/**
 * Created by jolancornevin
 */

const memoize = require('fast-memoize');
const Fuse = require('fuse.js');

const options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: null
};


function fuzmoiseach(list, search) {
    list = list || [];
    
    var fuse = new Fuse(list, options); // "list" is the item array
    return fuse.search(search);
}


module.exports = fuzmoiseach;