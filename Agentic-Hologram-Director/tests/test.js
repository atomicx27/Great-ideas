const { describe, it } = require('node:test');
const assert = require('node:assert');
const { HologramAgent } = require('../script.js');

describe('Agentic Hologram Director Logic', () => {
    it('should return mocked ollama response', async () => {
        const agent = new HologramAgent('ollama', 'mock', 'llama3');
        // Overwrite fetchOllama for testing
        agent.fetchOllama = async () => "Increase energy";

        const res = await agent.directPerformance('Sleepy');
        assert.strictEqual(res, "Increase energy");
    });
});
