const assert = require('node:assert');
const { generateHealthAdvice } = require('../script.js');

// Mock fetchOpenAI globally since script.js expects it to be available via shared/llm-api.js
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage, options) => {
    if (apiKey === 'bad-key') {
        throw new Error('OpenAI API Error');
    }
    return `Mocked advice based on: ${userMessage.includes('65') ? 'Poor Sleep' : 'Good Sleep'}`;
};

async function runTests() {
    // Test 1: Missing API Key
    try {
        await generateHealthAdvice({}, '');
        assert.fail('Should have thrown error for missing API key');
    } catch (e) {
        assert.strictEqual(e.message, 'API Key is required');
    }

    // Test 2: Successful generation
    const result = await generateHealthAdvice({ score: 65 }, 'sk-mock-key');
    assert.strictEqual(result, 'Mocked advice based on: Poor Sleep');

    // Test 3: API Error propagation
    try {
        await generateHealthAdvice({ score: 90 }, 'bad-key');
        assert.fail('Should have thrown API error');
    } catch (e) {
        assert.strictEqual(e.message, 'OpenAI API Error');
    }

    console.log('Agentic-Health-Coach tests passed!');
}

runTests();