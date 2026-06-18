const test = require('node:test');
const assert = require('node:assert');

// Mock fetchOpenAI globally
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage) => {
    if (userMessage.includes('error')) {
        throw new Error('Mocked API Error');
    }
    return JSON.stringify({
        optimization_strategy: 'Reroute traffic from Link-B to Link-D via quantum tunneling.',
        predicted_latency: '15ms'
    });
};

const { optimizeNetworkAgent } = require('../script.js');

test('optimizeNetworkAgent successfully processes valid network state', async (t) => {
    const mockState = JSON.stringify({ nodes: 5, congested_links: ["Link-B"] });
    const result = await optimizeNetworkAgent(mockState);

    assert.strictEqual(result.optimization_strategy, 'Reroute traffic from Link-B to Link-D via quantum tunneling.');
    assert.strictEqual(result.predicted_latency, '15ms');
});

test('optimizeNetworkAgent handles API errors', async (t) => {
    try {
        await optimizeNetworkAgent('error state');
        assert.fail('Should have thrown an error');
    } catch (err) {
        assert.match(err.message, /Optimization Failed: Mocked API Error/);
    }
});

test('optimizeNetworkAgent handles invalid input', async (t) => {
    try {
        await optimizeNetworkAgent(null);
        assert.fail('Should have thrown an error');
    } catch (err) {
        assert.strictEqual(err.message, 'Invalid network state provided.');
    }
});
