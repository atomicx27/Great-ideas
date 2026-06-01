const test = require('node:test');
const assert = require('node:assert');
const { dispenseNanobots } = require('../script.js');

test('dispenseNanobots allows safe dosage', (t) => {
    const result = dispenseNanobots(400);
    assert.strictEqual(result.success, true);
    assert.ok(result.message.includes('Success: Dispensing 400'));
});

test('dispenseNanobots denies excessive dosage', (t) => {
    const result = dispenseNanobots(600);
    assert.strictEqual(result.success, false);
    assert.ok(result.message.includes('exceeds maximum safe limit'));
});

test('dispenseNanobots denies negative dosage', (t) => {
    const result = dispenseNanobots(-50);
    assert.strictEqual(result.success, false);
    assert.ok(result.message.includes('greater than 0'));
});

test('dispenseNanobots handles invalid input', (t) => {
    const result = dispenseNanobots(NaN);
    assert.strictEqual(result.success, false);
    assert.ok(result.message.includes('Invalid dosage'));
});
