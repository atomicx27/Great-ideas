const assert = require('assert');
const { describe, it } = require('node:test');
const { coordinateSwarmFormation } = require('../script.js');

describe('AGI Programmable Matter Orchestrator Logic', () => {
    it('should coordinate sub-agents and synthesize a master plan', async () => {
        let callCount = 0;

        // Mock fetch function to simulate parallel LLM calls
        const mockFetch = async (provider, prompt) => {
            callCount++;
            if (prompt.includes('Structural Engineer')) return 'Structure: Arch';
            if (prompt.includes('Material Properties')) return 'Material: Auxetic';
            if (prompt.includes('Aerodynamics Expert')) return 'Aero: Low drag profile';
            if (prompt.includes('Master AGI Orchestrator')) return 'Master Plan: Build arch with auxetic materials and low drag.';
            return 'Unknown agent';
        };

        const result = await coordinateSwarmFormation('Build a bridge', 'mock', mockFetch);

        assert.strictEqual(callCount, 4); // 3 sub-agents + 1 master synthesis
        assert.strictEqual(result.structure, 'Structure: Arch');
        assert.strictEqual(result.material, 'Material: Auxetic');
        assert.strictEqual(result.aero, 'Aero: Low drag profile');
        assert.strictEqual(result.masterPlan, 'Master Plan: Build arch with auxetic materials and low drag.');
    });

    it('should throw error if fetch function fails', async () => {
        const mockFetch = async () => { throw new Error('Network error'); };

        try {
            await coordinateSwarmFormation('Build a bridge', 'mock', mockFetch);
            assert.fail('Should have thrown an error');
        } catch (error) {
            assert.strictEqual(error.message, 'Network error');
        }
    });
});