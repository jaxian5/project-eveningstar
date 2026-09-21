// Run with:  node js/run-tests.js          (tests only)
//            node js/run-tests.js --bench  (tests + benchmarks)
const { runTests, runBenchmarks } = require('./tests.js');

const results = runTests();
let group = '';
for (const r of results) {
  if (r.group !== group) { group = r.group; console.log('\n' + group); }
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.pass ? '' : '\n        ' + r.error}`);
}
const passed = results.filter(r => r.pass).length;
console.log(`\n${passed}/${results.length} tests passed`);

if (process.argv.includes('--bench')) {
  const { sizes, rows } = runBenchmarks();
  console.log('\nBenchmarks (median ms)');
  console.log(['Operation'.padEnd(46), ...sizes.map(n => String(n).padStart(9))].join(' '));
  for (const row of rows) {
    console.log([row.label.padEnd(46), ...sizes.map(n => row.ms[n].toFixed(2).padStart(9))].join(' '));
  }
}
process.exit(passed === results.length ? 0 : 1);
