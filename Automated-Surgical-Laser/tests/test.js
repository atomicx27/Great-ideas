const assert = require('node:assert');
const test = require('node:test');
const { calculateAblationDepth } = require('../script.js');

test('Automated Surgical Laser - calculateAblationDepth', async (t) => {
    await t.test('Calculates depth for epidermis correctly', () => {
        // power: 10, duration: 5, factor: 0.8 => (10 * 5 * 0.8) / 10 = 4.00
        const depth = calculateAblationDepth('epidermis', 10, 5);
        assert.strictEqual(depth, 4.00);
    });

    await t.test('Calculates depth for dermis correctly', () => {
        // power: 20, duration: 2, factor: 0.5 => (20 * 2 * 0.5) / 10 = 2.00
        const depth = calculateAblationDepth('dermis', 20, 2);
        assert.strictEqual(depth, 2.00);
    });

    await t.test('Calculates depth for subcutaneous correctly', () => {
        // power: 15, duration: 4, factor: 1.2 => (15 * 4 * 1.2) / 10 = 7.20
        const depth = calculateAblationDepth('subcutaneous', 15, 4);
        assert.strictEqual(depth, 7.20);
    });

    await t.test('Calculates depth for muscle correctly', () => {
        // power: 30, duration: 1, factor: 0.3 => (30 * 1 * 0.3) / 10 = 0.90
        const depth = calculateAblationDepth('muscle', 30, 1);
        assert.strictEqual(depth, 0.90);
    });
});