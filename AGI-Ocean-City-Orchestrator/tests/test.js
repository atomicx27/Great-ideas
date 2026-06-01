const test = require('node:test');
const assert = require('node:assert');
const { manageBallast, scaleDesalination, routeTraffic, synthesizeGovernorDecision } = require('../script.js');

test('AGI-Ocean-City-Orchestrator LLM Logic', async (t) => {

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
        if (prompt.includes('Structural Ballasting Agent')) {
            mockResponse = 'Flooding port ballasts to counteract 220 km/h winds and maintain structural level.';
        } else if (prompt.includes('Desalination Control Agent')) {
            mockResponse = 'Halting desalination to reserve 70% grid capacity for shields and pumps.';
        } else if (prompt.includes('Oceanic Traffic Agent')) {
            mockResponse = 'Locking down all exposed docks and rerouting Supply Barge A to deep harbor.';
        } else if (prompt.includes('Prime AGI Governor')) {
            mockResponse = 'Typhoon protocol active. City level secured and non-essential power diverted to critical defenses. All incoming traffic must hold in deep harbor until the storm passes.';
        }

        return {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: mockResponse } }]
            })
        };
    };

    const mockData = {};

    await t.test('manageBallast returns correct sub-agent report', async () => {
        const result = await manageBallast(mockData);
        assert.strictEqual(result, 'Flooding port ballasts to counteract 220 km/h winds and maintain structural level.');
    });

    await t.test('scaleDesalination returns correct sub-agent report', async () => {
        const result = await scaleDesalination(mockData);
        assert.strictEqual(result, 'Halting desalination to reserve 70% grid capacity for shields and pumps.');
    });

    await t.test('routeTraffic returns correct sub-agent report', async () => {
        const result = await routeTraffic(mockData);
        assert.strictEqual(result, 'Locking down all exposed docks and rerouting Supply Barge A to deep harbor.');
    });

    await t.test('synthesizeGovernorDecision synthesizes sub-agent reports', async () => {
        const reports = { ballast: 'b', desal: 'd', traffic: 't' };
        const result = await synthesizeGovernorDecision(reports);
        assert.strictEqual(result, 'Typhoon protocol active. City level secured and non-essential power diverted to critical defenses. All incoming traffic must hold in deep harbor until the storm passes.');
    });
});
