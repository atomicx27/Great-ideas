const assert = require('assert');

global.fetchOpenAI = async (apiKey, model, systemPrompt, text) => {
    if (systemPrompt.includes('Master Hospital Orchestrator')) {
        return '**Final Patient Disposition:** Transfer\n**Immediate Next Steps:** Arrange transport.';
    }
    return 'Sub-agent analysis complete.';
};

const { orchestrateTriage } = require('../script.js');

async function runTests() {
    let cbCalled = 0;
    const updateCb = (agent, content, isRunning) => {
        cbCalled++;
    };

    const result = await orchestrateTriage('key', 'Test context', updateCb);

    assert.ok(result.includes('Final Patient Disposition:'));
    assert.ok(cbCalled > 0, 'Update callback should be called multiple times');

    console.log('AGI-Healthcare-Triage tests passed!');
}

runTests().catch(err => {
    console.error(err);
    process.exit(1);
});
