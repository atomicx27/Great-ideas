const assert = require('assert');
const { runLogic } = require('../script.js');

const result1 = runLogic('test input');
assert.strictEqual(result1.status, 'success');
assert.strictEqual(result1.result, 'TEST INPUT');

const result2 = runLogic('');
assert.strictEqual(result2.status, 'error');

console.log('Automated-Rent-Collector tests passed.');
