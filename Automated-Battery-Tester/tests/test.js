const test = require('node:test');
const assert = require('node:assert');
const { generateBatteryBatch, processBattery } = require('../script.js');

test('Battery Tester - Batch Generation', (t) => {
    const size = 5;
    const batch = generateBatteryBatch(size);

    assert.strictEqual(batch.length, size, 'Should generate correct batch size');
    assert.ok(batch[0].id.startsWith('BAT-'), 'ID should start with BAT-');
    assert.ok(batch[0].capacity >= 4000 && batch[0].capacity < 5000, 'Capacity should be within range');
});

test('Battery Tester - Process Battery Logic', (t) => {
    const minCapacity = 4500;

    const passBattery = { id: 'BAT-1', capacity: 4600 };
    const failBattery = { id: 'BAT-2', capacity: 4400 };
    const boundaryBattery = { id: 'BAT-3', capacity: 4500 };

    assert.strictEqual(processBattery(passBattery, minCapacity).action, 'PASS');
    assert.strictEqual(processBattery(failBattery, minCapacity).action, 'FAIL');
    assert.strictEqual(processBattery(boundaryBattery, minCapacity).action, 'PASS');
});