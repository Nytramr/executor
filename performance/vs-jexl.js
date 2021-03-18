const assert = require('assert');
const { performance, init } = require('./performance-utils');

// Activate the observer
init(['executor', 'executor-precompiled', 'jexl']);

const jexl = require('jexl');
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
performance.mark('executor-init');
const extractor = engine.compile(
  'OR(AN(EQ(PP(sex), CT("male")), GT(PP(age), CT(30))), AN(NE(PP(sex)CT("male")), LT(PP(age)CT(30)))',
);
extractor(context);
performance.mark('executor-end');
performance.measure('executor', 'executor-init', 'executor-end');

performance.mark('jexl-init');
jexl.evalSync('(sex == "male" && age > 30) || (sex != "male" && age < 30)', context);
performance.mark('jexl-end');
performance.measure('jexl', 'jexl-init', 'jexl-end');

extractor(context);

const RUNNING_TIMES = 1000;

for (let i = 0; i < RUNNING_TIMES; i++) {
  performance.mark('executor-init');
  const extractor1 = engine.compile(
    'OR(AN(EQ(PP(sex), CT("male")), GT(PP(age), CT(30))), AN(NE(PP(sex)CT("male")), LT(PP(age)CT(30)))',
  );
  const result = extractor1(context);
  performance.mark('executor-end');
  assert.ok(result === true, 'executor, the result is not true');
  performance.measure('executor', 'executor-init', 'executor-end');
}

for (let i = 0; i < RUNNING_TIMES; i++) {
  performance.mark('executor-precompiled-init');
  const result = extractor(context);
  performance.mark('executor-precompiled-end');
  assert.ok(result === true, 'executor-precompiled, the result is not true');
  performance.measure('executor-precompiled', 'executor-precompiled-init', 'executor-precompiled-end');
}

for (let i = 0; i < RUNNING_TIMES; i++) {
  performance.mark('jexl-init');
  const result = jexl.evalSync('(sex == "male" && age > 30) || (sex != "male" && age < 30)', context);
  performance.mark('jexl-end');
  assert.ok(result === true, 'jexl, the result is not true');
  performance.measure('jexl', 'jexl-init', 'jexl-end');
}
