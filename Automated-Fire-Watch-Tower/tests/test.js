const assert = require('node:assert');
const test = require('node:test');
const { evaluateSensorData } = require('../script.js');

test('Automated Fire Watch Tower', async (t) => {
    await t.test('Should return safe when metrics are normal', () => {
        const result = evaluateSensorData(75, 12);
        assert.strictEqual(result.alert, false);
    });

    await t.test('Should trigger alert on high temperature', () => {
        const result = evaluateSensorData(130, 12);
        assert.strictEqual(result.alert, true);
    });

    await t.test('Should trigger alert on high AQI', () => {
        const result = evaluateSensorData(75, 160);
        assert.strictEqual(result.alert, true);
    });
});