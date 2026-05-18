const { test } = require('node:test');
const assert = require('node:assert');
const { orchestrateCleanup } = require('../script');

test('AGI-Ocean-Cleanup-Orchestrator - Parallel Orchestration', async (t) => {
    let droneCalled = false;
    let skimmerCalled = false;
    let logisticsCalled = false;
    let masterCalled = false;

    const callbacks = {
        drone: () => { droneCalled = true; },
        skimmer: () => { skimmerCalled = true; },
        logistics: () => { logisticsCalled = true; },
        master: () => { masterCalled = true; }
    };

    const startTime = Date.now();
    const result = await orchestrateCleanup(callbacks);
    const endTime = Date.now();

    // Assert all callbacks were hit
    assert.ok(droneCalled, 'Drone callback should be hit');
    assert.ok(skimmerCalled, 'Skimmer callback should be hit');
    assert.ok(logisticsCalled, 'Logistics callback should be hit');
    assert.ok(masterCalled, 'Master callback should be hit');

    // Assert the final result contains the synthesized plan
    assert.ok(result.includes('EXECUTION PLAN'), 'Result should contain EXECUTION PLAN');

    // Assert that execution took roughly the max delay of sub-agents (3000ms) + synthesis delay (1500ms)
    // and definitely less than the sum of all delays if run sequentially (approx 2500+3000+2800+1500 = 9800ms)
    const duration = endTime - startTime;
    assert.ok(duration < 8000, `Execution should be parallelized, took ${duration}ms`);
});