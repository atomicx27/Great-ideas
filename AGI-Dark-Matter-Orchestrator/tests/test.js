const { describe, it } = require('node:test');
const assert = require('node:assert');
const { orchestrateDarkMatterNetwork } = require('../script.js');

describe('AGI Dark Matter Orchestrator', () => {
    it('should successfully formulate an orchestration plan', async () => {
        const input = [ { id: 'Sec-1', density: 85 } ];
        const mockFetch = async () => JSON.stringify([{ agent: 'Alpha', sectorId: 'Sec-1', instruction: 'Test' }]);

        const result = await orchestrateDarkMatterNetwork(input, mockFetch, 'key', 'openai');

        assert.strictEqual(result.success, true);
        assert.strictEqual(result.assignments[0].agent, 'Alpha');
        assert.strictEqual(result.assignments[0].sectorId, 'Sec-1');
    });

    it('should handle API errors', async () => {
        const input = [];
        const mockFetch = async () => { throw new Error("API Failure") };

        const result = await orchestrateDarkMatterNetwork(input, mockFetch, 'key', 'openai');

        assert.strictEqual(result.success, false);
        assert.strictEqual(result.error, 'API Failure');
    });
});
