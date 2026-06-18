const assert = require('assert');

// Mock fetchOpenAI
global.fetchOpenAI = async (key, model, sys, user, opts) => {
    return "Mocked optimal alloy formulation with V-4 Chromium dopant.";
};

const { synthesizeAlloy } = require('../script.js');

async function runTests() {
    let loggedMessages = [];
    const mockLogger = (msg) => loggedMessages.push(msg);

    const result = await synthesizeAlloy('Titanium', mockLogger);

    assert.strictEqual(result, "Mocked optimal alloy formulation with V-4 Chromium dopant.");
    assert.ok(loggedMessages[0].includes('Titanium'));
    assert.ok(loggedMessages[1].includes('Consulting LLM'));
    assert.ok(loggedMessages[2].includes('Mocked optimal alloy'));
    assert.ok(loggedMessages[3].includes('Synthesis sequence complete'));

    console.log('Agentic-Microgravity-Material-Scientist tests passed!');
}

runTests();
