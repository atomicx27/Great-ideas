const test = require('node:test');
const assert = require('node:assert');
const { calculateDistance, checkCollisionRisk } = require('../script.js');

test('Space Traffic Controller Logic', async (t) => {
    await t.test('calculates distance correctly', () => {
        const d = calculateDistance({x:0, y:0, z:0}, {x:3, y:4, z:0});
        assert.strictEqual(d, 5);
    });

    await t.test('detects critical risk', () => {
        const res = checkCollisionRisk(4.9);
        assert.strictEqual(res.status, 'Critical Collision Risk');
        assert.strictEqual(res.class, 'critical');
    });

    await t.test('detects warning', () => {
        const res = checkCollisionRisk(15.0);
        assert.strictEqual(res.status, 'Warning: Close Proximity');
        assert.strictEqual(res.class, 'warning');
    });

    await t.test('detects clear', () => {
        const res = checkCollisionRisk(25.0);
        assert.strictEqual(res.status, 'Clear: Safe Distance');
        assert.strictEqual(res.class, 'clear');
    });
});
