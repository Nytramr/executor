---
id: properties
title: Property
---

## Property Identifier

### Diagram

<ny-railroad-diagram diagram="Diagram(
    Choice(1, Terminal('_'), 
    NonTerminal('chars', optionsBuilder('href', 'literals#chars'))),
    ZeroOrMore(Choice(3, Terminal('_'), Terminal('-'), 
    NonTerminal('digit', optionsBuilder('href', 'literals#digits')), 
    NonTerminal('chars', optionsBuilder('href', 'literals#chars')))))"></ny-railroad-diagram>

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

<ny-railroad-diagram diagram="Diagram(
    Sequence(
      Terminal('['),
      Choice(
        0, 
        NonTerminal('string', optionsBuilder('href', 'literals#string')), 
        NonTerminal('number', optionsBuilder('href', 'literals#number')), 
        NonTerminal('property', optionsBuilder('href', 'properties#property')),
        NonTerminal('function', optionsBuilder('href', 'term#function'))),
      Terminal(']')))"></ny-railroad-diagram>

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

<ny-railroad-diagram diagram="Diagram(
    Choice(1, NonTerminal('number', optionsBuilder('href', 'literals#number')), NonTerminal('identifier', optionsBuilder('href', 'properties#property-identifier')), NonTerminal('accessor', optionsBuilder('href', 'properties#property-accessor'))),
    ZeroOrMore(
      Choice(
        0,
        Sequence(Terminal('.'), 
          Choice(
            1, 
            NonTerminal('number', optionsBuilder('href', 'literals#number')), 
            NonTerminal('identifier', optionsBuilder('href', 'properties#property-identifier')), 
            NonTerminal('string', optionsBuilder('href', 'literals#string')))),
        NonTerminal('accessor', optionsBuilder('href', 'properties#property-accessor')))))"></ny-railroad-diagram>

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
