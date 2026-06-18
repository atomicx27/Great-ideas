const test = require('node:test');
const assert = require('node:assert');
global.fetchLLMResponse = async (provider, prompt) => {
    if (provider === 'error') throw new Error("Mock Error");
    return `Mock Strategy for $${prompt.match(/\$(\d+)/)[1]} income`;
};
const { generateWealthAdvice } = require('../script.js');
test('Wealth Advisor - Generates advice successfully', async () => {
    const result = await generateWealthAdvice(100000, 'Retire', 'low', 'openai');
    assert.strictEqual(result, 'Mock Strategy for $100000 income');
});
test('Wealth Advisor - Handles LLM errors gracefully', async () => {
    const result = await generateWealthAdvice(50000, 'Buy car', 'high', 'error');
    assert.strictEqual(result, 'Error connecting to the LLM service.');
});
