const test = require('node:test');
const assert = require('node:assert');
const { tools } = require('../script.js');

test('Agentic-Procurement-Specialist Tools', async (t) => {
    await t.test('checkInventory returns stock data', async () => {
        const inventoryStr = await tools.checkInventory();
        const inventory = JSON.parse(inventoryStr);
        assert.ok(inventory.Laptops !== undefined);
        assert.ok(inventory.Monitors !== undefined);
        assert.ok(inventory.Chairs !== undefined);
    });

    await t.test('checkSupplierPrices returns prices for Laptops', async () => {
        const pricesStr = await tools.checkSupplierPrices('Laptops');
        const prices = JSON.parse(pricesStr);
        assert.ok(prices.SupplierA !== undefined);
        assert.ok(prices.SupplierB !== undefined);
        assert.ok(prices.SupplierC !== undefined);
    });

    await t.test('checkSupplierPrices handles unknown items', async () => {
        const pricesStr = await tools.checkSupplierPrices('UnknownItem');
        const prices = JSON.parse(pricesStr);
        assert.strictEqual(prices.SupplierA, 'Price unavailable');
    });

    await t.test('placeOrder returns success message', async () => {
        const result = await tools.placeOrder('Laptops', 'SupplierB', 5);
        assert.ok(result.includes('Successfully ordered 5 Laptops(s) from SupplierB'));
        assert.ok(result.includes('Order ID: #ORD-'));
    });
});
