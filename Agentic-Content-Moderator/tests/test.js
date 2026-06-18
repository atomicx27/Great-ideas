const assert = require('assert');

// Mock global fetchOpenAI before requiring script.js
global.fetchOpenAI = async (apiKey, model, systemPrompt, text) => {
    if (text.includes('scam')) {
        return '**Decision:** Flagged\n**Reasoning:** Scam detected.';
    }
    return '**Decision:** Safe\n**Reasoning:** Clean text.';
};

const { analyzeContent } = require('../script.js');

async function runTests() {
    // Test 1: Invalid input
    const errResult = await analyzeContent('key', null);
    assert.strictEqual(errResult, 'Error: Invalid input');

    // Test 2: Mocked Flagged content
    const flaggedResult = await analyzeContent('key', 'This is a scam');
    assert.ok(flaggedResult.includes('Flagged'));

    // Test 3: Mocked Safe content
    const safeResult = await analyzeContent('key', 'This is a nice post');
    assert.ok(safeResult.includes('Safe'));

    console.log('Agentic-Content-Moderator tests passed!');
}

runTests().catch(err => {
    console.error(err);
    process.exit(1);
});
