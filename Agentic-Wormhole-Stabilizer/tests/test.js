const { describe, it } = require('node:test');
const assert = require('node:assert');
const { stabilizeWormhole } = require('../script.js');

describe('Agentic Wormhole Stabilizer', () => {
    it('should inject max for critical collapse', async () => {
        const result = await stabilizeWormhole(12000);
        assert.strictEqual(result.action, 'MAX_INJECTION');
    });

    it('should pulse inject for moderate instability', async () => {
        const result = await stabilizeWormhole(5000);
        assert.strictEqual(result.action, 'PULSED_INJECTION');
    });

    it('should monitor stable wormhole', async () => {
        const result = await stabilizeWormhole(1000);
        assert.strictEqual(result.action, 'MONITORING');
    });
});
