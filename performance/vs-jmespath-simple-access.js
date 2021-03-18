const assert = require('assert');
const { performance, init } = require('./performance-utils');

const obs = init(['executor', 'executor-precompiled', 'jmespath']);

const jmespath = require('jmespath');
const { Engine } = require('@nytramr/executor');

const context = {
  name: { first: 'Sterling', last: 'Archer' },
  assoc: [
    { first: 'Lana', last: 'Kane' },
    { first: 'Cyril', last: 'Figgis' },
    { first: 'Pam', last: 'Poovey' },
  ],
  age: 31,
  sex: 'male',
};
const engine = new Engine();

// prewarm the test, for possible code optimization perform by node
const extractor = engine.compile('PP(assoc.0.last)');
extractor(context);

jmespath.search(context, 'assoc[0].last');

extractor(context);

for (let i = 0; i < 1000; i++) {
  performance.mark('executor-init');
  const extractor1 = engine.compile('PP(assoc.0.last)');
  const result = extractor1(context);
  performance.mark('executor-end');
  assert.ok(result === 'Kane', 'executor, the result is not true');
  performance.measure('executor', 'executor-init', 'executor-end');
}

for (let i = 0; i < 1000; i++) {
  performance.mark('executor-precompiled-init');
  const result = extractor(context);
  performance.mark('executor-precompiled-end');
  assert.ok(result === 'Kane', 'executor-precompiled, the result is not true');
  performance.measure('executor-precompiled', 'executor-precompiled-init', 'executor-precompiled-end');
}

for (let i = 0; i < 1000; i++) {
  performance.mark('jmespath-init');
  const result = jmespath.search(context, 'assoc[0].last');
  performance.mark('jmespath-end');
  assert.ok(result === 'Kane', 'jmespath, the result is not true');
  performance.measure('jmespath', 'jmespath-init', 'jmespath-end');
}
