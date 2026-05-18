const test = require('node:test');
const assert = require('node:assert');
const { runMasterOrchestrator } = require('../script.js');

// Mock fetch globally
global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    const prompt = body.messages ? body.messages.find(m => m.role === 'user').content : '';

    let responseContent = "";
    if (prompt.includes('Copywriter Sub-Agent')) {
        responseContent = "1. Write catchy headlines. 2. Draft emails. 3. Script video.";
    } else if (prompt.includes('SEO Analyst Sub-Agent')) {
        responseContent = "1. Research cybersecurity keywords. 2. Optimize landing page. 3. Build backlinks.";
    } else if (prompt.includes('Ad-Buyer Sub-Agent')) {
        responseContent = "1. Allocate 30k to LinkedIn. 2. Allocate 20k to Google. 3. Launch.";
    } else if (prompt.includes('Synthesize these parallel plans')) {
        responseContent = "Final Campaign Strategy: Deployed.";
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

test('AGI Marketing Campaign Orchestrator', async (t) => {
    const statuses = [];
    const updateStatus = (id, msg) => statuses.push(`${id}: ${msg}`);

    const config = { provider: 'openai', key: 'test', model: 'test-model' };
    const goal = "Launch cybersecurity product.";

    const result = await runMasterOrchestrator(config, goal, updateStatus);

    assert.strictEqual(result, "Final Campaign Strategy: Deployed.");
    assert.ok(statuses.some(s => s.includes('copywriter: Copywriter initializing')));
    assert.ok(statuses.some(s => s.includes('seo: SEO Analyst initializing')));
    assert.ok(statuses.some(s => s.includes('adbuyer: Ad-Buyer initializing')));
    assert.ok(statuses.some(s => s.includes('master: Sub-agents finished. Synthesizing final campaign strategy...')));
});
