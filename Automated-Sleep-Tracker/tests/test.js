const assert = require('node:assert');
const { parseSleepData } = require('../script.js');

// Test 1: Empty or invalid data
assert.deepStrictEqual(parseSleepData([]), { error: 'Invalid or empty sensor data' });
assert.deepStrictEqual(parseSleepData(null), { error: 'Invalid or empty sensor data' });

// Test 2: Good sleep data
const goodData = ['deep', 'deep', 'light', 'rem', 'deep', 'light', 'rem'];
const goodResult = parseSleepData(goodData);
assert.strictEqual(goodResult.score, 100);
assert.strictEqual(goodResult.quality, 'Excellent');
assert.strictEqual(goodResult.summary.deep, 3);
assert.strictEqual(goodResult.summary.awake, 0);

// Test 3: Poor sleep data (lots of awake, low deep sleep)
const poorData = ['light', 'awake', 'awake', 'light', 'awake', 'light'];
const poorResult = parseSleepData(poorData);
assert.strictEqual(poorResult.score, 55); // 100 - (3*10) - 15
assert.strictEqual(poorResult.quality, 'Poor');

console.log('Automated-Sleep-Tracker tests passed!');