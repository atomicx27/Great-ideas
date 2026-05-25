const assert = require('node:assert');
const { test } = require('node:test');
const { scaleRecipe } = require('../script.js');

test('scales recipe correctly', () => {
    const input = "2 cups flour\n1 cup sugar\n3 eggs";
    const expected = ["6 cups flour", "3 cup sugar", "9 eggs"];
    const result = scaleRecipe(input, 4, 12);
    assert.deepStrictEqual(result, expected);
});
