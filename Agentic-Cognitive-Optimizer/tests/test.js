const assert = require('assert');

// Mock fetchAnthropic
global.fetchAnthropic = async (key, model, sys, user, opts) => {
    return "Apply 40Hz binaural beats with mild transcranial DC stimulation.";
};

const { generateProtocol } = require('../script.js');

async function runTests() {
    let loggedMessages = [];
    const mockLogger = (msg) => loggedMessages.push(msg);

    const result = await generateProtocol('High Stress', mockLogger);

    assert.strictEqual(result, "Apply 40Hz binaural beats with mild transcranial DC stimulation.");
    assert.ok(loggedMessages[0].includes('High Stress'));
    assert.ok(loggedMessages[1].includes('Generating neuroplasticity'));
    assert.ok(loggedMessages[2].includes('40Hz binaural beats'));
    assert.ok(loggedMessages[3].includes('Protocol generation complete'));

    console.log('Agentic-Cognitive-Optimizer tests passed!');
}

runTests();
