const { describe, it } = require('node:test');
const assert = require('node:assert');
const { monitorDarkMatterDensity } = require('../script.js');

describe('Automated Dark Matter Monitor', () => {
    it('should correctly classify density levels', () => {
        const input = [
            { id: '1', density: 10 },
            { id: '2', density: 50 },
            { id: '3', density: 80 }
        ];

        const result = monitorDarkMatterDensity(input);

        assert.strictEqual(result.processed.length, 3);
        assert.strictEqual(result.anomalies, 1);

        assert.strictEqual(result.processed[0].densityLevel, 'Low');
        assert.strictEqual(result.processed[1].densityLevel, 'Medium');
        assert.strictEqual(result.processed[2].densityLevel, 'High (Anomaly)');
    });
});
