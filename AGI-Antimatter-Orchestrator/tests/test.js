const assert = require('assert');
const { orchestrateAntimatterProduction } = require('../script.js');

global.fetch = async () => ({
    ok: true,
    json: async () => ({
        choices: [
            { message: { content: "Mocked response for agent." } }
        ]
    })
});

(async () => {
    try {
        const results = await orchestrateAntimatterProduction("Produce 1g of antimatter.");
        assert.strictEqual(results.trappingRes, "Mocked response for agent.");
        assert.strictEqual(results.coolingRes, "Mocked response for agent.");
        assert.strictEqual(results.synthesisRes, "Mocked response for agent.");

        console.log("TAP version 13\n1..1\nok 1 - AGI orchestrator resolves sub-agents successfully");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
