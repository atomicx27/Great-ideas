const assert = require('node:assert');
const { orchestrateMediaEmpire } = require('../script.js');

// Mock global functions
global.fetchOpenAI = async (apiKey, model, systemPrompt, userMessage, options) => {
    if (apiKey === 'bad-key') {
        throw new Error('OpenAI API Error');
    }

    // Simulate sub-agent responses
    if (systemPrompt.includes('Strategy')) return 'Focus on Instagram first.';
    if (systemPrompt.includes('Content')) return 'Make 3 short videos.';
    if (systemPrompt.includes('Engagement')) return 'Reply to all comments.';

    // Simulate Master Synthesis
    if (systemPrompt.includes('Master Media Empire Orchestrator')) {
        return `Campaign Rollout: ${userMessage.replace(/\n/g, ' ')}`;
    }
    return 'Default mock';
};

async function runTests() {
    // Test 1: Missing API Key
    try {
        await orchestrateMediaEmpire('Launch product', '');
        assert.fail('Should have thrown error for missing API key');
    } catch (e) {
        assert.strictEqual(e.message, 'API Key is required');
    }

    // Test 2: Successful Orchestration
    const result = await orchestrateMediaEmpire('Launch product', 'sk-mock-key');
    assert.ok(result.includes('Campaign Rollout: Strategy: Focus on Instagram first. Content: Make 3 short videos. Engagement: Reply to all comments.'));

    console.log('AGI-Media-Empire-Orchestrator tests passed!');
}

runTests();