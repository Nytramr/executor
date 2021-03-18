---
id: less-or-equals-function
title: Less or equals
---

## LE(value1, value2)

It will return `true` when the first value is less or equals than the second value, returns `false` otherwise.

### Syntax

//TODO: Add diagram

#### Parameters

##### value1 and value2

### example

```javascript
const engine = new Engine();

const executor = engine.compile('LE(PP(first), PP(second))');
executor({ first: 10, second: 10 }); // returns true
executor({ first: 5, second: 10 }); // returns true
executor({ first: -1, second: 0 }); // returns true
executor({ first: 'a', second: 'b' }); // returns true
executor({ first: 'A', second: 'a' }); // returns true
executor({ first: 10, second: -10 }); // returns false
executor({ first: 'b', second: 'a' }); // returns false
executor({}); // returns false
```
