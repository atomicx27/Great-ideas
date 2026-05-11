const assert = require('node:assert');
const test = require('node:test');
const { determineOutfit } = require('../script.js');

test('Agentic-Personal-Shopper tool usage logic', async (t) => {
    await t.test('Generates a casual outfit', () => {
        const result = determineOutfit('casual');
        assert.match(result, /Jeans \(In Stock\)/);
        assert.match(result, /T-Shirt \(In Stock\)/);
    });

    await t.test('Generates a formal outfit', () => {
        const result = determineOutfit('formal');
        assert.match(result, /Suit \(In Stock\)/);
        assert.match(result, /Dress Shoes \(In Stock\)/);
    });

    await t.test('Handles unknown styles gracefully', () => {
        const result = determineOutfit('alien');
        assert.match(result, /couldn't find matching items/);
    });
});
