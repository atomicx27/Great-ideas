const assert = require('node:assert');
const { orchestrateHolisticHealth } = require('../script.js');

// Mock global functions
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage, options) => {
    if (apiKey === 'bad-key') {
        throw new Error('OpenAI API Error');
    }

    // Simulate sub-agent responses
    if (systemPrompt.includes('Dietary')) return 'Eat less sugar.';
    if (systemPrompt.includes('Fitness')) return 'Walk 30 mins a day.';
    if (systemPrompt.includes('Sleep')) return 'Go to bed at 10 PM.';

    // Simulate Master Synthesis
    if (systemPrompt.includes('Master Health Orchestrator')) {
        return `Synthesized Plan: ${userMessage.replace(/\n/g, ' ')}`;
    }
    return 'Default mock';
};

async function runTests() {
    // Test 1: Missing API Key
    try {
        await orchestrateHolisticHealth({}, '');
        assert.fail('Should have thrown error for missing API key');
    } catch (e) {
        assert.strictEqual(e.message, 'API Key is required');
    }

    // Test 2: Successful Orchestration
    const result = await orchestrateHolisticHealth({ age: 45 }, 'sk-mock-key');
    assert.ok(result.includes('Synthesized Plan: Diet: Eat less sugar. Fitness: Walk 30 mins a day. Sleep: Go to bed at 10 PM.'));

    console.log('AGI-Health-Orchestrator tests passed!');
}

runTests();