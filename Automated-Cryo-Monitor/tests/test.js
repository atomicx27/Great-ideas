const assert = require('node:assert');
const test = require('node:test');
const { analyzeVitals } = require('../script.js');

test('Automated Cryo Monitor - analyzeVitals', async (t) => {
    await t.test('Identifies Stable correctly', () => {
        const input = [{ id: "test-1", hr: 5, temp: 75 }];
        const result = analyzeVitals(input);

        assert.strictEqual(result.criticalCount, 0);
        assert.strictEqual(result.processed[0].condition, 'Stable');
        assert.strictEqual(result.processed[0].className, 'comp-nominal');
    });

    await t.test('Identifies Warning correctly', () => {
        const input = [{ id: "test-2", hr: 12, temp: 75 }];
        const result = analyzeVitals(input);

        assert.strictEqual(result.criticalCount, 0);
        assert.strictEqual(result.processed[0].condition, 'HR Warning');
        assert.strictEqual(result.processed[0].className, 'comp-warning');
    });

    await t.test('Identifies Critical correctly', () => {
        const input = [{ id: "test-3", hr: 20, temp: 75 }];
        const result = analyzeVitals(input);

        assert.strictEqual(result.criticalCount, 1);
        assert.strictEqual(result.processed[0].condition, 'Critical: Wake Protocol Initiated');
        assert.strictEqual(result.processed[0].className, 'comp-critical');
    });
});
