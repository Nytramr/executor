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

## Dev Setup

### Prerequisites

In order to checkout project and run it locally you need to meet the following requirements:

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
