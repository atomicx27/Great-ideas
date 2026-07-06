const { describe, it } = require('node:test');
const assert = require('node:assert');
const { orchestrateSubspaceGrid } = require('../script.js');

describe('AGI Subspace Orchestrator', () => {
    it('should successfully formulate grid orchestration plan', async () => {
        const input = [ { id: 'Node-1', congestion: 95 } ];
        const mockFetch = async () => JSON.stringify([{ agent: 'Node-1', targetNode: 'Node-1', instruction: 'Test' }]);

        const result = await orchestrateSubspaceGrid(input, mockFetch, 'key', 'openai');

        assert.strictEqual(result.success, true);
        assert.strictEqual(result.assignments[0].agent, 'Node-1');
    });

    it('should handle API errors', async () => {
        const input = [];
        const mockFetch = async () => { throw new Error("API Failure") };

        const result = await orchestrateSubspaceGrid(input, mockFetch, 'key', 'openai');

        assert.strictEqual(result.success, false);
        assert.strictEqual(result.error, 'API Failure');
    });
});
