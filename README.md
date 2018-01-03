## Description
The principle of this "library" is to create a small helper that will allows you to do a quick (memoized) fuzzy search 
in a list of strings or objects.

The fuzzy part is use the [fuzzysort](https://github.com/farzher/fuzzysort) open source project. Thanks to them =)
Tested are made with [jasmine](https://jasmine.github.io/api/2.6)
Benchmark are made with [benchmarkjs](https://benchmarkjs.com/)

## Specification
A class so that it's possible to have multiples instances of it and thus make it avaibles for multiples list at a time.

This class will have: 
- the list of items to look into
- a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of searchs: results to memoize them
- a list of options that are specified on instanciation:
  - the size limit of the cache
  - the emptying method: either `MOST_USED` or `HEAVIEST`
  - recompute on update enabled
  - fuzzy enabled
  - cache enabled
  - case sensitive enabled
- some public methods:
  - add element to list of items: This is to add an item to the list and re-compute (or not) the memoize Map 
  - remove element to list of items: same
  - clear cache
  - search: that does the actuall search in the list

## Example
TODO

## In progress
Everything
