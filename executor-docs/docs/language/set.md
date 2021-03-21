---
id: set-function
title: Set
---

## SET(valueName, value)

It will store the _value_ under the name _valueName_.

### Syntax

<ny-railroad-diagram diagram="Diagram('SET','(',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ',',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ,')')"></ny-railroad-diagram>

#### Parameters

| name        | description                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| `valueName` | Executor that returns a value to be use as the identifier for the `value` to be stored |
| `value`     | Executor that returns a value to be stored under the name `valueName`                  |

### example

```javascript
const engine = new Engine();

const executor = engine.compile('SET(CT("artistName"), PP(name))');
executor({ name: 'John' }); // will store "John" under the key "artistName"
```
