const assert = require('node:assert');
const test = require('node:test');
const { orchestrateSurgicalProcedure } = require('../script.js');

test('AGI Surgical Theater Orchestrator - orchestrateSurgicalProcedure', async (t) => {
    await t.test('Calls LLM with correct vitals and step and returns plan', async () => {
        global.fetchLLM = async (provider, apiKey, model, sysPrompt, userMsg) => {
            assert.strictEqual(provider, 'anthropic');
            assert.ok(userMsg.includes('{"hr": 85}'));
            assert.ok(userMsg.includes('Incision'));
            return "- Robotic Arms: Proceed.\n- Anesthesiology: Maintain.";
        };

        const result = await orchestrateSurgicalProcedure('{"hr": 85}', 'Incision Phase', 'anthropic', 'test-key');
        assert.strictEqual(result, "- Robotic Arms: Proceed.\n- Anesthesiology: Maintain.");

        delete global.fetchLLM;
    });

    await t.test('Handles errors from LLM gracefully', async () => {
        global.fetchLLM = async () => {
            throw new Error('Network Error');
        };

        try {
            await orchestrateSurgicalProcedure('vitals', 'step', 'openai', 'key');
            assert.fail('Should have thrown');
        } catch (err) {
            assert.ok(err.message.includes('Orchestration failed: Network Error'));
        }

        delete global.fetchLLM;
    });
});