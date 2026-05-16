const assert = require('node:assert');
const test = require('node:test');
const { analyzeSpectra } = require('../script.js');

test('Automated Asteroid Scanner - analyzeSpectra', async (t) => {
    await t.test('Identifies Water-Ice correctly', () => {
        const input = [{ id: "test-1", spectrum: 200 }];
        const result = analyzeSpectra(input);

        assert.strictEqual(result.viableCount, 1);
        assert.strictEqual(result.processed[0].composition, 'Water-Ice');
        assert.strictEqual(result.processed[0].className, 'comp-ice');
    });

    await t.test('Identifies Silicate correctly', () => {
        const input = [{ id: "test-2", spectrum: 400 }];
        const result = analyzeSpectra(input);

        assert.strictEqual(result.viableCount, 0); // Silicate is not marked viable
        assert.strictEqual(result.processed[0].composition, 'Silicate');
    });

    await t.test('Identifies Iron/Nickel correctly', () => {
        const input = [{ id: "test-3", spectrum: 750 }];
        const result = analyzeSpectra(input);

        assert.strictEqual(result.viableCount, 1);
        assert.strictEqual(result.processed[0].composition, 'Heavy Iron/Nickel');
    });

    await t.test('Identifies Unknown correctly', () => {
        const input = [{ id: "test-4", spectrum: 1000 }];
        const result = analyzeSpectra(input);

        assert.strictEqual(result.viableCount, 0);
        assert.strictEqual(result.processed[0].composition, 'Unknown');
    });
});
