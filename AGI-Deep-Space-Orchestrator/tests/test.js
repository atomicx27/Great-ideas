const test = require('node:test');
const assert = require('node:assert');
const { orchestrateDeepSpace } = require('../script.js');

test('orchestrateDeepSpace runs sub-agents correctly', async () => {
    const mockSimulateSubAgent = async (key, taskName, delay, result) => {
        return result;
    };

    const mission = "Target System Proxima Centauri.";
    const report = await orchestrateDeepSpace(mission, mockSimulateSubAgent);

    assert.ok(report.includes('MISSION BRIEFING UPDATE'));
    assert.ok(report.includes(mission));
    assert.ok(report.includes('Orbital trajectory locked.'));
    assert.ok(report.includes('Sensors online.'));
    assert.ok(report.includes('Comms relay stable.'));
});

test('orchestrateDeepSpace handles sub-agent failures', async () => {
    const mockSimulateSubAgent = async (key, taskName, delay, result) => {
        if (key === 'spectro') throw new Error('Sensor failure');
        return result;
    };

    const mission = "Target System Proxima Centauri.";

    try {
        await orchestrateDeepSpace(mission, mockSimulateSubAgent);
        assert.fail('Should have thrown an error');
    } catch (error) {
        assert.ok(error.message.includes('Orchestration failed'));
        assert.ok(error.message.includes('Sensor failure'));
    }
});
