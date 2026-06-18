const test = require('node:test');
const assert = require('node:assert');

// Mock APIs globally
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage) => {
    return JSON.stringify({
        primary_route: 'Quantum-Trunk-Alpha',
        efficiency: '99.9%'
    });
};

global.fetchAnthropic = async (apiKey, model, systemPrompt, userMessage) => {
    return JSON.stringify({
        security_status: 'Secure',
        threat_level: 'Low'
    });
};

const { orchestrateQuantumSwarm } = require('../script.js');

test('orchestrateQuantumSwarm coordinates multi-agent responses', async (t) => {
    const results = await orchestrateQuantumSwarm();

    assert.strictEqual(results.securityData.security_status, 'Secure');
    assert.strictEqual(results.securityData.threat_level, 'Low');
    assert.strictEqual(results.routingData.primary_route, 'Quantum-Trunk-Alpha');
    assert.strictEqual(results.routingData.efficiency, '99.9%');
});

test('orchestrateQuantumSwarm handles API failures gracefully', async (t) => {
    // Override one mock to fail
    const originalAnthropic = global.fetchAnthropic;
    global.fetchAnthropic = async () => { throw new Error('Anthropic outage'); };

    try {
        await orchestrateQuantumSwarm();
        assert.fail('Should have thrown an error');
    } catch (err) {
        assert.match(err.message, /Orchestration Failed: Anthropic outage/);
    }

    // Restore
    global.fetchAnthropic = originalAnthropic;
});
