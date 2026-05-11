const test = require('node:test');
const assert = require('node:assert');
const { calculateAugmentation } = require('../script.js');

test('Automated-Data-Augmenter logic', (t) => {
    let result = calculateAugmentation(1000, ["Rot90"]);
    assert.strictEqual(result.finalSize, 2000);
    assert.strictEqual(result.multiplier, 2);

    result = calculateAugmentation(100, ["Rot90", "Grayscale"]);
    assert.strictEqual(result.finalSize, 400);
    assert.strictEqual(result.multiplier, 4);

    result = calculateAugmentation(0, ["Rot90"]);
    assert.strictEqual(result.error, "Dataset size must be greater than zero.");

    result = calculateAugmentation(100, []);
    assert.strictEqual(result.error, "Select at least one transformation.");
});