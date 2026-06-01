const test = require('node:test');
const assert = require('node:assert');
const { calculateLoadBalance } = require('../script.js');

test('Automated-Smart-Grid-Controller logic', (t) => {
    // Balanced
    const balanced = calculateLoadBalance(50, 50, 100);
    assert.strictEqual(balanced[0], 'Grid is perfectly balanced.');

    // Excess
    const excess = calculateLoadBalance(80, 40, 100);
    assert.strictEqual(excess[0], 'Excess power of 20 MW detected.');
    assert.strictEqual(excess[1], 'Action: Route excess power to battery storage.');

    // Deficit
    const deficit = calculateLoadBalance(20, 30, 100);
    assert.strictEqual(deficit[0], 'Power deficit of 50 MW detected.');
    assert.strictEqual(deficit[1], 'Action: Draw 50 MW from reserve batteries to meet demand.');
});