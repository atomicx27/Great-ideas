const test = require('node:test');
const assert = require('node:assert');
const { runSdrAgent } = require('../script.js');

// Mock fetch globally
global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    const prompt = body.messages.find(m => m.role === 'user').content;

    let responseContent = "";
    if (prompt.includes('Extract key recent events')) {
        responseContent = JSON.stringify({
            events: ["Raised $10M"],
            pain_points: ["Need to hire fast"]
        });
    } else if (prompt.includes('Write a highly personalized, concise cold email')) {
        responseContent = "Subject: Congrats on $10M! Our recruiting tool can help you hire fast.";
    }

    return {
        ok: true,
        json: async () => ({
            choices: [{ message: { content: responseContent } }]
        })
    };
};

const llmapi = require('../../shared/llm-api.js');
global.fetchOpenAI = llmapi.fetchOpenAI;
global.fetchAnthropic = llmapi.fetchAnthropic;
global.fetchOllama = llmapi.fetchOllama;

test('Agentic Sales Development Rep', async (t) => {
    const logs = [];
    const logger = (msg) => logs.push(msg);

    const config = { provider: 'openai', key: 'test', model: 'test-model' };
    const prospect = "Raised $10M";
    const product = "Recruiting software";

    const result = await runSdrAgent(config, prospect, product, logger);

    assert.strictEqual(result, "Subject: Congrats on $10M! Our recruiting tool can help you hire fast.");
    assert.ok(logs.some(l => l.includes('Action: Calling LLM to extract')));
    assert.ok(logs.some(l => l.includes('Action: Drafting highly personalized email')));
});
