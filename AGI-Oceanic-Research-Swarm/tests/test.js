const assert = require('node:assert');
const test = require('node:test');
const { orchestrateSwarm } = require('../script.js');

test('AGI Oceanic Research Swarm Orchestrator', async (t) => {
    let orchestratorLogs = [];
    let agentUpdates = [];
    let reportText = "";

    const mockCallbacks = {
        orchestrator: (msg) => orchestratorLogs.push(msg),
        showSwarm: () => {},
        showReport: (text) => reportText = text,
        agentUpdate: (agent, type, value) => agentUpdates.push({agent, type, value})
    };

    const result = await orchestrateSwarm("Test Goal", mockCallbacks);

    await t.test('Orchestrator logs correct flow', () => {
        assert.ok(orchestratorLogs.includes("Goal registered. Breaking down tasks..."));
        assert.ok(orchestratorLogs.includes("Synthesis complete. Report generated."));
    });

    await t.test('All agents deployed and finished', () => {
        const agents = ['mapper', 'biologist', 'chemist'];
        for(let agent of agents) {
            const startLog = agentUpdates.find(u => u.agent === agent && u.type === 'status' && u.value === 'working');
            const endLog = agentUpdates.find(u => u.agent === agent && u.type === 'status' && u.value === 'done');
            assert.ok(startLog, `${agent} should start working`);
            assert.ok(endLog, `${agent} should finish working`);
        }
    });

    await t.test('Final report generated correctly', () => {
        assert.ok(reportText.includes("Test Goal"));
        assert.ok(reportText.includes("Executive Research Summary"));
        assert.strictEqual(result, reportText);
    });
});
