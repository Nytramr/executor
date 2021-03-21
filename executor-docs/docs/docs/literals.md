---
id: literals
title: Literals
---

## Number

### Diagram

<ny-railroad-diagram diagram="Diagram(
      Optional('-', 'skip'),
      OneOrMore(NonTerminal('digit', optionsBuilder('href', 'literals#digits'))),
      Optional(Sequence('.', OneOrMore(NonTerminal('digit', optionsBuilder('href', 'literals#digits'))))))"></ny-railroad-diagram>

### Examples

```
0
-1
34
-0.34
99.99
```

## String

### Diagram

<ny-railroad-diagram diagram="Diagram(
      Choice(
        0,
        Sequence(Terminal('&quot;'), ZeroOrMore(Terminal('Any char but &quot;')), Terminal('&quot;')),
        Sequence(Terminal(&quot;'&quot;), ZeroOrMore(Terminal(&quot;Any char but '&quot;)), Terminal(&quot;'&quot;))))"></ny-railroad-diagram>

### Examples

```
"Hello world"
'Hello world'
'Your name is "Pedro"'
"Eat in joe's"
""
''
```

## Boolean

### Diagram

<ny-railroad-diagram diagram="Diagram(Choice(0, Terminal('true'), Terminal('false')))"></ny-railroad-diagram>

### Examples

```
true
false
```

## Chars

### Diagram

<ny-railroad-diagram diagram="Diagram(NonTerminal(' Any character from a to z both upper and lower case '))"></ny-railroad-diagram>

### Examples

```
a
b
z
A
B
Z
```

## Digits

### Diagram

<ny-railroad-diagram diagram="Diagram(NonTerminal('Any number from 0 to 9'))"></ny-railroad-diagram>

### Examples

```
0
1
2
5
9
```
