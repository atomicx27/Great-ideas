const assert = require('node:assert');
const test = require('node:test');
const { formulateActionPlan } = require('../script.js');

test('Agentic-Anti-Poaching-Patrol logic', async (t) => {
    await t.test('Dispatches team on confirmed threat', () => {
        const drone = "Thermal signatures detected: 2 humans";
        const gps = "sudden movement burst";
        const result = formulateActionPlan(drone, gps);
        assert.match(result, /CRITICAL ALERT/);
        assert.match(result, /Dispatching armed ranger team/);
    });

    await t.test('Logs normal status on false alarm', () => {
        const drone = "No anomalous thermal signatures";
        const gps = "normal resting patterns";
        const result = formulateActionPlan(drone, gps);
        assert.match(result, /Status Normal/);
    });
});
