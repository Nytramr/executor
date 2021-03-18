---
id: properties
title: Property
---

import {Identifier, Property, PropertyAccessor} from '../../src/components/railroad';

## Property Identifier

### Diagram

<Identifier />

### Examples

```
a
_
var
aName
foo1
_1234
__private__
```

## Property Accessor

### Diagram

<PropertyAccessor />

### Examples

```
// These accessors will access a property of the context on the left
["prop1"]
[0]

// These accessors will look up to the top context to provide the accessor value
[a]
[_]
[var]
[aName]
[foo1]
[_1234]
[__private__]
[PP(a)]

```

## Property

### Diagram

<Property />

### Examples

```
a
_
var
aName
foo1
_1234
__private__
sub-category
```
