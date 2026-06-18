const assert = require('node:assert');
const { generatePostContent } = require('../script.js');

// Mock fetchOpenAI globally since script.js expects it to be available via shared/llm-api.js
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage, options) => {
    if (apiKey === 'bad-key') {
        throw new Error('OpenAI API Error');
    }
    return `Loving the new ${userMessage.replace('Topic: ', '')} trends! ✨♻️👗 #fashion #eco #summer`;
};

async function runTests() {
    // Test 1: Missing API Key
    try {
        await generatePostContent('test', '');
        assert.fail('Should have thrown error for missing API key');
    } catch (e) {
        assert.strictEqual(e.message, 'API Key is required');
    }

    // Test 2: Successful generation
    const result = await generatePostContent('Sustainable Fashion', 'sk-mock-key');
    assert.ok(result.includes('Loving the new Sustainable Fashion trends!'));
    assert.ok(result.includes('#fashion'));

    // Test 3: API Error propagation
    try {
        await generatePostContent('test', 'bad-key');
        assert.fail('Should have thrown API error');
    } catch (e) {
        assert.strictEqual(e.message, 'OpenAI API Error');
    }

    console.log('Agentic-Virtual-Influencer tests passed!');
}

runTests();