const test = require('node:test');
const assert = require('node:assert');
const { runMasterOrchestrator } = require('../script.js');

// Mock fetch for global scope
global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    const prompt = body.messages ? body.messages.find(m => m.role === 'user').content : '';

    let responseContent = "";
    if (prompt.includes('Recruiting Sub-Agent')) {
        responseContent = "1. Hire 5 cloud engineers. 2. Post jobs. 3. Interview.";
    } else if (prompt.includes('Training Sub-Agent')) {
        responseContent = "1. Buy AWS courses. 2. Schedule training. 3. Certify.";
    } else if (prompt.includes('Restructuring Sub-Agent')) {
        responseContent = "1. Merge teams. 2. Assign leads. 3. Review budget.";
    } else if (prompt.includes('Synthesize these parallel plans')) {
        responseContent = "Final Strategy: Done.";
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

test('AGI Workforce Planner Orchestrator', async (t) => {
    const statuses = [];
    const updateStatus = (id, msg) => statuses.push(`${id}: ${msg}`);

    const config = { provider: 'openai', key: 'test', model: 'test-model' };
    const goal = "Pivot to cloud.";

    const result = await runMasterOrchestrator(config, goal, updateStatus);

    assert.strictEqual(result, "Final Strategy: Done.");
    assert.ok(statuses.some(s => s.includes('recruiting: Recruiting initializing')));
    assert.ok(statuses.some(s => s.includes('training: Training initializing')));
    assert.ok(statuses.some(s => s.includes('restructuring: Restructuring initializing')));
    assert.ok(statuses.some(s => s.includes('master: Sub-agents finished. Synthesizing final strategy...')));
});
