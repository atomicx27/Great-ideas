const test = require('node:test');
const assert = require('node:assert');
const { calculatePanelAngle } = require('../script.js');

test('Automated-Solar-Panel-Positioner logic', (t) => {
    let result = calculatePanelAngle(12, 'stormy');
    assert.strictEqual(result.angle, 0);

    result = calculatePanelAngle(12, 'cloudy');
    assert.strictEqual(result.angle, 0);

    result = calculatePanelAngle(20, 'sunny');
    assert.strictEqual(result.angle, 0);

    result = calculatePanelAngle(12, 'sunny');
    assert.strictEqual(result.angle, 90);

    result = calculatePanelAngle(6, 'sunny');
    assert.strictEqual(result.angle, 0);

    result = calculatePanelAngle(18, 'sunny');
    assert.strictEqual(result.angle, 180);
});