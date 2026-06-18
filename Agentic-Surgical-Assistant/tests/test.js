const assert = require('node:assert');
const test = require('node:test');
const { analyzeTissueAnomaly } = require('../script.js');

test('Agentic Surgical Assistant - analyzeTissueAnomaly', async (t) => {
    await t.test('Calls LLM with correct anomaly data and returns recommendation', async () => {
        // Mock global fetchLLM
        global.fetchLLM = async (provider, apiKey, model, sysPrompt, userMsg) => {
            assert.strictEqual(provider, 'openai');
            assert.ok(userMsg.includes('{"density": 1.4}'));
            return "Reduce laser power by 15% due to high vascularization.";
        };

        const result = await analyzeTissueAnomaly('{"density": 1.4}', 'openai', 'test-key');
        assert.strictEqual(result, "Reduce laser power by 15% due to high vascularization.");

        // Clean up mock
        delete global.fetchLLM;
    });

    await t.test('Handles errors from LLM gracefully', async () => {
        global.fetchLLM = async () => {
            throw new Error('API Rate Limit');
        };

        try {
            await analyzeTissueAnomaly('data', 'anthropic', 'test-key');
            assert.fail('Should have thrown');
        } catch (err) {
            assert.ok(err.message.includes('LLM Analysis failed: API Rate Limit'));
        }

        delete global.fetchLLM;
    });
});