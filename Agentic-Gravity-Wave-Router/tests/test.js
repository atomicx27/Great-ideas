const assert = require('assert');
const { routeWaveMessage } = require('../script.js');

global.fetch = async () => ({
    ok: true,
    json: async () => ({
        choices: [
            { message: { content: "Route to Alpha Centauri relay immediately." } }
        ]
    })
});

(async () => {
    try {
        const result = await routeWaveMessage("complex chirp 01");
        assert.ok(result.includes("Alpha Centauri"));

        console.log("TAP version 13\n1..1\nok 1 - Autonomous wave routing successful");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
