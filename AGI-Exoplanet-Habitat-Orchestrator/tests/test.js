const test = require('node:test');
const assert = require('node:assert');
const { manageLifeSupport, allocateResources, monitorIntegrity, synthesizeGovernorDecision } = require('../script.js');

test('AGI-Exoplanet-Habitat-Orchestrator LLM Logic', async (t) => {

// Mock fetchOpenAI directly for unit tests to prevent undefined errors
global.fetchOpenAI = async (key, model, prompt, userMessage) => {
    const fakeBody = JSON.stringify({ messages: [{content: prompt}] });
    const response = await global.fetch('mock', { body: fakeBody });
    const data = await response.json();
    return data.choices[0].message.content;
};
    global.fetch = async (url, options) => {
        const body = JSON.parse(options.body);
        const prompt = body.messages[0].content;

        let mockResponse = '';
        if (prompt.includes('Life Support Sub-Agent')) {
            mockResponse = 'Oxygen at 98%, temp normal, no action required.';
        } else if (prompt.includes('Resource Allocation Sub-Agent')) {
            mockResponse = 'Diverting 5% solar power to backup batteries.';
        } else if (prompt.includes('Structural Integrity Sub-Agent')) {
            mockResponse = 'Deploying repair drones to Sector 4 microfractures.';
        } else if (prompt.includes('AGI Governor')) {
            mockResponse = 'Habitat status is stable. Proceed with scheduled repair operations in Sector 4 and monitor battery levels.';
        }

        return {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: mockResponse } }]
            })
        };
    };

    const mockTelemetry = {
        lifeSupport: {},
        resources: {},
        structural: {}
    };

    await t.test('manageLifeSupport returns correct sub-agent report', async () => {
        const result = await manageLifeSupport(mockTelemetry);
        assert.strictEqual(result, 'Oxygen at 98%, temp normal, no action required.');
    });

    await t.test('allocateResources returns correct sub-agent report', async () => {
        const result = await allocateResources(mockTelemetry);
        assert.strictEqual(result, 'Diverting 5% solar power to backup batteries.');
    });

    await t.test('monitorIntegrity returns correct sub-agent report', async () => {
        const result = await monitorIntegrity(mockTelemetry);
        assert.strictEqual(result, 'Deploying repair drones to Sector 4 microfractures.');
    });

    await t.test('synthesizeGovernorDecision synthesizes sub-agent reports', async () => {
        const result = await synthesizeGovernorDecision('Report 1', 'Report 2', 'Report 3');
        assert.strictEqual(result, 'Habitat status is stable. Proceed with scheduled repair operations in Sector 4 and monitor battery levels.');
    });
});
