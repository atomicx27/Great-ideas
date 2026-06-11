const assert = require('node:assert');
const test = require('node:test');
const { calculateDeploymentAngle } = require('../script.js');

test('Automated-Dyson-Swarm-Deployer: calculates angle and stress correctly', (t) => {
    // Test base case
    let result = calculateDeploymentAngle(0.8, 400); // 0.5 <= radius <= 1.0, 300 <= wind <= 700
    assert.strictEqual(result.optimalAngle, 45);
    assert.strictEqual(result.structuralStress, "NOMINAL");

    // Test closer orbit
    result = calculateDeploymentAngle(0.4, 400); // radius < 0.5
    assert.strictEqual(result.optimalAngle, 60); // 45 + 15
    assert.strictEqual(result.structuralStress, "NOMINAL");

    // Test high solar wind
    result = calculateDeploymentAngle(0.8, 750); // wind > 700
    assert.strictEqual(result.optimalAngle, 55); // 45 + 10
    assert.strictEqual(result.structuralStress, "ELEVATED");

    // Test critical stress condition (high wind)
    result = calculateDeploymentAngle(0.8, 850);
    assert.strictEqual(result.structuralStress, "CRITICAL");

    // Test critical stress condition (close orbit)
    result = calculateDeploymentAngle(0.2, 400);
    assert.strictEqual(result.structuralStress, "CRITICAL");
});
