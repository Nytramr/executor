const assert = require('assert');
const { performance, init } = require('./performance-utils');

// Activate the observer
const obs = init([
  'regex-integer',
  'regex-integerNegative',
  'regex-integerWithDot',
  'manual-integer',
  'manual-integerNegative',
  'manual-integerWithDot',
]);

function findNumber(input, indexFrom = 0) {
  let index = indexFrom;
  let current = input[index];
  while (current >= '0' && current <= '9') {
    index++;
    current = input[index];
  }
  return index - indexFrom ? index - 1 : -1;
}

function splitNumber(input) {
  const initial = input[0] == '-' ? 1 : 0;
  const index = findNumber(input, initial);
  if (index < 0) return -1;
  if (input[index + 1] === '.') {
    const decimal = findNumber(input, index + 2);
    return index < decimal ? decimal : index;
  }
  return index;
}

const numberRegEx = /^(-?\d+(?:\.\d+)?)\s*(.*)/;
const integer = '1234567890somethingElse';
const integerWithDot = '1234567890.somethingElse';
const integerNegative = '-1234567890somethingElse';
const float = '12345.67890somethingElse';
const floatWithDot = '12345.67890.somethingElse';
const noNumber = 'a12345.67890.somethingElse';

// warmup
numberRegEx.exec(integer);
numberRegEx.exec(integerNegative);
splitNumber(integerNegative);
splitNumber(integer);

for (let i = 0; i < 10000; i++) {
  performance.mark('manual-integer-init');
  const index = splitNumber(integer);
  performance.mark('manual-integer-end');
  assert.ok(index === 9, 'manual-integer, the result is not true');
  performance.measure('manual-integer', 'manual-integer-init', 'manual-integer-end');
}

for (let i = 0; i < 10000; i++) {
  performance.mark('regex-integer-init');
  const match = numberRegEx.exec(integer);
  performance.mark('regex-integer-end');
  assert.ok(match[1] === '1234567890', 'regex-integer, the result is not true');
  performance.measure('regex-integer', 'regex-integer-init', 'regex-integer-end');
}

for (let i = 0; i < 10000; i++) {
  performance.mark('regex-integerNegative-init');
  const match = numberRegEx.exec(integerNegative);
  performance.mark('regex-integerNegative-end');
  assert.ok(match[1] === '-1234567890', 'regex-integerNegative, the result is not true');
  performance.measure('regex-integerNegative', 'regex-integerNegative-init', 'regex-integerNegative-end');
}

for (let i = 0; i < 10000; i++) {
  performance.mark('manual-integerNegative-init');
  const index = splitNumber(integerNegative);
  performance.mark('manual-integerNegative-end');
  assert.ok(index === 10, 'manual-integerNegative, the result is not true');
  performance.measure('manual-integerNegative', 'manual-integerNegative-init', 'manual-integerNegative-end');
}

for (let i = 0; i < 10000; i++) {
  performance.mark('regex-integerWithDot-init');
  const match = numberRegEx.exec(integerWithDot);
  performance.mark('regex-integerWithDot-end');
  assert.ok(match[1] === '1234567890', 'regex-integerWithDot, the result is not true');
  performance.measure('regex-integerWithDot', 'regex-integerWithDot-init', 'regex-integerWithDot-end');
}

for (let i = 0; i < 10000; i++) {
  performance.mark('manual-integerWithDot-init');
  const index = splitNumber(integerWithDot);
  performance.mark('manual-integerWithDot-end');
  assert.ok(index === 9, 'manual-integerWithDot, the result is not true');
  performance.measure('manual-integerWithDot', 'manual-integerWithDot-init', 'manual-integerWithDot-end');
}

// for (let i = 0; i < 1000; i++) {
//   performance.mark('executor-precompiled-init');
//   const result = extractor(context);
//   performance.mark('executor-precompiled-end');
//   // assert.ok(result === 'Kane', 'executor-precompiled, the result is not true');
//   performance.measure('executor-precompiled', 'executor-precompiled-init', 'executor-precompiled-end');
// }

// for (let i = 0; i < 1000; i++) {
//   performance.mark('jmespath-init');
//   const result = jmespath.search(context, 'foo[?a == `1` && b == `2`]');
//   performance.mark('jmespath-end');
//   // assert.ok(result === [{"a": 1, "b": 2}], 'jmespath, the result is not true');
//   performance.measure('jmespath', 'jmespath-init', 'jmespath-end');
// }
