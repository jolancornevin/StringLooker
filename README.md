## Description
A small helper to do a quick (memoized) fuzzy search in a list of strings.

You can choose amongh multiples algorithms, like:
- strict matching, will only returns strings that strictly match your query
- start with, will return strings that start with your query, order by size
- an updated jaro-winkler score: that prioritize strings that start with your query, and then use the [jaro-winkler](https://fr.wikipedia.org/wiki/Distance_de_Jaro-Winkler) algorithm 
- [fuzzysort](https://github.com/farzher/fuzzysort).

100% tested and coverage with [jasmine](https://jasmine.github.io/api/2.6)

## Description

### Options
- _list_: the list of strings to look into
- _options_:
  - _threshold_: the threshold to filter not good enough strings. **Default**: Infinity
  - _algorithm_: the algorithm to use for the lookup. **Default**: SIMI **Choices**: FUZZY, SIMI, STRICT_MATCH, START_WITH
    - use `import {ALGORITHM} from 'fuzmoisearch'` to access them.

### Methods:
  - `search(query = '')`: Does the actuall search in the list :white_check_mark:
  - `add(target)`:  element to list of items :white_check_mark:
  - `remove(target)`: element to list of items :white_check_mark:
  - `reset`: reset the cache :white_check_mark:

## Example
```javascript 
let list = ['anakin', 'luc', 'leila', 'vader', 'yoda'],
    looker = new StringLooker(list, {algorithm: ALGORITHM.FUZZY});
    
looker.search();                      // => []
looker.search('l');                   // => ['luc', 'leila']

looker.add('kylo')

looker.search('l');                   // => ['luc', 'leila', 'kylo'] and no search actually done !

// Using a custom algoritm
looker = new StringLooker(
  ['123', '12', '123456'], {
    comparator: (target, query) => {
      return target.length;
    }
  })

looker.search('12')                   // => ['123456', '123', '12']
```
