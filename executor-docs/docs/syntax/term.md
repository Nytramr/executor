---
id: term
title: Sentences
---

## Sentence

### Diagram

<ny-railroad-diagram diagram="Diagram(NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')))"></ny-railroad-diagram>

## Term

### Diagram

<ny-railroad-diagram diagram="Diagram(
      Choice(
        0,
        NonTerminal('string', optionsBuilder('href', 'literals#string')),
        NonTerminal('number', optionsBuilder('href', 'literals#number')),
        NonTerminal('boolean', optionsBuilder('href', 'literals#boolean')),
        NonTerminal('function', optionsBuilder('href', 'term#function')),
        NonTerminal('property', optionsBuilder('href', 'properties'))))"></ny-railroad-diagram>

### Examples

```
0
-1
34
-0.34
99.99
```

## Function

### Diagram

<Function />

<ny-railroad-diagram diagram="Diagram(
      NonTerminal('identifier', optionsBuilder('href', 'properties#property-identifier')),
      Terminal('('),
      Optional(Sequence(NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')), ZeroOrMore(Sequence(Terminal(','), NonTerminal('term', optionsBuilder('href', '/docs/syntax/term#term')))))),
      Terminal(')'))"></ny-railroad-diagram>

### Examples

```
CT("hello world")
PP(obj.property)
NE(PP(value), CT(10))
```
