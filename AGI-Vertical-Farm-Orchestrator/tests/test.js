const test = require('node:test');
const assert = require('node:assert');
const { orchestrateFarmSwarm } = require('../script.js');

test('orchestrateFarmSwarm runs sub-agents', async () => {
    // Mock the simulateSubAgent function
    const mockSimulateSubAgent = async (key, taskName, delay, result) => {
        return result;
    };

    const goal = "Maximize yield";
    const report = await orchestrateFarmSwarm(goal, mockSimulateSubAgent);

    assert.ok(report.includes('ORCHESTRATION COMPLETE'));
    assert.ok(report.includes(goal));
    assert.ok(report.includes('Energy consumption reduced'));
    assert.ok(report.includes('Harvesting scheduled'));
});

test('orchestrateFarmSwarm handles errors', async () => {
    const mockSimulateSubAgent = async (key, taskName, delay, result) => {
        throw new Error('Sub-agent failure');
    };

    const goal = "Maximize yield";

    try {
        await orchestrateFarmSwarm(goal, mockSimulateSubAgent);
        assert.fail('Should have thrown an error');
    } catch (error) {
        assert.ok(error.message.includes('Orchestration failed'));
        assert.ok(error.message.includes('Sub-agent failure'));
    }
});
