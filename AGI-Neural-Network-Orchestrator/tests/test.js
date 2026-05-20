const assert = require('assert');
const { test } = require('node:test');
const { synthesizeNeuralStrategy } = require('../script.js');

test('should synthesize neural strategy correctly', () => {
    const motor = { accuracyPercent: 99.5, latencyMs: 10 };
    const sensory = { bandwidthMbps: 500 };
    const spinal = { lowerLimbState: "Active" };

    const result = synthesizeNeuralStrategy(motor, sensory, spinal);

    assert.strictEqual(result.missionStatus, "Full-Body Neural Bridging: Synchronized");
    assert.strictEqual(result.actions.length, 3);
    assert.ok(result.actions[0].includes('99.5%'));
    assert.ok(result.actions[0].includes('10ms'));
    assert.ok(result.actions[1].includes('500 Mbps'));
    assert.ok(result.actions[2].includes('Active'));
});
