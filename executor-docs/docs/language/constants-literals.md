---
id: constant-function
title: Constant and literals
---

## CT(value)

It will return an executor that always returns _value_. Is the way we can define literals or constant values.

### Syntax

<ny-railroad-diagram diagram="Diagram('CT','(',
    Choice(
      0,
      NonTerminal('string', optionsBuilder('href', '/docs/syntax/literals#string')),
      NonTerminal('number', optionsBuilder('href', '/docs/syntax/literals#number')),
      NonTerminal('boolean', optionsBuilder('href', '/docs/syntax/literals#boolean')),
    ')')"></ny-railroad-diagram>

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
