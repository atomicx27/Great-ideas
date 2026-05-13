const test = require('node:test');
const assert = require('node:assert');
const { calculateEmissions } = require('../script.js');

test('Automated-Carbon-Footprint-Calculator logic', (t) => {
    const inputs = {
        electricity: 10000, // 10000 * 0.000417 = 4.17
        naturalGas: 1000,   // 1000 * 0.0053 = 5.30
        flights: 10000      // 10000 * 0.00016 = 1.60
    };

    const result = calculateEmissions(inputs);

    // Total should be 4.17 + 5.30 + 1.60 = 11.07
    assert.strictEqual(result.total, '11.07');
    assert.strictEqual(result.breakdown.electricity, '4.17');
    assert.strictEqual(result.breakdown.naturalGas, '5.30');
    assert.strictEqual(result.breakdown.flights, '1.60');
});