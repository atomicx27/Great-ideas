const assert = require('assert');
const { test } = require('node:test');
const { filterSignals } = require('../script.js');

test('should filter signals based on threshold', () => {
    const signals = [
        { id: "1", frequency: 10 },
        { id: "2", frequency: 40 },
        { id: "3", frequency: 30 }
    ];

    const result = filterSignals(signals, 30);

    assert.strictEqual(result.keptCount, 2);
    assert.strictEqual(result.processed[0].action, 'Dropped (Noise)');
    assert.strictEqual(result.processed[1].action, 'Kept');
    assert.strictEqual(result.processed[2].action, 'Kept');
});
