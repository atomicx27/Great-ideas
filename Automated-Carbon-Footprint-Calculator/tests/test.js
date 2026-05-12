const test = require('node:test');
const assert = require('node:assert');
const { calculateEmissions, EMISSION_FACTORS } = require('../script.js');

test('Automated-Carbon-Footprint-Calculator logic', (t) => {
    const electricity = 100;
    const flights = 2;
    const driving = 50;

    const results = calculateEmissions(electricity, flights, driving);

    assert.strictEqual(results.electricityEmissions, electricity * EMISSION_FACTORS.electricity);
    assert.strictEqual(results.flightEmissions, flights * EMISSION_FACTORS.flight);
    assert.strictEqual(results.drivingEmissions, driving * EMISSION_FACTORS.driving);

    const expectedTotal = (electricity * EMISSION_FACTORS.electricity) +
                          (flights * EMISSION_FACTORS.flight) +
                          (driving * EMISSION_FACTORS.driving);

    assert.strictEqual(results.total, expectedTotal);
});