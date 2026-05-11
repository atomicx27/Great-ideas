const test = require('node:test');
const assert = require('node:assert');
const { navigateWaypoint } = require('../script.js');

test('navigateWaypoint clear path', (t) => {
    const result = navigateWaypoint('Base', 'WP-1', 'clear', []);
    assert.strictEqual(result.finalPosition, 'WP-1');
    assert.strictEqual(result.logs.length, 2);
    assert.ok(result.logs[0].text.includes('WP-1'));
});

test('navigateWaypoint bad weather', (t) => {
    const result = navigateWaypoint('WP-1', 'WP-2', 'heavy_rain', []);
    assert.strictEqual(result.finalPosition, 'WP-2');
    assert.ok(result.logs.some(log => log.type === 'decision' && log.text.includes('Decreasing airspeed')));
});

test('navigateWaypoint obstacle avoidance', (t) => {
    const result = navigateWaypoint('WP-2', 'WP-3', 'clear', ['crane']);
    assert.strictEqual(result.finalPosition, 'Evasive_Altitude_WP-3');
    assert.ok(result.logs.some(log => log.type === 'warning' && log.text.includes('uncharted construction crane')));
    assert.ok(result.logs.some(log => log.type === 'decision' && log.text.includes('evasive maneuver')));
});