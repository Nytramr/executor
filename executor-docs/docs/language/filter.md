---
id: filter-function
title: Filter
---

## FLT(array, predicate)

It returns a new array with every element from the _array_ that the _predicate_ executes in `true`. If none element meets the _predicate_, it returns an empty array (`[]`)

### Syntax

<ny-railroad-diagram diagram="Diagram('FLT','(',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ',',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ,')')"></ny-railroad-diagram>

#### Parameters

| name        | description                                                         |
| ----------- | ------------------------------------------------------------------- |
| `array`     | Executor that returns an `array`                                    |
| `predicate` | Executor that will be executed for each element in the give _array_ |

#### Returns

An `array` containing very element of the _array_ which the predicate returns `true`, an empty `array` if no element meets the _predicate_.

### example

```javascript
const engine = new Engine();

const executor = engine.compile('FLT(PP("myArray"), EQ(SL(PP("band")), PP("myBand")))');

executor({
  myArray: [
    { name: 'John', band: 'The Beatles' },
    { name: 'Paul', band: 'The Beatles' },
    { name: 'Ringo', band: 'The Beatles' },
    { name: 'George', band: 'The Beatles' },
    { name: 'Yoko', band: 'None' },
  ],
  myBand: 'The Beatles',
});
/* returns [
  { name: 'John', band: 'The Beatles' },
  { name: 'Paul', band: 'The Beatles' },
  { name: 'Ringo', band: 'The Beatles' },
  { name: 'George', band: 'The Beatles' },
  { name: 'Yoko', band: 'None' },
]
*/
```
