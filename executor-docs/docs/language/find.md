---
id: find-function
title: Find
---

## FND(array, predicate)

It returns the first element from the _array_ that the _predicate_ executes in `true`. It returns `undefined` if none element meets the _predicate_.

### Syntax

<ny-railroad-diagram diagram="Diagram('FND','(',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ',',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ,')')"></ny-railroad-diagram>

#### Parameters

| name        | description                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------- |
| `array`     | Executor that returns an array                                                                                       |
| `predicate` | Executor that will be executed for each element in the give _array_ until one of them returns `true` or until de end |

#### Returns

The first element of the _array_ which the predicate returns `true`, `undefined` if no element meets the _predicate_.

### example

```javascript
const engine = new Engine();

const executor = engine.compile('FND(PP("myArray"), EQ(SL(PP("name")), PP("myName")))');

executor({
  myArray: [
    { name: 'John', band: 'The Beatles' },
    { name: 'Paul', band: 'The Beatles' },
    { name: 'Ringo', band: 'The Beatles' },
    { name: 'George', band: 'The Beatles' },
    { name: 'Yoko', band: 'None' },
  ],
  myName: 'Ringo',
}); // returns { name: 'Ringo', band: 'The Beatles' }
```

## GE(value1, value2)

It will return `true` when the first value is greater or equals than the second value, returns `false` otherwise.
