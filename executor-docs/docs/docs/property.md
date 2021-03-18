---
id: property-function
title: Property
---

## PP(path)

It will return the part of the context object according to the given `path`. If at any point of the `path` a value cannot be resolved, it returns `undefined`.

### Syntax

//TODO: Add diagram

#### Parameters

##### path

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

### Examples

#### Simplest use

It should return the value of the property `name`

```javascript
const engine = new Engine();

const executor = engine.compile('PP(name)');

executor({ name: 'John' }); // returns "John"
executor({ name: 'Paul' }); // returns "Paul"
```

#### Navigate in the object

It should return the value of the property `name` of the object `user`

```javascript
const engine = new Engine();

const executor = engine.compile('PP(user.name)');

executor({ user: { name: 'John' } }); // returns "John"
executor({ user: { name: 'Paul' } }); // returns "Paul"
```

#### Index in array

It should return the value of second position in the array

```javascript
const engine = new Engine();

const executor = engine.compile('PP(1)');

executor(['cero', 'uno', 'dos']); // returns "uno"
executor([20, 30, 40]); // returns 30
```

#### Use a property as a key

It should return the value of the property specified by the property `key`

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

#### Use a property path as a key

It should return the value of the property specified by the property `sub-key` of `key`

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
