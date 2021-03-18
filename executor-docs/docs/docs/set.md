---
id: set-function
title: Set
---

## SET(valueName, value)

It will store the _value_ under the name _valueName_.

### Syntax

//TODO: Add diagram

#### Parameters

| name        | description                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| `valueName` | Executor that returns a value to be use as the identifier for the `value` to be stored |
| `value`     | Executor that returns a value to be stored under the name `valueName`                  |

##### valueName

##### value

### example

```javascript
const engine = new Engine();

const executor = engine.compile('SET(CT("artistName"), PP(name))');
executor({ name: 'John' }); // will store "John" under the key "artistName"
```
