const assert = require('assert');
const { test } = require('node:test');
const { calculateInjection } = require('../script.js');

test('should calculate CO2 Injection correctly', () => {
    const result = calculateInjection(400, 800);
    assert.strictEqual(result.type, 'CO2 Injection');
    assert.strictEqual(result.amount, 4000);
});

test('should calculate Dilution correctly', () => {
    const result = calculateInjection(1000, 600);
    assert.strictEqual(result.type, 'Oxygen/Nitrogen Dilution');
    assert.strictEqual(result.amount, 4000);
});

test('should handle equilibrium', () => {
    const result = calculateInjection(500, 500);
    assert.strictEqual(result.type, 'None (Equilibrium)');
    assert.strictEqual(result.amount, 0);
});
