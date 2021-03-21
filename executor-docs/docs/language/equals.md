---
id: equals-function
title: Equals
---

## EQ(value1, value2)

It will return `true` when both values are equals, returns `false` otherwise.

### Syntax

<ny-railroad-diagram diagram="Diagram('EQ','(',
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

const executor = engine.compile('EQ(PP(first), PP(second))');
executor({ first: 10, second: 10 }); // returns true
executor({ first: '10', second: '10' }); // returns true
executor({ first: true, second: true }); // returns true
executor({}); // returns true
executor({ first: 10, second: '10' }); // returns false
executor({ first: false, second: true }); // returns false
executor({ first: false, second: undefined }); // returns false
executor({ first: false, second: 0 }); // returns false
```
