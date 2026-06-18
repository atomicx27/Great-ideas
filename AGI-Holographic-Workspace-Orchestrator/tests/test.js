const assert = require('assert');
const { describe, it } = require('node:test');
const { manage3DWorkspace } = require('../script.js');

describe('AGI Holographic Workspace Orchestrator Logic', () => {
    it('should coordinate sub-agents and synthesize a workspace plan', async () => {
        let callCount = 0;

        // Mock fetch function to simulate parallel LLM calls
        const mockFetch = async (provider, prompt) => {
            callCount++;
            if (prompt.includes('Spatial Layout Manager')) return 'Layout: Circle';
            if (prompt.includes('Data Visualizer')) return 'Data: 3D bar charts';
            if (prompt.includes('Real-time Collaboration Sync')) return 'Sync: Optimistic UI updates';
            if (prompt.includes('Master AGI Orchestrator')) return 'Master Plan: Circular layout with 3D charts and optimistic UI.';
            return 'Unknown agent';
        };

        const result = await manage3DWorkspace('Sales Review', 'mock', mockFetch);

        assert.strictEqual(callCount, 4); // 3 sub-agents + 1 master synthesis
        assert.strictEqual(result.layout, 'Layout: Circle');
        assert.strictEqual(result.data, 'Data: 3D bar charts');
        assert.strictEqual(result.sync, 'Sync: Optimistic UI updates');
        assert.strictEqual(result.masterPlan, 'Master Plan: Circular layout with 3D charts and optimistic UI.');
    });

    it('should throw error if fetch function fails', async () => {
        const mockFetch = async () => { throw new Error('API failure'); };

        try {
            await manage3DWorkspace('Design session', 'mock', mockFetch);
            assert.fail('Should have thrown an error');
        } catch (error) {
            assert.strictEqual(error.message, 'API failure');
        }
    });
});