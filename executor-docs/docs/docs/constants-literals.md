---
id: constant-function
title: Constant
---

## CT(value)

It will return an executor that always returns _value_. Is the way we can define literals or constant values.

### Syntax

//TODO: Add diagram

#### Parameters

| name    | description                   |
| ------- | ----------------------------- |
| `value` | Executor that returns a value |

### Example

```javascript
const engine = new Engine();

const executor = engine.compile('CT("someText")');
executor({}); // returns "someText"
executor({ first: 10, second: '10' }); // returns "someText"
```
