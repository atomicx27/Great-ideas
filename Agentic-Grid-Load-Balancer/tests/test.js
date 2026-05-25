const test = require('node:test');
const assert = require('node:assert');
const { runGridAgent } = require('../script.js');

test('Agentic-Grid-Load-Balancer simulation with mocked LLM', async (t) => {
    // Mock the global fetch for the LLM call inside llm-api.js
    global.fetch = async () => {
        return {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: '{"action":"Discharge Battery Reserves at 50MW capacity","strategy":"Mock strategy."}' } }]
            })
        };
    };

    const logs = [];
    const logCallback = (msg, type) => logs.push({ msg, type });

    const result = await runGridAgent('openai', 'mock-key', 'mock-model', logCallback);

    assert.strictEqual(result.status, 'Grid Stabilized');
    assert.strictEqual(result.strategy, 'Mock strategy.');
    assert.ok(logs.length > 0);
    assert.ok(logs.find(l => l.msg.includes('Executing Tool: checkWeatherForecast()')));
});