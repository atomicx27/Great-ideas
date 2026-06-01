const test = require('node:test');
const assert = require('node:assert');

// Mock fetchOpenAI globally
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage, options) => {
    if (systemPrompt.includes('Navigation Agent')) {
        return 'Recommend altering course by 15 degrees starboard.';
    }
    if (systemPrompt.includes('Life Support Agent')) {
        return 'Recommend diverting 20% power from main drive to life support.';
    }
    if (systemPrompt.includes('Commander Agent')) {
        return 'DIRECTIVE: Alter course 15 degrees starboard and divert 20% power to life support immediately.';
    }
    return 'Unknown agent response.';
};

const { orchestrateMission } = require('../script.js');

test('orchestrateMission aggregates agent responses and returns commander directive', async (t) => {
    const status = "Meteor storm approaching. Power reserves low.";
    let logs = {};
    const updateLogFn = (agent, msg) => {
        logs[agent] = msg;
    };

    const result = await orchestrateMission(status, updateLogFn);

    assert.strictEqual(logs.nav, 'Recommend altering course by 15 degrees starboard.');
    assert.strictEqual(logs.lifeSupport, 'Recommend diverting 20% power from main drive to life support.');
    assert.strictEqual(result, 'DIRECTIVE: Alter course 15 degrees starboard and divert 20% power to life support immediately.');
});

test('orchestrateMission handles empty input', async (t) => {
    try {
        await orchestrateMission("");
        assert.fail('Should have thrown error for empty input');
    } catch (e) {
        assert.strictEqual(e.message, 'No mission status provided.');
    }
});
