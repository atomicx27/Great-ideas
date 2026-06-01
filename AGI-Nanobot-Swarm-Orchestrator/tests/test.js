const test = require('node:test');
const assert = require('node:assert');

// Mock fetchOpenAI globally
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage, options) => {
    if (systemPrompt.includes('Targeting Agent')) {
        return 'Concentrate swarm at coordinate [45.2, -12.1] in left lung.';
    }
    if (systemPrompt.includes('Payload Agent')) {
        return 'Release 5mg of paclitaxel locally.';
    }
    if (systemPrompt.includes('Swarm Leader Agent')) {
        return 'DIRECTIVE: Swarm to converge at [45.2, -12.1] and release 5mg paclitaxel simultaneously.';
    }
    return 'Unknown agent response.';
};

const { orchestrateSwarm } = require('../script.js');

test('orchestrateSwarm aggregates agent responses and returns leader directive', async (t) => {
    const status = "Stage 2 carcinoma detected in left lung.";
    let logs = {};
    const updateLogFn = (agent, msg) => {
        logs[agent] = msg;
    };

    const result = await orchestrateSwarm(status, updateLogFn);

    assert.strictEqual(logs.targeting, 'Concentrate swarm at coordinate [45.2, -12.1] in left lung.');
    assert.strictEqual(logs.payload, 'Release 5mg of paclitaxel locally.');
    assert.strictEqual(result, 'DIRECTIVE: Swarm to converge at [45.2, -12.1] and release 5mg paclitaxel simultaneously.');
});

test('orchestrateSwarm handles empty input', async (t) => {
    try {
        await orchestrateSwarm("");
        assert.fail('Should have thrown error for empty input');
    } catch (e) {
        assert.strictEqual(e.message, 'No patient condition provided.');
    }
});
