const assert = require('assert');

global.fetchOpenAI = async () => "Isolating high-intensity semantic memory nodes.";
global.fetchAnthropic = async () => "Administer 10Hz alpha-wave synchronization to isolated nodes.";

const { orchestrateCognition } = require('../script.js');

async function runTests() {
    let logs = [];
    const mockLogger = (msg) => logs.push(msg);

    const result = await orchestrateCognition('Test state', mockLogger);

    assert.ok(result.includes('Isolating high-intensity'));
    assert.ok(result.includes('Administer 10Hz alpha-wave'));

    assert.ok(logs[0].includes('Test state'));
    assert.ok(logs[2].includes('semantic memory nodes'));
    assert.ok(logs[4].includes('alpha-wave synchronization'));
    assert.ok(logs[5].includes('Workflow complete'));

    console.log('AGI-Mind-Machine-Orchestrator tests passed!');
}

runTests();
