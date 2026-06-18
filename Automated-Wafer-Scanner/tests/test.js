const assert = require('node:assert');
const test = require('node:test');
const { analyzeWaferDefects } = require('../script.js');

test('Automated Wafer Scanner - analyzeWaferDefects', async (t) => {
    await t.test('Identifies Low Severity correctly', () => {
        const input = [{ id: "test-1", size: 5 }];
        const result = analyzeWaferDefects(input);

        assert.strictEqual(result.passed, true);
        assert.strictEqual(result.processed[0].severity, 'Low');
        assert.strictEqual(result.processed[0].className, 'severity-low');
    });

    await t.test('Identifies Medium Severity correctly', () => {
        const input = [{ id: "test-2", size: 25 }];
        const result = analyzeWaferDefects(input);

        assert.strictEqual(result.passed, true);
        assert.strictEqual(result.processed[0].severity, 'Medium');
        assert.strictEqual(result.processed[0].className, 'severity-medium');
    });

    await t.test('Identifies High Severity correctly and fails wafer', () => {
        const input = [{ id: "test-3", size: 75 }];
        const result = analyzeWaferDefects(input);

        assert.strictEqual(result.passed, false);
        assert.strictEqual(result.processed[0].severity, 'High');
        assert.strictEqual(result.processed[0].className, 'severity-high');
    });

    await t.test('Fails wafer if too many defects', () => {
        const input = [
            { id: "test-1", size: 5 },
            { id: "test-2", size: 5 },
            { id: "test-3", size: 5 },
            { id: "test-4", size: 5 },
            { id: "test-5", size: 5 },
            { id: "test-6", size: 5 }
        ];
        const result = analyzeWaferDefects(input);

        assert.strictEqual(result.passed, false);
    });
});
