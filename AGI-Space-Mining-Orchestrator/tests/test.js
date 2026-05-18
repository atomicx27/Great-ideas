const { test } = require('node:test');
const assert = require('node:assert');
const { orchestrateMiningMission } = require('../script');

test('AGI-Space-Mining-Orchestrator - Parallel Orchestration', async (t) => {
    let extCalled = false;
    let procCalled = false;
    let logCalled = false;
    let masterCalled = false;

    const callbacks = {
        ext: () => { extCalled = true; },
        proc: () => { procCalled = true; },
        log: () => { logCalled = true; },
        master: () => { masterCalled = true; }
    };

    const startTime = Date.now();
    const result = await orchestrateMiningMission(callbacks);
    const endTime = Date.now();

    // Assert all callbacks were hit
    assert.ok(extCalled, 'Extraction callback should be hit');
    assert.ok(procCalled, 'Processing callback should be hit');
    assert.ok(logCalled, 'Logistics callback should be hit');
    assert.ok(masterCalled, 'Master callback should be hit');

    // Assert the final result contains the synthesized blueprint
    assert.ok(result.includes('MISSION BLUEPRINT APPROVED'), 'Result should contain MISSION BLUEPRINT');

    // Check parallelization: max sub-agent delay (3500ms) + synthesis delay (2000ms) = ~5500ms.
    // If sequential, it would be at least 1500+1800+1200+2000 = 6500ms, realistically ~9000ms.
    // We expect it to finish under 6500ms due to Promise.all
    const duration = endTime - startTime;
    assert.ok(duration < 7000, `Execution should be parallelized, took ${duration}ms`);
});