const { test } = require('node:test');
const assert = require('node:assert');
const { evaluateCrusherStatus } = require('../script');

test('Automated-Ore-Crusher - evaluateCrusherStatus', (t) => {
    // Normal operation
    assert.deepStrictEqual(evaluateCrusherStatus(50, 150), { status: 'active', message: 'Crushing active.' });

    // Critical Temp
    assert.deepStrictEqual(evaluateCrusherStatus(50, 300), { status: 'halted', message: 'CRITICAL TEMP. Auto-shutdown engaged to prevent meltdown.' });
    assert.deepStrictEqual(evaluateCrusherStatus(10, 350), { status: 'halted', message: 'CRITICAL TEMP. Auto-shutdown engaged to prevent meltdown.' });

    // Hopper Full
    assert.deepStrictEqual(evaluateCrusherStatus(100, 150), { status: 'halted', message: 'Hopper full. Awaiting transport drone for offload.' });

    // Both triggers (Temp logic evaluated first in code)
    assert.deepStrictEqual(evaluateCrusherStatus(100, 305), { status: 'halted', message: 'CRITICAL TEMP. Auto-shutdown engaged to prevent meltdown.' });
});