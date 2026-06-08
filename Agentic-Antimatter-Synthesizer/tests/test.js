const assert = require('assert');
const { optimizeSynthesis } = require('../script.js');

global.fetch = async () => ({
    ok: true,
    json: async () => ({
        choices: [
            { message: { content: "Decrease beam energy slightly and increase positron density for optimal cooling." } }
        ]
    })
});

(async () => {
    try {
        const result = await optimizeSynthesis(5.0, 3.0);
        assert.ok(result.includes("Decrease beam energy slightly"));

        console.log("TAP version 13\n1..1\nok 1 - Autonomous optimization successful");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
