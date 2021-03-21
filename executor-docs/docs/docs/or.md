---
id: or-function
title: Or
---

## OR(condition1, condition2)

It will return `true` or `false` depending of the **or** evaluation of `condition1` and `condition2`.

The execution is lazy, therefore in case the first condition returns a truly value, the second condition is not evaluated.

### Syntax

<ny-railroad-diagram diagram="Diagram('OR','(',
    NonTerminal('term', optionsBuilder('href', 'term#term')),
    ',',
    NonTerminal('term', optionsBuilder('href', 'term#term')),
    ')')"></ny-railroad-diagram>

#### Parameters

| name         | description                                |
| ------------ | ------------------------------------------ |
| `condition1` | Executor that returns a boolean like value |
| `condition2` | Executor that returns a boolean like value |

### example

```javascript
const engine = new Engine();

const executor = engine.compile('OR(PP(first), PP(second))');
executor({ first: true, second: true }); // returns true
executor({ first: true, second: false }); // returns true
executor({ first: false, second: true }); // returns true
executor({ first: false, second: false }); // returns false
executor({ first: 'true', second: true }); // returns "true"
executor({ first: 10, second: false }); // returns 10
executor({ first: 0, second: false }); // returns 0
executor({ first: false, second: null }); // returns null
executor({ first: false, second: '' }); // returns ''
executor({ second: true }); // returns true
```
