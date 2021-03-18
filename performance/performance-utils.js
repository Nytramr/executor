const { performance, PerformanceObserver } = require('perf_hooks');

function sumEntries(entries) {
  return entries.reduce((accum, entry) => entry + accum, 0);
}

function filterAndSortEntries(entries, name) {
  return entries
    .filter((entry) => entry.name === name)
    .map((entry) => entry.duration)
    .sort(compareNumbers);
}
// Activate the observer

function compareNumbers(a, b) {
  return a - b;
}

function init(names) {
  const obs = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    names.forEach((name) => {
      const entriesByName = filterAndSortEntries(entries, name);
      const len = entriesByName.length;
      const total = sumEntries(entriesByName);
      console.log(
        `Time for ('${name}') Total:${total} average:${total / entriesByName.length} Min: ${entriesByName[0]} Max: ${
          entriesByName[len - 1]
        } 50%: ${entriesByName[Math.floor(len * 0.5)]} 60%: ${entriesByName[Math.floor(len * 0.6)]}`,
      );
    });
  });
  obs.observe({ entryTypes: ['measure'], buffered: true }); //we want to react to full measurements and not individual marks

  return obs;
}

module.exports = {
  init,
  performance,
};
