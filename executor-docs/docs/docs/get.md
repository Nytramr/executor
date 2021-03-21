---
id: get-function
title: Get
---

## GET(valueName)

It will return the stored value under the name _valueName_.

### Syntax

<ny-railroad-diagram diagram="Diagram('GET','(',
    NonTerminal('term', optionsBuilder('href', 'term#term')),
    ')')"></ny-railroad-diagram>

#### Parameters

| name        | description                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| `valueName` | Executor that returns a value to be use as the identifier for the `value` to be retrieved from the storage |

#### Returns

The previously stored value, `undefined` if non value was stored before.

### example

```javascript
const engine = new Engine();

const executor = engine.compile('GET(CT("someText"))');
executor({}); // returns any previously stored valued under the name "someText"
```
