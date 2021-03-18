---
id: get-function
title: Get
---

## GET(valueName)

It will return the stored value under the name _valueName_.

### Syntax

//TODO: Add diagram

#### Parameters

| name        | description                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| `valueName` | Executor that returns a value to be use as the identifier for the `value` to be retrieved from the storage |

### example

```javascript
const engine = new Engine();

const executor = engine.compile('GET(CT("someText"))');
executor({}); // returns any previously stored valued under the name "someText"
```
