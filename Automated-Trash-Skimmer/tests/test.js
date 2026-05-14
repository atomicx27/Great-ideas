const { test } = require('node:test');
const assert = require('node:assert');
const { evaluateSkimmerStatus } = require('../script');

test('Automated-Trash-Skimmer - evaluateSkimmerStatus', (t) => {
    // Normal operation
    assert.deepStrictEqual(evaluateSkimmerStatus(80, 50), { status: 'active', message: 'Skimming active.' });

    // Low battery
    assert.deepStrictEqual(evaluateSkimmerStatus(20, 50), { status: 'returning', message: 'Low battery. Returning to dock to recharge.' });
    assert.deepStrictEqual(evaluateSkimmerStatus(10, 10), { status: 'returning', message: 'Low battery. Returning to dock to recharge.' });

    // Bin full
    assert.deepStrictEqual(evaluateSkimmerStatus(80, 100), { status: 'returning', message: 'Bin full. Returning to dock to unload.' });

    // Both triggers (battery logic evaluated first in code)
    assert.deepStrictEqual(evaluateSkimmerStatus(15, 100), { status: 'returning', message: 'Low battery. Returning to dock to recharge.' });
});