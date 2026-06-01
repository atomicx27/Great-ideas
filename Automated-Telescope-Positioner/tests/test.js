const test = require('node:test');
const assert = require('node:assert');
const { calculateTrajectory } = require('../script.js');

test('calculateTrajectory calculates slew commands correctly', () => {
    const result = calculateTrajectory(5.5, 12.0, 5.0, 10.0);
    assert.strictEqual(result.commands.length, 2);
    assert.strictEqual(result.commands[0], 'Slew RA +0.50h');
    assert.strictEqual(result.commands[1], 'Slew DEC +2.00°');
});

test('calculateTrajectory tracking engaged when diff is small', () => {
    const result = calculateTrajectory(5.005, 10.005, 5.0, 10.0);
    assert.strictEqual(result.commands.length, 1);
    assert.strictEqual(result.commands[0], 'Target acquired. Tracking engaged.');
});

test('calculateTrajectory handles negative slews', () => {
    const result = calculateTrajectory(4.0, 5.0, 5.0, 10.0);
    assert.strictEqual(result.commands.length, 2);
    assert.strictEqual(result.commands[0], 'Slew RA -1.00h');
    assert.strictEqual(result.commands[1], 'Slew DEC -5.00°');
});
