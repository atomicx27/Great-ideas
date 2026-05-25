const test = require('node:test');
const assert = require('node:assert');
const { monitorPlasma } = require('../script.js');

test('Automated Plasma Containment - Optimal', (t) => {
    const result = monitorPlasma(150, 1.2, 95);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isStable, true);
    assert.ok(result.actions.includes('Plasma containment optimal. Holding steady state.'));
});

test('Automated Plasma Containment - High Temp', (t) => {
    const result = monitorPlasma(165, 1.2, 95);
    assert.strictEqual(result.isStable, false);
    assert.ok(result.actions.includes('Cryogenic cooling flux increased'));
});

test('Automated Plasma Containment - Critical Stability', (t) => {
    const result = monitorPlasma(150, 1.2, 50);
    assert.strictEqual(result.isStable, false);
    assert.ok(result.actions.includes('Toroidal magnetic field coils repowered'));
    assert.ok(result.actions.includes('CRITICAL: Emergency plasma quench initiated'));
});

test('Automated Plasma Containment - Invalid Input', (t) => {
    const result = monitorPlasma('150', 1.2, 95);
    assert.strictEqual(result.error, 'Invalid sensor data types');
});
