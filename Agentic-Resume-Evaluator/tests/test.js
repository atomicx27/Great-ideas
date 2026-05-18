const test = require('node:test');
const assert = require('node:assert');
const { runAgenticEvaluation } = require('../script.js');

// Mock fetch for the LLM API calls globally since it's required by llm-api.js
global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    const prompt = body.messages ? body.messages.find(m => m.role === 'user').content : '';

    let responseContent = "";
    if (prompt.includes('Extract a list of required skills')) {
        responseContent = JSON.stringify({
            required: ["JavaScript", "React"],
            candidate: ["JavaScript"]
        });
    } else if (prompt.includes('Provide a comprehensive evaluation')) {
        responseContent = "Score: 70. Recommendation: Interview. Missing React.";
    }

    return {
        ok: true,
        json: async () => ({
            choices: [{ message: { content: responseContent } }]
        })
    };
};

// We need to inject the mock functions into global since script.js expects them in browser environment
const llmapi = require('../../shared/llm-api.js');
global.fetchOpenAI = llmapi.fetchOpenAI;
global.fetchAnthropic = llmapi.fetchAnthropic;
global.fetchOllama = llmapi.fetchOllama;

test('Agentic Resume Evaluator', async (t) => {
    const logs = [];
    const logger = (msg) => logs.push(msg);

    const config = { provider: 'openai', key: 'test', model: 'test-model' };
    const jobDesc = "Need a JavaScript and React dev.";
    const resume = "I am a JavaScript developer.";

    const result = await runAgenticEvaluation(config, jobDesc, resume, logger);

    assert.strictEqual(result, "Score: 70. Recommendation: Interview. Missing React.");
    assert.ok(logs.some(l => l.includes('Action: Calling LLM to parse')));
    assert.ok(logs.some(l => l.includes('Missing Skills Identified: React') || l.includes('missing skills: React')));
});
