const assert = require('node:assert');
const test = require('node:test');
const { manageConstructionSwarm } = require('../script.js');

test('AGI Construction Swarm Orchestrator - manageConstructionSwarm', async (t) => {
    await t.test('Calls LLM with correct telemetry and returns directives', async () => {
        global.fetchLLM = async (provider, apiKey, model, sysPrompt, userMsg) => {
            assert.strictEqual(provider, 'anthropic');
            assert.ok(userMsg.includes('ETA 15m'));
            assert.ok(userMsg.includes('heavy winds'));
            return "- Drones: Ground.\n- Logistics: Reroute.\n- Cranes: Secure.";
        };

        const result = await manageConstructionSwarm('{"steel_delivery": "ETA 15m"}', 'heavy winds approaching', 'anthropic', 'test-key');
        assert.strictEqual(result, "- Drones: Ground.\n- Logistics: Reroute.\n- Cranes: Secure.");

        delete global.fetchLLM;
    });

    await t.test('Handles LLM API errors gracefully', async () => {
        global.fetchLLM = async () => {
            throw new Error('Overloaded');
        };

        try {
            await manageConstructionSwarm('data', 'status', 'openai', 'key');
            assert.fail('Should have thrown');
        } catch (err) {
            assert.ok(err.message.includes('Orchestration failed: Overloaded'));
        }

        delete global.fetchLLM;
    });
});