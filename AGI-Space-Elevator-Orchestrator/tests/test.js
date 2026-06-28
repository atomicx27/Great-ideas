const { test } = require('node:test');
const assert = require('node:assert');
const { orchestrateElevatorSwarm } = require('../script.js');

test('AGI-Space-Elevator-Orchestrator: Mocked Swarm Execution', async () => {
    let callCount = 0;
    const mockFetchFunc = {
        fetchOllama: async (url, model, systemPrompt, userMessage) => {
            callCount++;
            if (systemPrompt.includes('Master Orchestrator')) {
                return '{"logistics_task": "load cargo", "safety_task": "check winds", "engineering_task": "inspect cables"}';
            }
            if (systemPrompt.includes('sub-agent')) {
                return `Executed: ${userMessage}`;
            }
            return '';
        }
    };

    const result = await orchestrateElevatorSwarm('ollama', '', 'optimize launch', mockFetchFunc);

    assert.strictEqual(callCount, 4); // 1 master + 3 sub-agents
    assert.strictEqual(result.tasks.logistics_task, 'load cargo');
    assert.strictEqual(result.results.logistics, 'Executed: load cargo');
});
