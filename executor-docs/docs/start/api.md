---
id: api
title: Engine Class
sidebar_label: Engine
---

## constructor

```javascript
const engine = new Engine();
```

## compile

### Syntax

```javascript
compile(_textGraph_);
```

#### Parameters

| name        | description                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------ |
| `textGraph` | The textGraph is a graph like string that represents the code to be "compiled" into an executor. |

#### Return value

The executor function

### Example

```javascript
const engine = new Engine();

const executor = engine.compile('GT(PP(first), PP(second))');

executor({ first: 10, second: 5 }); // returns true
executor({ first: -1, second: -12 }); // returns true
executor({ first: 'b', second: 'a' }); // returns true
executor({ first: 'a', second: 'A' }); // returns true
executor({ first: 10, second: 10 }); // returns false
executor({ first: -10, second: 10 }); // returns false
executor({ first: 'a', second: 'b' }); // returns false
```

## define

It allows the introduction of new operators into the compiler parser, in order to extend the functionality to meet special needs.

### Syntax

```javascript
define(_operator_, _executer_);
```

#### Parameters

| name       | description                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `operator` | The operator is a string to be used by the compiler to identify the new functionality.                                                                                 |
| `executer` | The executer is a special function to be used in order to compile the operator. The function must return another function that will receive the context as a parameter |

#### Return value

`undefined`

### Example

```javascript
const engine = new Engine();

// let's define an IF operator, that depending on the boolean result of pred, will execute and return the execution of trueResult or falseResult
engine.define('IF', (pred, trueResult, falseResult) => (context) =>
  pred(context) ? trueResult(context) : falseResult(context),
);

// let's create an operator that prints in the console the value got by `valueGetter`
engine.define('CL', (valueGetter) => (context) => console.log(valueGetter(context)));

var executor = engine.compile('IF(PP(value), CL(CT("true")), CL(CT("false")))');

executor({ value: true }); // prints "true"
executor({ value: 'hello' }); // prints "true"
executor({ value: 0 }); // prints "false"
executor({}); // prints "false"
```

## getVariable

### Syntax

```javascript
getVariable(_valueName_);
```

#### Parameters

| name        | description                            |
| ----------- | -------------------------------------- |
| `valueName` | The name of the value to be retrieved. |

#### Return value

The stored value if it was previously assigned, otherwise `undefined`.

### Example

```javascript
const engine = new Engine();

const value = engine.getVariable('variableName');
```

## setVariable

### Syntax

```javascript
setVariable(_name_, _value_);
```

#### Parameters

| name    | description                                     |
| ------- | ----------------------------------------------- |
| `name`  | The name under the value is going to be stored. |
| `value` | The value to be stored.                         |

#### Return value

`undefined`

### Example

```javascript
const engine = new Engine();

engine.setVariable('variableName', 'value of the variable');
```
