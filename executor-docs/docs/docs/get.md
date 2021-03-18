---
id: get-function
title: Get
---

## GET(valueName)

It will return the stored value under the name _valueName_.

### Syntax

//TODO: Add diagram

#### Parameters

##### valueName

### example

```javascript
const engine = new Engine();

const executor = engine.compile('GET(CT("someText"))');
executor({}); // returns any previously stored valued under the name "someText"
```
