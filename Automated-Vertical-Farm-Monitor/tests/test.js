const test = require('node:test');
const assert = require('node:assert');
const { monitorNutrients } = require('../script.js');

test('monitorNutrients normal operation', () => {
    const result = monitorNutrients(6.0, 1.5);
    assert.strictEqual(result.level, 'info');
    assert.ok(result.message.includes('pH: 6.0'));
});

test('monitorNutrients pH out of bounds', () => {
    const result = monitorNutrients(5.2, 1.5);
    assert.strictEqual(result.level, 'warn');
    assert.ok(result.message.includes('pH OUT OF BOUNDS'));
});

test('monitorNutrients EC too low', () => {
    const result = monitorNutrients(6.0, 0.8);
    assert.strictEqual(result.level, 'warn');
    assert.ok(result.message.includes('EC TOO LOW'));
});

test('monitorNutrients EC critical high', () => {
    const result = monitorNutrients(6.0, 3.5);
    assert.strictEqual(result.level, 'error');
    assert.ok(result.message.includes('EC CRITICAL HIGH'));
});
