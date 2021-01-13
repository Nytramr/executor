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

### compile(text)

#### Syntax

> compile(_textGraph_)

#### Parameters

**textGraph**

The textGraph is a graph like string that represents the code to be "compiled" into an executer.

#### Return value

The executor function

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
