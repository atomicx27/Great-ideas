const test = require('node:test');
const assert = require('node:assert');

// Mock globally
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage) => {
    if (userMessage.includes('error')) {
        throw new Error('API Error Mock');
    }
    return JSON.stringify({
        primary_zone: 'Hydroponics Lab',
        layout_score: 95
    });
};

const { designHabitatLayout } = require('../script.js');

test('designHabitatLayout successfully processes crew details', async (t) => {
    const result = await designHabitatLayout('3 Botanists');

    assert.strictEqual(result.primary_zone, 'Hydroponics Lab');
    assert.strictEqual(result.layout_score, 95);
});

test('designHabitatLayout handles API errors', async (t) => {
    try {
        await designHabitatLayout('error details');
        assert.fail('Should have thrown an error');
    } catch (err) {
        assert.match(err.message, /Design Generation Failed: API Error Mock/);
    }
});

test('designHabitatLayout handles invalid input', async (t) => {
    try {
        await designHabitatLayout('');
        assert.fail('Should have thrown an error');
    } catch (err) {
        assert.strictEqual(err.message, 'Invalid crew details provided.');
    }
});
