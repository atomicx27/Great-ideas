const assert = require('node:assert');
const test = require('node:test');
const { orchestrateMiningSwarm } = require('../script.js');

test('AGI Asteroid Mining Orchestrator', async (t) => {
    let orchestratorLogs = [];
    let agentUpdates = [];
    let reportText = "";

    const mockCallbacks = {
        orchestrator: (msg) => orchestratorLogs.push(msg),
        showSwarm: () => {},
        showReport: (text) => reportText = text,
        agentUpdate: (agent, type, value) => agentUpdates.push({agent, type, value})
    };

    const result = await orchestrateMiningSwarm("Mine Iron", mockCallbacks);

    await t.test('Orchestrator logs correct flow', () => {
        assert.ok(orchestratorLogs.includes("Directive received. Computing logistical breakdown..."));
        assert.ok(orchestratorLogs.includes("Manifest finalized. Operations concluded."));
    });

    await t.test('All swarm elements deployed and finished', () => {
        const agents = ['scanner', 'miner', 'transport'];
        for(let agent of agents) {
            const startLog = agentUpdates.find(u => u.agent === agent && u.type === 'status' && u.value === 'working');
            const endLog = agentUpdates.find(u => u.agent === agent && u.type === 'status' && u.value === 'done');
            assert.ok(startLog, `${agent} should start working`);
            assert.ok(endLog, `${agent} should finish working`);
        }
    });

    await t.test('Final manifest generated correctly', () => {
        assert.ok(reportText.includes("Mine Iron"));
        assert.ok(reportText.includes("Logistics Manifest"));
        assert.strictEqual(result, reportText);
    });
});
