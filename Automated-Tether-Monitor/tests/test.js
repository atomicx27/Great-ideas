const assert = require('node:assert');
const test = require('node:test');
const { analyzeStrain } = require('../script.js');

test('Automated Tether Monitor - analyzeStrain', async (t) => {
    await t.test('Identifies Nominal correctly', () => {
        const input = [{ id: "test-1", strain: 50 }];
        const result = analyzeStrain(input);

        assert.strictEqual(result.criticalCount, 0);
        assert.strictEqual(result.processed[0].condition, 'Nominal');
        assert.strictEqual(result.processed[0].className, 'comp-nominal');
    });

    await t.test('Identifies Warning correctly', () => {
        const input = [{ id: "test-2", strain: 85 }];
        const result = analyzeStrain(input);

        assert.strictEqual(result.criticalCount, 0);
        assert.strictEqual(result.processed[0].condition, 'Warning');
        assert.strictEqual(result.processed[0].className, 'comp-warning');
    });

    await t.test('Identifies Critical correctly', () => {
        const input = [{ id: "test-3", strain: 95 }];
        const result = analyzeStrain(input);

        assert.strictEqual(result.criticalCount, 1);
        assert.strictEqual(result.processed[0].condition, 'Critical');
        assert.strictEqual(result.processed[0].className, 'comp-critical');
    });
});
