const assert = require('assert');

const { performance, init } = require('./performance-utils');

const obs = init(['executor', 'executor-precompiled', 'jmespath']);

const jmespath = require('jmespath');
const { Engine } = require('@nytramr/executor');

const context = {
  'foo': [
    { 'a': 1, 'b': 2 },
    { 'a': 1, 'b': 3 },
  ],
};
const engine = new Engine();
// I must add search function
// engine.define('search', (arrayGetter, predicate) => (context, subContext) => {
//   const array = arrayGetter(context);
//   if (Array.isArray(array)) return array.filter((element) => predicate(context, subContext, element));
//   return []; // you may choice to return undefined instead.
// });

// prewarm the test, for possible code optimization perform by node
const extractor = engine.compile('FLT(PP(foo),AN(EQ(SL(PP(a)),CT(1)),EQ(SL(PP(b)),CT(2))))');
const extractor_result = extractor(context);
console.log(extractor_result);

const jmespath_result = jmespath.search(context, 'foo[?a == `1` && b == `2`]');
console.log(jmespath_result);

extractor(context);

for (let i = 0; i < 1000; i++) {
  performance.mark('executor-init');
  const extractor1 = engine.compile('FLT(PP(foo),AN(EQ(SL(PP(a)),CT(1)),EQ(SL(PP(b)),CT(2))))');
  const result = extractor1(context);
  performance.mark('executor-end');
  // assert.ok(result === 'Kane', 'executor, the result is not true');
  performance.measure('executor', 'executor-init', 'executor-end');
}

for (let i = 0; i < 1000; i++) {
  performance.mark('executor-precompiled-init');
  const result = extractor(context);
  performance.mark('executor-precompiled-end');
  // assert.ok(result === 'Kane', 'executor-precompiled, the result is not true');
  performance.measure('executor-precompiled', 'executor-precompiled-init', 'executor-precompiled-end');
}

for (let i = 0; i < 1000; i++) {
  performance.mark('jmespath-init');
  const result = jmespath.search(context, 'foo[?a == `1` && b == `2`]');
  performance.mark('jmespath-end');
  // assert.ok(result === [{"a": 1, "b": 2}], 'jmespath, the result is not true');
  performance.measure('jmespath', 'jmespath-init', 'jmespath-end');
}
