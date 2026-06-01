const assert = require('node:assert');
const test = require('node:test');
const { calculateRiggingParameters } = require('../script.js');

test('Automated-Solar-Sail-Deployer: calculateRiggingParameters phase < 90', (t) => {
    // flux=1000, area=1000, phase=45
    // baseTension = (1000*0.05) + (1000*0.1) = 50 + 100 = 150
    // angle = -15
    const res = calculateRiggingParameters(1000, 1000, 45);
    assert.strictEqual(res.tension, '150.00');
    assert.strictEqual(res.angle, -15);
});

test('Automated-Solar-Sail-Deployer: calculateRiggingParameters 90 < phase < 270', (t) => {
    // flux=1000, area=1000, phase=180
    // baseTension = 150 * 0.5 = 75
    // angle = 90
    const res = calculateRiggingParameters(1000, 1000, 180);
    assert.strictEqual(res.tension, '75.00');
    assert.strictEqual(res.angle, 90);
});
