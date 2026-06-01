const assert = require('node:assert');
const { test } = require('node:test');
const { optimizeMenu } = require('../script.js');

test('optimizes menu by 10%', async () => {
    const input = "Burger: $10\nSalad: $8";
    const mockFetch = async () => "Burger: $11\nSalad: $8.8";
    const expected = ["Burger: $11", "Salad: $8.8"];
    const result = await optimizeMenu(input, mockFetch);
    assert.deepStrictEqual(result, expected);
});
