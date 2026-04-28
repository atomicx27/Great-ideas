const test = require('node:test');
const assert = require('node:assert');
const { MaintenanceAgent } = require('../script.js');

test('Agentic Predictive Maintenance Bot tests', async (t) => {
    await t.test('agent analyzes anomaly and returns decision', async () => {
        const agent = new MaintenanceAgent();
        const result = await agent.analyzeAnomaly("Test Anomaly");

        assert.ok(result.thoughtProcess.length > 0, 'Thought process should have entries');
        assert.ok(result.decision.action.includes('bearing replacement'), 'Decision should recommend replacement');
        assert.strictEqual(result.decision.confidence, '98%');
    });

    await t.test('tools return expected data strings', () => {
        const agent = new MaintenanceAgent();
        assert.match(agent.tools.queryThermalHistory(), /Thermal gradient/);
        assert.match(agent.tools.queryMaintenanceLogs(), /Last lubrication/);
        assert.match(agent.tools.runAcousticAnalysis(), /High-frequency grinding/);
    });
});
