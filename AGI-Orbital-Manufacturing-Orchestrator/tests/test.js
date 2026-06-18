const assert = require('assert');

global.fetchOpenAI = async () => "Material Spec: Titanium with 5% Aluminum.";
global.fetchAnthropic = async () => "Printer Spec: 1200C at 50mm/s extrusion.";

const { orchestrateManufacturing } = require('../script.js');

async function runTests() {
    let logs = [];
    const mockLogger = (msg) => logs.push(msg);

    const result = await orchestrateManufacturing('Test solar array', mockLogger);

    assert.ok(result.includes('Titanium with 5% Aluminum'));
    assert.ok(result.includes('1200C at 50mm/s'));

    assert.ok(logs[0].includes('Test solar array'));
    assert.ok(logs[2].includes('Titanium with 5%'));
    assert.ok(logs[4].includes('1200C at 50mm/s'));
    assert.ok(logs[5].includes('Workflow complete'));

    console.log('AGI-Orbital-Manufacturing-Orchestrator tests passed!');
}

runTests();
