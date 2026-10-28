const { describe, it } = require('node:test');
const assert = require('node:assert');
const { MasterOrchestrator, SubAgent } = require('../script.js');

describe('AGI Space Elevator Orchestrator Logic', () => {
    it('should combine mocked responses from sub-agents', async () => {
        const orchestrator = new MasterOrchestrator('ollama');
        // Overwrite fetch methods for testing
        orchestrator.agents[0].fetchApi = async () => "Schedule 1400";
        orchestrator.agents[1].fetchApi = async () => "Check tension";
        orchestrator.agents[2].fetchApi = async () => "Clear skies";

        const res = await orchestrator.coordinateOperations('Normal payload');
        assert.strictEqual(res, "Schedule 1400 | Check tension | Clear skies");
    });
});
