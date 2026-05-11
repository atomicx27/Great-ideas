const test = require('node:test');
const assert = require('node:assert');
const { orchestrateMedicinePlan, Agents } = require('../script.js');

test('AGI Precision Medicine Orchestrator Swarm Logic', async (t) => {

    await t.test('Master Orchestrator triggers all agents and synthesizes output', async () => {
        const patientData = "45yo Female, Stage II Breast Cancer, BRCA1 Pathogenic Variant, Allergic to Penicillin";
        let completedAgents = [];

        const callbacks = {
            onAgentComplete: (agentId) => {
                completedAgents.push(agentId);
            }
        };

        const finalPlan = await orchestrateMedicinePlan(patientData, Agents, callbacks);

        // Verify parallel execution completion
        assert.strictEqual(completedAgents.length, 3, 'All three agents should complete');
        assert.ok(completedAgents.includes('genomics'));
        assert.ok(completedAgents.includes('pharmacy'));
        assert.ok(completedAgents.includes('oncology'));

        // Verify synthesis incorporates agent findings
        assert.ok(finalPlan.includes('BRCA1'), 'Synthesis should include genomics findings');
        assert.ok(finalPlan.includes('Penicillin allergy') || finalPlan.includes('pharmacological allergy constraints'), 'Synthesis should address pharmacy alerts');
        assert.ok(finalPlan.includes('localized'), 'Synthesis should include oncology assessment');
    });
});