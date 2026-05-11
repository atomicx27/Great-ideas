const assert = require('node:assert');
const test = require('node:test');
const { calculatePrice } = require('../script.js');

test('Automated-Pricing-Engine deterministic logic', async (t) => {
    await t.test('Matches competitor price when within margin', () => {
        const result = calculatePrice(100, 90);
        assert.strictEqual(result.newPrice, 90);
        assert.match(result.message, /Matched competitor price/);
    });

    await t.test('Stops at minimum margin when competitor is too low', () => {
        const result = calculatePrice(100, 70);
        assert.strictEqual(result.newPrice, 80);
        assert.match(result.message, /minimum margin price/);
    });

    await t.test('Maintains base price when competitor is higher', () => {
        const result = calculatePrice(100, 110);
        assert.strictEqual(result.newPrice, 100);
        assert.match(result.message, /Maintained base price/);
    });
});
