const assert = require('node:assert');
const { test, mock } = require('node:test');
const { orchestrateDefense, spawnThreatIntelAgent, spawnTakedownAgent } = require('../script.js');

test('spawnThreatIntelAgent uses fallback when fetchOpenAI is undefined', async () => {
    const mockLogs = [];
    const logger = (msg) => mockLogs.push(msg);

    const result = await spawnThreatIntelAgent('fake-key', 'Test Goal', logger);
    assert.ok(result.includes('Suspicious bot network'));
    assert.ok(mockLogs.some(l => l.includes('Initializing Threat Intel')));
});

test('orchestrateDefense coordinates sub-agents correctly', async () => {
    const mockLoggers = {
        master: mock.fn(),
        intel: mock.fn(),
        takedown: mock.fn(),
        messaging: mock.fn()
    };

    // Globally mock fetchOpenAI just in case, though the fallback is tested above
    global.fetchOpenAI = mock.fn(async () => "Mocked LLM Response");

    const result = await orchestrateDefense('fake-key', 'Stop deepfake campaign', mockLoggers);

    assert.ok(result.includes('Mocked LLM Response')); // Should appear 3 times, once for each agent
    assert.strictEqual(mockLoggers.master.mock.calls.length >= 3, true);

    delete global.fetchOpenAI;
});
