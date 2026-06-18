const test = require('node:test');
const assert = require('node:assert');

// Mock APIs globally
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage) => {
    return JSON.stringify({
        extracted_tons: 450,
        expansion_viability: 'High'
    });
};

global.fetchAnthropic = async (apiKey, model, systemPrompt, userMessage) => {
    return JSON.stringify({
        oxygen_reserves: '95%',
        sustainability_score: 92
    });
};

const { manageColonyExpansion } = require('../script.js');

test('manageColonyExpansion coordinates multi-agent responses', async (t) => {
    const results = await manageColonyExpansion();

    assert.strictEqual(results.lifeSupport.oxygen_reserves, '95%');
    assert.strictEqual(results.lifeSupport.sustainability_score, 92);
    assert.strictEqual(results.resources.extracted_tons, 450);
    assert.strictEqual(results.resources.expansion_viability, 'High');
});

test('manageColonyExpansion handles API failures gracefully', async (t) => {
    // Override one mock to fail
    const originalOpenAI = global.fetchOpenAI;
    global.fetchOpenAI = async () => { throw new Error('OpenAI outage'); };

    try {
        await manageColonyExpansion();
        assert.fail('Should have thrown an error');
    } catch (err) {
        assert.match(err.message, /Orchestration Failed: OpenAI outage/);
    }

    // Restore
    global.fetchOpenAI = originalOpenAI;
});
