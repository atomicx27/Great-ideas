const { describe, it } = require('node:test');
const assert = require('node:assert');
const { routeSubspaceComm } = require('../script.js');

describe('Agentic Subspace Router', () => {
    it('should successfully calculate a route given a valid JSON response from LLM', async () => {
        const input = [
            { id: 'Node-A', latency: 12, congestion: 10 }
        ];

        const mockFetch = async () => JSON.stringify({ selectedPath: ['Node-A'], estimatedEfficiency: 95 });

        const result = await routeSubspaceComm(input, mockFetch, 'test-key');

        assert.strictEqual(result.success, true);
        assert.deepStrictEqual(result.route.selectedPath, ['Node-A']);
        assert.strictEqual(result.route.estimatedEfficiency, 95);
    });

    it('should handle JSON parse errors gracefully', async () => {
        const input = [];
        const mockFetch = async () => "Invalid JSON";

        const result = await routeSubspaceComm(input, mockFetch, 'test-key');

        assert.strictEqual(result.success, false);
        assert.ok(result.error);
    });
});
