const assert = require('assert');
const { calculatePrintJob } = require('../script.js');

// Test 1: Titanium Strut
const result1 = calculatePrintJob('titanium', 'strut');
assert.strictEqual(result1.duration, 120);
assert.strictEqual(result1.status, 'Success');

// Test 2: Aluminum Panel
const result2 = calculatePrintJob('aluminum', 'panel');
assert.strictEqual(result2.duration, 90);
assert.strictEqual(result2.status, 'Success');

// Test 3: Carbon Fiber Bracket
const result3 = calculatePrintJob('carbon_fiber', 'bracket');
assert.strictEqual(result3.duration, 72);
assert.strictEqual(result3.status, 'Failed - Calibrate Extruder');

console.log('Automated-Zero-G-Printer tests passed!');
