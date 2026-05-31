const assert = require('node:assert');
const { test } = require('node:test');
const { checkMoistureLevel, adjustLighting, dispenseNutrients } = require('../script.js');

test('checkMoistureLevel should initiate watering if below 30', () => {
    const res = checkMoistureLevel(25);
    assert.strictEqual(res.action, 'Watering Initiated');
});

test('checkMoistureLevel should disable watering if above 80', () => {
    const res = checkMoistureLevel(85);
    assert.strictEqual(res.action, 'Watering Disabled');
});

test('adjustLighting should increase intensity if lux < 10000', () => {
    const res = adjustLighting(9000);
    assert.strictEqual(res.action, 'Increase LED Intensity');
});

test('dispenseNutrients should dispense if >= 24 hours', () => {
    const res = dispenseNutrients(25);
    assert.strictEqual(res.action, 'Dispense Nutrient Mix A');

    const res2 = dispenseNutrients(12);
    assert.strictEqual(res2.action, 'Standby');
});
