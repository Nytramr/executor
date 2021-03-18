---
id: not-equals-function
title: Not equals
---

## NE(value1, value2)

It will return `true` when both values are different, returns `false` otherwise.

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

const executor = engine.compile('EQ(PP(first), PP(second))');
executor({ first: 10, second: 10 }); // returns false
executor({ first: '10', second: '10' }); // returns false
executor({ first: true, second: true }); // returns false
executor({}); // returns false
executor({ first: 10, second: '10' }); // returns true
executor({ first: false, second: true }); // returns true
executor({ first: false, second: undefined }); // returns true
executor({ first: false, second: 0 }); // returns true
```
