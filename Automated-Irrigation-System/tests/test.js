const { test } = require('node:test');
const assert = require('node:assert');
const { evaluateMoisture } = require('../script');

test('Automated-Irrigation-System - evaluateMoisture', (t) => {
    const r1 = evaluateMoisture(25);
    assert.strictEqual(r1.pumpOn, true);

    const r2 = evaluateMoisture(35);
    assert.strictEqual(r2.pumpOn, false);
});
