## Description
The principle of this "library" is to create a small helper that will allows you to do a quick (memoized) fuzzy search 
in a list of strings or objects.

The fuzzy part is use the [fuzzysort](https://github.com/farzher/fuzzysort) open source project. Thanks to them =)

Tested are made with [jasmine](https://jasmine.github.io/api/2.6)

Benchmark are made with [benchmarkjs](https://benchmarkjs.com/)

## Specification
A class so that it's possible to have multiples instances of it and thus make it avaibles for multiples list at a time.

This class will have: 
- the list of items to look into :white_check_mark:
- a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of [searchs: results] to memoize them :white_check_mark:
- a list of options that are specified on instanciation:
  - the size limit of the cache :white_check_mark:
  - the emptying method: either `MOST_USED` or `HEAVIEST`
  - fuzzy enabled
  - case sensitive enabled --> required a PR to [fuzzysort](https://github.com/farzher/fuzzysort)
- some public methods:
  - search: that does the actuall search in the list :white_check_mark:
  - add element to list of items :white_check_mark:
  - remove element to list of items: :white_check_mark:
  - clear cache: :white_check_mark:

## Example
TODO
