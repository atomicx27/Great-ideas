const assert = require('node:assert');
const { test, mock } = require('node:test');
const { orchestrateFarmNetwork, spawnAgronomyAgent } = require('../script.js');

test('spawnAgronomyAgent uses fallback when fetchOpenAI is undefined', async () => {
    const mockLogs = [];
    const logger = (msg) => mockLogs.push(msg);

    const result = await spawnAgronomyAgent('fake-key', 'Test Goal', logger);
    assert.ok(result.includes('High-turnover microgreens'));
    assert.ok(mockLogs.some(l => l.includes('Initializing Agronomy Agent')));
});

test('orchestrateFarmNetwork coordinates sub-agents and synthesizes report', async () => {
    const mockLoggers = {
        master: mock.fn(),
        logistics: mock.fn(),
        resource: mock.fn(),
        agronomy: mock.fn()
    };

    // Globally mock fetchOpenAI just in case
    global.fetchOpenAI = mock.fn(async () => "Mocked Task Response");

    const result = await orchestrateFarmNetwork('fake-key', 'Build a farm', mockLoggers);

    assert.ok(result.includes('Mocked Task Response')); // from the agents
    assert.ok(result.includes('Executive Strategy: Vertical Farm Network Design'));
    assert.strictEqual(mockLoggers.master.mock.calls.length >= 3, true);

    delete global.fetchOpenAI;
});
