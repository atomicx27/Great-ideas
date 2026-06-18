const assert = require('assert');

global.fetchOpenAI = async (apiKey, model, systemPrompt, text) => {
    if (systemPrompt.includes('Master Orchestrator')) {
        return '**Final Verdict:** Flagged\n**Key Factors:** Consensus reached on violation.';
    }
    return 'Agent analysis complete.';
};

const { orchestrateModeration } = require('../script.js');

async function runTests() {
    let cbCalled = 0;
    const updateCb = (agent, content, isRunning) => {
        cbCalled++;
    };

    const result = await orchestrateModeration('key', 'Test content', updateCb);

    assert.ok(result.includes('Final Verdict:'));
    assert.ok(cbCalled > 0, 'Update callback should be called multiple times');

    console.log('AGI-Content-Moderator tests passed!');
}

runTests().catch(err => {
    console.error(err);
    process.exit(1);
});
