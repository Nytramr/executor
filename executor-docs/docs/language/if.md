---
id: if-function
title: If
---

## IF(condition, consequent, alternative)

The `consequent` executor will be executed and its value returned when the `condition` returns `true`, otherwise the `alternative` executer will be executed and its value returned.

### Syntax

<ny-railroad-diagram diagram="Diagram('IF','(',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ',',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ',',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ,')')"></ny-railroad-diagram>

#### Parameters

| name          | description                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| `condition`   | Executor that returns a boolean like value                                                 |
| `consequent`  | Executor that will be executed and its value returned when the condition returns `true`    |
| `alternative` | Executor that will be executed and its value returned when the condition returns no `true` |

#### Returns

The value returned by the `consequent` executer when the condition returns _falsy_, otherwise the value returned by `alternative` executer.

### Example

```javascript
const engine = new Engine();

const executor = engine.compile('IF(LE(first, second), false, true');
executor({ first: 10, second: 10 }); // returns false
executor({ first: 5, second: 10 }); // returns false
executor({ first: -1, second: 0 }); // returns false
executor({ first: 'a', second: 'b' }); // returns false
executor({ first: 'A', second: 'a' }); // returns false
executor({ first: 10, second: -10 }); // returns true
executor({ first: 'b', second: 'a' }); // returns true
executor({}); // returns true
```
