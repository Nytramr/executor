---
id: set-function
title: Set
---

## SET(valueName, value)

It will store the _value_ under the name _valueName_.

### Syntax

//TODO: Add diagram

#### Parameters

##### valueName

##### value

### example

```javascript
const engine = new Engine();

const executor = engine.compile('SET(PP(name), CT("artistName"))');
executor({ name: 'John' }); // will store "John" under the key "artistName"
```
