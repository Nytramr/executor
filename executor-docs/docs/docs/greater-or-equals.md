---
id: greater-or-equals-function
title: Greater or equals
---

## GE(value1, value2)

It will return `true` when the first value is greater or equals than the second value, returns `false` otherwise.

### Syntax

//TODO: Add diagram

#### Parameters

| name     | description                   |
| -------- | ----------------------------- |
| `value1` | Executor that returns a value |
| `value2` | Executor that returns a value |

### example

```javascript
const engine = new Engine();

const executor = engine.compile('GE(PP(first), PP(second))');
executor({ first: 10, second: 5 }); // returns true
executor({ first: -1, second: -12 }); // returns true
executor({ first: 'b', second: 'a' }); // returns true
executor({ first: 'a', second: 'A' }); // returns true
executor({ first: 10, second: 10 }); // returns false
executor({ first: -10, second: 10 }); // returns false
executor({ first: 'a', second: 'b' }); // returns false
executor({}); // returns false
```
