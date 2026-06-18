const assert = require('node:assert');
const test = require('node:test');
const { evaluateStructuralIntegrity } = require('../script.js');

test('Agentic Site Inspector - evaluateStructuralIntegrity', async (t) => {
    await t.test('Calls LLM with correct sensor data and returns report', async () => {
        global.fetchLLM = async (provider, apiKey, model, sysPrompt, userMsg) => {
            assert.strictEqual(provider, 'openai');
            assert.ok(userMsg.includes('vibration_hz": 4.2'));
            return "Tilt of 1.5 degrees detected. Flagging column B.";
        };

        const result = await evaluateStructuralIntegrity('{"vibration_hz": 4.2, "tilt_degrees": 1.5}', 'openai', 'test-key');
        assert.strictEqual(result, "Tilt of 1.5 degrees detected. Flagging column B.");

        delete global.fetchLLM;
    });

    await t.test('Handles LLM API errors gracefully', async () => {
        global.fetchLLM = async () => {
            throw new Error('Timeout');
        };

        try {
            await evaluateStructuralIntegrity('data', 'anthropic', 'key');
            assert.fail('Should have thrown');
        } catch (err) {
            assert.ok(err.message.includes('Inspection failed: Timeout'));
        }

        delete global.fetchLLM;
    });
});