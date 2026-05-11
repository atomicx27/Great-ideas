const test = require('node:test');
const assert = require('node:assert');
const { determineBin } = require('../script.js');

test('Automated Recycling Sorter Logic', async (t) => {

    await t.test('Routes to Metal if metallic reflection > 80', () => {
        const data = { metallicReflection: 85, opticalDensity: 90 };
        assert.strictEqual(determineBin(data), 'metal');
    });

    await t.test('Routes to Plastic if optical density > 70 (and low metal)', () => {
        const data = { metallicReflection: 10, opticalDensity: 80 };
        assert.strictEqual(determineBin(data), 'plastic');
    });

    await t.test('Routes to Paper if optical density is between 31 and 70', () => {
        const data = { metallicReflection: 0, opticalDensity: 50 };
        assert.strictEqual(determineBin(data), 'paper');
    });

    await t.test('Routes to Reject if optical density <= 30 (and low metal)', () => {
        const data = { metallicReflection: 5, opticalDensity: 20 };
        assert.strictEqual(determineBin(data), 'reject');
    });
});