---
id: and-function
title: And
---

## AN(condition1, condition2)

It will return `true` or `false` depending of the **and** evaluation of `condition1` and `condition2`.

The execution is lazy, therefore in case the first condition returns falsy value, the second condition is not evaluated.

### Syntax

//TODO: Add diagram

#### Parameters

##### condition1 and condition2

| name         | description                                |
| ------------ | ------------------------------------------ |
| `condition1` | Executor that returns a boolean like value |
| `condition2` | Executor that returns a boolean like value |

### Example

```javascript
const engine = new Engine();

const executor = engine.compile('AN(PP(first), PP(second))');
executor({ first: true, second: true }); // returns true
executor({ first: true, second: 10 }); // returns 10
executor({ first: true, second: 'true' }); // returns "true"
executor({ first: false, second: true }); // returns false
executor({ first: false, second: false }); // returns false
executor({ first: true, second: false }); // returns false
executor({ first: 0, second: false }); // returns 0
executor({ first: null, second: false }); // returns null
executor({ first: '', second: false }); // returns ''
executor({ second: true }); // returns Undefined
```
