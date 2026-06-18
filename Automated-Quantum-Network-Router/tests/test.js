const test = require('node:test');
const assert = require('node:assert');
const { routeQuantumPackets } = require('../script.js');

test('routeQuantumPackets deterministically routes based on parameters', (t) => {
    // Edge case: Negative bandwidth
    let result = routeQuantumPackets(-10, 5);
    assert.strictEqual(result.success, false);
    assert.match(result.message, /Bandwidth must be greater than 0/);

    // Low Capacity Link
    result = routeQuantumPackets(50, 2);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.path, 'Low-Capacity-Link-A');

    // Medium Capacity Link
    result = routeQuantumPackets(300, 6);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.path, 'Medium-Capacity-Link-B');

    // High Capacity Link
    result = routeQuantumPackets(800, 9);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.path, 'High-Capacity-Link-C');

    // Default Link (e.g. low bandwidth but high priority)
    result = routeQuantumPackets(50, 9);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.path, 'Default-Link-D');
});
