const { describe, it } = require('node:test');
const assert = require('node:assert');
const { trapDarkMatter } = require('../script.js');

describe('Agentic Dark Matter Trapper', () => {
    it('should deploy high strength field for major anomaly', async () => {
        const result = await trapDarkMatter([0.9, 0.8, 0.9]);
        assert.strictEqual(result.status, 'DEPLOYED');
        assert.strictEqual(result.fieldStrength, 'HIGH');
    });

    it('should deploy medium strength field for moderate anomaly', async () => {
        const result = await trapDarkMatter([0.4, 0.5, 0.4]);
        assert.strictEqual(result.status, 'DEPLOYED');
        assert.strictEqual(result.fieldStrength, 'MEDIUM');
    });

    it('should return to standby for weak anomaly', async () => {
        const result = await trapDarkMatter([0.1, 0.1, 0.2]);
        assert.strictEqual(result.status, 'STANDBY');
        assert.strictEqual(result.fieldStrength, 'NONE');
    });
});
