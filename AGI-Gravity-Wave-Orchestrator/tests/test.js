const assert = require('assert');
const { orchestrateInterstellarComms } = require('../script.js');

global.fetch = async () => ({
    ok: true,
    json: async () => ({
        choices: [
            { message: { content: "Mocked response for communications agent." } }
        ]
    })
});

(async () => {
    try {
        const results = await orchestrateInterstellarComms("Establish link.");
        assert.strictEqual(results.detectorRes, "Mocked response for communications agent.");
        assert.strictEqual(results.decoderRes, "Mocked response for communications agent.");
        assert.strictEqual(results.transmitterRes, "Mocked response for communications agent.");

        console.log("TAP version 13\n1..1\nok 1 - AGI comms orchestrator resolves sub-agents successfully");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
