---
id: less-than-function
title: Less than
---

## LT(value1, value2)

It will return `true` when the first value is less than the second value, returns `false` otherwise.

### Syntax

//TODO: Add diagram

#### Parameters

##### value1 and value2

### example

```javascript
const engine = new Engine();

const executor = engine.compile('LT(PP(first), PP(second))');
executor({ first: 5, second: 6 }); // returns true
executor({ first: -2, second: 0 }); // returns true
executor({ first: 'a', second: 'b' }); // returns true
executor({ first: 'A', second: 'a' }); // returns true
executor({ first: 10, second: 10 }); // returns false
executor({ first: 10, second: -10 }); // returns false
executor({ first: 'b', second: 'a' }); // returns false
executor({}); // returns false
```

## NE(value1, value2)

It will return `true` when both values are different, returns `false` otherwise.

### Syntax

//TODO: Add diagram

#### Parameters

##### value1 and value2

### example

```javascript
const engine = new Engine();

const executor = engine.compile('EQ(PP(first), PP(second))');
executor({ first: 10, second: 10 }); // returns false
executor({ first: '10', second: '10' }); // returns false
executor({ first: true, second: true }); // returns false
executor({}); // returns false
executor({ first: 10, second: '10' }); // returns true
executor({ first: false, second: true }); // returns true
executor({ first: false, second: undefined }); // returns true
executor({ first: false, second: 0 }); // returns true
```

## NT(condition)

It will return `true` when the condition is `false` or `false` when the condition is `true`.

### Syntax

//TODO: Add diagram

#### Parameters

##### condition

### example

```javascript
const engine = new Engine();

const executor = engine.compile('NT(PP(first))');
executor({ first: false }); // returns true
executor({ first: 0 }); // returns true
executor({ first: null }); // returns true
executor({}); // returns true
executor({ first: true }); // returns false
executor({ first: 1 }); // returns false
executor({ first: {} }); // returns false
```

## OR(condition1, condition2)

It will return `true` or `false` depending of the **or** evaluation of `condition1` and `condition2`.

The execution is lazy, therefore in case the first condition returns a truly value, the second condition is not evaluated.

### Syntax

//TODO: Add diagram

#### Parameters

##### condition1 and condition2

### example

```javascript
const engine = new Engine();

const executor = engine.compile('OR(PP(first), PP(second))');
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
