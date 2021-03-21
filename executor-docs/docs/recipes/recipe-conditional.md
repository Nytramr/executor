---
id: recipe-conditional
title: conditional (if-else)
sidebar_label: conditional (if-else)
---

import { Engine } from '@nytramr/executor';

```javascript
const engine = new Engine();

engine.define('IF', (pred, consequent, alternative) => (context) =>
  pred(context) ? consequent(context) : alternative(context),
);
```

## Use

```javascript
var executer = engine.compile('IF(GT(PP(value), CT(10)), CT("true"), CT("false"))');
```
