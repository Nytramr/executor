---
id: not-function
title: Not
---

## NT(condition)

It will return `true` when the condition is `false` or `false` when the condition is `true`.

### Syntax

<ny-railroad-diagram diagram="Diagram('NT','(',
    NonTerminal('term', optionsBuilder('href', 'term#term')),
    ')')"></ny-railroad-diagram>

#### Parameters

| name        | description                                |
| ----------- | ------------------------------------------ |
| `condition` | Executor that returns a boolean like value |

### example

```javascript
const engine = new Engine();

const executor = engine.compile('NT(PP(first))');
executor({ first: false }); // returns true
executor({ first: 0 }); // returns true
executor({ first: null }); // returns true
executor({}); // returns true
executor({ first: true }); // returns false
executor({ first: 1 }); // returns false
executor({ first: {} }); // returns false
```
