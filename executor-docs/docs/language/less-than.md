---
id: less-than-function
title: Less than
---

## LT(value1, value2)

It will return `true` when the first value is less than the second value, returns `false` otherwise.

### Syntax

<ny-railroad-diagram diagram="Diagram('LT','(',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ',',
    NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')),
    ')')"></ny-railroad-diagram>

#### Parameters

| name     | description                   |
| -------- | ----------------------------- |
| `value1` | Executor that returns a value |
| `value2` | Executor that returns a value |

### example

```javascript
const engine = new Engine();

const executor = engine.compile('LT(PP(first), PP(second))');
executor({ first: 5, second: 6 }); // returns true
executor({ first: -2, second: 0 }); // returns true
executor({ first: 'a', second: 'b' }); // returns true
executor({ first: 'A', second: 'a' }); // returns true
executor({ first: 10, second: 10 }); // returns false
executor({ first: 10, second: -10 }); // returns false
executor({ first: 'b', second: 'a' }); // returns false
executor({}); // returns false
```
