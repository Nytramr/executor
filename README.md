# Executor

A compact library to execute small scripts in a secure way and avoiding an [eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) expression. See also [Never use eval()!](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Never_use_eval!) or this [Stackoverflow link](https://stackoverflow.com/questions/86513/why-is-using-the-javascript-eval-function-a-bad-idea).

## Install

npm

```
$> npm install @nytramr/executor
```

yarn

```
$> yarn add @nytramr/executor
```

## API

### constructor

`const engine = new Engine();`

### compile

#### Syntax

`compile(_textGraph_);`

#### Parameters

| name        | description                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------ |
| `textGraph` | The textGraph is a graph like string that represents the code to be "compiled" into an executer. |

#### Return value

The executor function

#### Example

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

### define

It allows the introduction of new operators into the compiler parser, in order to extend the functionality to meet special needs.

#### Syntax

`define(_operator_, _executer_);`

#### Parameters

| name       | description                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `operator` | The operator is a string to be used by the compiler to identify the new functionality.                                                                                 |
| `executer` | The executer is a special function to be used in order to compile the operator. The function must return another function that will receive the context as a parameter |

#### Return value

`undefined`

#### Example

```javascript
const engine = new Engine();

// let's define an IF operator, that depending on the boolean result of pred, will execute and return the execution of trueResult or falseResult
engine.define('IF', (pred, trueResult, falseResult) => (context) =>
  pred(context) ? trueResult(context) : falseResult(context),
);

// let's create an operator that prints in the console the value got by `valueGetter`
engine.define('CL', (valueGetter) => (context) => console.log(valueGetter(context)));

var executer = engine.compile('IF(PP(value), CL(CT("true")), CL(CT("false")))');

executer({ value: true }); // prints "true"
executer({ value: 'hello' }); // prints "true"
executer({ value: 0 }); // prints "false"
executer({}); // prints "false"
```

#### Recipes

Please consider be exception free, if your new component can throw and exception, try to avoid it as much as possible.

<table>
<tr><th>
Name
</th><th>
Implementation
</th><th>
Use
</th></tr>
<tr><td>

conditional (if-else)

</td><td>

```javascript
const engine = new Engine();

engine.define('IF', (pred, trueResult, falseResult) => (context) =>
  pred(context) ? trueResult(context) : falseResult(context),
);
```

or

```javascript
const engine = new Engine();

engine.define('IF', (pred, trueResult, falseResult) => (context) =>
  (pred(context) && trueResult(context)) || falseResult(context),
);
```

</td><td>

```javascript
var executer = engine.compile('IF(PP(value), CT("true")), CL(CT("false"))');
```

</td></tr>
<tr><td>

console log

</td><td>

```javascript
const engine = new Engine();

engine.define('CL', (valueGetter) => (context) => console.log(valueGetter(context)));
```

</td><td>

```javascript
var executer = engine.compile('CL(PP(value))');
```

</td></tr>
<tr><td>

join

</td><td>

```javascript
const engine = new Engine();

engine.define('JN', (arrayGetter, string) => (context) => {
  const array = arrayGetter(context);
  if (Array.isArray(array)) return array.join(string(context));
  return ''; // you may choice to return undefined instead.
});
```

</td><td>

```javascript
var executer = engine.compile('JN(PP("myArray"), CT(","))');
```

</td></tr>
<tr><td>

find

</td><td>

```javascript
const engine = new Engine();

engine.define('FD', (arrayGetter, string) => (context) => {
  const array = arrayGetter(context);
  if (Array.isArray(array)) return array.find((element) => predicate(context, subContext, element));
  return undefined;
});
```

</td><td>

```javascript
var executer = engine.compile('FN(PP("singers"), EQ(SL(PP("name")), CT("John")))');
```

</td></tr>
<tr><td>

filter

</td><td>

```javascript
const engine = new Engine();

engine.define('FT', (arrayGetter, string) => (context) => {
  const array = arrayGetter(context);
  if (Array.isArray(array)) return array.filter((element) => predicate(context, subContext, element));
  return []; // you may choice to return undefined instead.
});
```

</td><td>

```javascript
var executer = engine.compile('FT(PP("singers"), EQ(SL(PP("band")), CT("The Beatles")))');
```

</td></tr>
</table>

### getVariable

#### Syntax

`getVariable(_name_);`

#### Parameters

| name   | description                            |
| ------ | -------------------------------------- |
| `name` | The name of the value to be retrieved. |

#### Return value

`undefined`

#### Example

```javascript
const engine = new Engine();

const value = engine.getVariable('variableName');
```

### setVariable

#### Syntax

`setVariable(_name_, _value_);`

#### Parameters

| name    | description                                     |
| ------- | ----------------------------------------------- |
| `name`  | The name under the value is going to be stored. |
| `value` | The value to be stored.                         |

#### Return value

`undefined`

#### Example

```javascript
const engine = new Engine();

engine.setVariable('variableName', 'value of the variable');
```

## Language

### PP(path)

It will return the part of the context object according to the given `path`. If at any point of the `path` a value cannot be resolved, it returns `undefined`.

#### path

<table>
<tr><td>

Overall

</td><td>

The `path` is a divided by dots (`'.'`) string like property and can be expressed the same way that any object is accessed programmatically.

</td></tr>
<tr><td>

Special Chars

</td><td>

There is also the possibility to use a path-like string between quotes to access to a property which contains non allowed chars like `.`, `-`, etc.

</td></tr>
<tr><td>

Dynamic Access

</td><td>

The use of squarebrackets allows using literals or other values of the same context as part of the `path`.

</td></tr>
</table>

#### examples

<table>
<tr><td>

Simplest use

</td><td>

It should return the value of the property `name`

</td><td>

```javascript
const engine = new Engine();

const executer = engine.compile('PP(name)');

executor({ name: 'John' }); // returns "John"
executor({ name: 'Paul' }); // returns "Paul"
```

</td></tr>
<tr><td>

Navigate in the object

</td><td>

It should return the value of the property `name` of the object `user`

</td><td>

```javascript
const engine = new Engine();

const executer = engine.compile('PP(user.name)');

executor({ user: { name: 'John' } }); // returns "John"
executor({ user: { name: 'Paul' } }); // returns "Paul"
```

</td></tr>
<tr><td>

Index in array

</td><td>

It should return the value of second position in the array

</td><td>

```javascript
const engine = new Engine();

const executer = engine.compile('PP(1)');

executor(['cero', 'uno', 'dos']); // returns "uno"
executor([20, 30, 40]); // returns 30
```

</td></tr>
<tr><td>

Use a property as a key

</td><td>

It should return the value of the property specified by the property `key`

</td><td>

```javascript
const executor = engine.compile('PP([key])');

executor({ value: 'name', key: 'value' }); // returns "name"
executor({ 'another.value': 'another name', key: 'another.value' }); // returns "another name"
executor({ value: 'name', keyNotFound: 'value' }); // returns undefined
executor({}); // returns undefined
```

or

```javascript
const executor = engine.compile('PP(PP(key))');

executor({ value: 'name', key: 'value' }); // returns "name"
executor({ 'another.value': 'another name', key: 'another.value' }); // returns "another name"
executor({ value: 'name', keyNotFound: 'value' }); // returns undefined
executor({}); // returns undefined
```

</td></tr>
<tr><td>

Use a property path as a key

</td><td>

It should return the value of the property specified by the property `sub-key` of `key`

</td><td>

```javascript
const executor = engine.compile('PP([key.sub-key])');

executor({ value: 'name', key: { 'sub-key': 'value' } }); // returns "name"
executor({ 'another value': 'another name', key: { 'sub-key': 'another value' } }); // returns "another name"
executor({ value: 'name', keyNotFound: { 'sub-key': 'value' } }); // returns undefined
executor({ value: 'name', key: { 'sub-keyNotFound': 'value' } }); // returns undefined
executor({}); // returns undefined
```

or

```javascript
const executor2 = engine.compile('PP(PP(key.sub-key))');

executor2({ value: 'name', key: { 'sub-key': 'value' } }); // returns "name"
executor2({ 'another value': 'another name', key: { 'sub-key': 'another value' } }); // returns "another name"
executor2({ value: 'name', keyNotFound: { 'sub-key': 'value' } }); // returns undefined
executor2({ value: 'name', key: { 'sub-keyNotFound': 'value' } }); // returns undefined
executor2({}); // returns undefined
```

</td></tr>
</table>

### AN(condition1, condition2)

It will return `true` or `false` depending of the **and** evaluation of `condition1` and `condition2`.

The execution is lazy, therefore in case the first condition returns falsy value, the second condition is not evaluated.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('AN(PP(first), PP(second))');
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

### CT(value)

It will return an executor that always returns _value_. Is the way we can define literals.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('CT("someText")');
executer({}); // returns "someText"
executor({ first: 10, second: '10' }); // returns "someText"
```

### EQ(value1, value2)

It will return `true` when both values are equals, returns `false` otherwise.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('EQ(PP(first), PP(second))');
executor({ first: 10, second: 10 }); // returns true
executor({ first: '10', second: '10' }); // returns true
executor({ first: true, second: true }); // returns true
executor({}); // returns true
executor({ first: 10, second: '10' }); // returns false
executor({ first: false, second: true }); // returns false
executor({ first: false, second: undefined }); // returns false
executor({ first: false, second: 0 }); // returns false
```

### GE(value1, value2)

It will return `true` when the first value is greater or equals than the second value, returns `false` otherwise.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('GE(PP(first), PP(second))');
executor({ first: 10, second: 5 }); // returns true
executor({ first: -1, second: -12 }); // returns true
executor({ first: 'b', second: 'a' }); // returns true
executor({ first: 'a', second: 'A' }); // returns true
executor({ first: 10, second: 10 }); // returns false
executor({ first: -10, second: 10 }); // returns false
executor({ first: 'a', second: 'b' }); // returns false
executor({}); // returns false
```

### GET(valueName)

It will return the stored value under the name _valueName_.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('GET(CT("someText"))');
executer({}); // returns any previously stored valued under the name "someText"
```

### GT(value1, value2)

It will return `true` when the first value is greater than the second value, returns `false` otherwise.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('GT(PP(first), PP(second))');
executor({ first: 10, second: 5 }); // returns true
executor({ first: -1, second: -12 }); // returns true
executor({ first: 'b', second: 'a' }); // returns true
executor({ first: 'a', second: 'A' }); // returns true
executor({ first: 10, second: 10 }); // returns false
executor({ first: -10, second: 10 }); // returns false
executor({ first: 'a', second: 'b' }); // returns false
executor({}); // returns false
```

### LE(value1, value2)

It will return `true` when the first value is less or equals than the second value, returns `false` otherwise.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('LE(PP(first), PP(second))');
executor({ first: 10, second: 10 }); // returns true
executor({ first: 5, second: 10 }); // returns true
executor({ first: -1, second: 0 }); // returns true
executor({ first: 'a', second: 'b' }); // returns true
executor({ first: 'A', second: 'a' }); // returns true
executor({ first: 10, second: -10 }); // returns false
executor({ first: 'b', second: 'a' }); // returns false
executor({}); // returns false
```

### LT(value1, value2)

It will return `true` when the first value is less than the second value, returns `false` otherwise.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('LT(PP(first), PP(second))');
executor({ first: 5, second: 6 }); // returns true
executor({ first: -2, second: 0 }); // returns true
executor({ first: 'a', second: 'b' }); // returns true
executor({ first: 'A', second: 'a' }); // returns true
executor({ first: 10, second: 10 }); // returns false
executor({ first: 10, second: -10 }); // returns false
executor({ first: 'b', second: 'a' }); // returns false
executor({}); // returns false
```

### NE(value1, value2)

It will return `true` when both values are different, returns `false` otherwise.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('EQ(PP(first), PP(second))');
executor({ first: 10, second: 10 }); // returns false
executor({ first: '10', second: '10' }); // returns false
executor({ first: true, second: true }); // returns false
executor({}); // returns false
executor({ first: 10, second: '10' }); // returns true
executor({ first: false, second: true }); // returns true
executor({ first: false, second: undefined }); // returns true
executor({ first: false, second: 0 }); // returns true
```

### NT(condition)

It will return `true` when the condition is `false` or `false` when the condition is `true`.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('NT(PP(first))');
executor({ first: false }); // returns true
executor({ first: 0 }); // returns true
executor({ first: null }); // returns true
executor({}); // returns true
executor({ first: true }); // returns false
executor({ first: 1 }); // returns false
executor({ first: {} }); // returns false
```

### OR(condition1, condition2)

It will return `true` or `false` depending of the **or** evaluation of `condition1` and `condition2`.

The execution is lazy, therefore in case the first condition returns a truly value, the second condition is not evaluated.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('OR(PP(first), PP(second))');
executor({ first: true, second: true }); // returns true
executor({ first: true, second: false }); // returns true
executor({ first: false, second: true }); // returns true
executor({ first: false, second: false }); // returns false
executor({ first: 'true', second: true }); // returns "true"
executor({ first: 10, second: false }); // returns 10
executor({ first: 0, second: false }); // returns 0
executor({ first: false, second: null }); // returns null
executor({ first: false, second: '' }); // returns ''
executor({ second: true }); // returns true
```

### SET(valueName, value)

It will store the _value_ under the name _valueName_.

#### example

```javascript
const engine = new Engine();

const executer = engine.compile('GET(PP(name), CT("artistName"))');
executer({name: 'John'}); // will store "John" under the key "artistName"
```

## Dev Setup

### Prerequisites

In order to checkout project and build and run tests locally you need to meet the following requirements:

- Node.js version >= 13.14.0, you can get the latest version of Node.js from [http://nodejs.org/](http://nodejs.org/),
- git, you can get git from [http://git-scm.com/](http://git-scm.com/),
- yarn, you can install yarn by running the following command: `npm install yarn -g`

### Install dev dependencies

```
$> yarn install
```

### Build the package

```
$> yarn build
```

### Test

```
$> yarn test
```
