const test = require('node:test');
const assert = require('node:assert');
global.fetchLLMResponse = async (provider, prompt) => {
    if (provider === 'error') throw new Error("Mock Error");
    return `Status: Mocked Status\nReasoning: Checked for ${prompt.match(/context: "(.*?)"/)[1]}`;
};
const { moderateContent } = require('../script.js');
test('Content Moderator - Generates analysis', async () => {
    const result = await moderateContent('Hello World', 'gaming', 'openai');
    assert.ok(result.includes('Status: Mocked Status'));
    assert.ok(result.includes('Checked for gaming'));
});
test('Content Moderator - Handles LLM errors gracefully', async () => {
    const result = await moderateContent('Bad words', 'kids', 'error');
    assert.strictEqual(result, 'Error connecting to the LLM service.');
});
