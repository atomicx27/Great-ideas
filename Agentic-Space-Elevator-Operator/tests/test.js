const { describe, it } = require('node:test');
const assert = require('node:assert');
const { ElevatorAgent } = require('../script.js');

describe('Agentic Space Elevator Operator Logic', () => {
    it('should return mocked ollama response for scheduling', async () => {
        const agent = new ElevatorAgent('ollama', 'mock', 'llama3');
        // Overwrite fetchOllama for testing
        agent.fetchOllama = async () => "Launch at 1200";

        const res = await agent.manageSchedule('High priority medical supplies');
        assert.strictEqual(res, "Launch at 1200");
    });
});
