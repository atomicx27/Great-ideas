const { describe, it } = require('node:test');
const assert = require('node:assert');
const { Orchestrator, SubAgent } = require('../script.js');

describe('AGI Hologram Orchestrator Logic', () => {
    it('should combine mocked responses from sub-agents', async () => {
        const orchestrator = new Orchestrator('ollama');
        // Overwrite fetch methods for testing
        orchestrator.agents[0].fetchApi = async () => "Strobe lights";
        orchestrator.agents[1].fetchApi = async () => "Max volume";

        const res = await orchestrator.orchestrateShow('Metal concert');
        assert.strictEqual(res, "Strobe lights | Max volume");
    });
});
