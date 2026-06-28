const { test } = require('node:test');
const assert = require('node:assert');
const { orchestrateGlobalTelesurgery } = require('../script.js');

test('AGI-Telesurgery-Orchestrator: Mocked Swarm', async () => {
    const mockFetchFunc = {
        fetchOllama: async (url, model, systemPrompt, userMessage) => {
            if (systemPrompt.includes('Master Orchestrator')) {
                return '{"network_task": "ping", "robotics_task": "move", "medical_task": "check"}';
            }
            return `Done: ${userMessage}`;
        }
    };

    const result = await orchestrateGlobalTelesurgery('ollama', '', 'surgery', mockFetchFunc);

    assert.strictEqual(result.tasks.network_task, 'ping');
    assert.strictEqual(result.results.robotics, 'Done: move');
});
