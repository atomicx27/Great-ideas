const assert = require('assert');
const { synthesizeClimateResolution } = require('../script.js');

try {
    const energy = { renewableMW: '2000' };
    const capture = { plants: '15' };
    const policy = { taxIncrease: '2.0' };

    const result = synthesizeClimateResolution(energy, capture, policy);

    assert.strictEqual(result.resolutionStatus, 'Global Climate Strategy Synthesized and Executed.');
    assert.strictEqual(result.actions.length, 3);
    assert.ok(result.actions[0].includes('2000 MW'));
    assert.ok(result.actions[1].includes('15 direct air capture facilities'));
    assert.ok(result.actions[2].includes('+2.0%'));

    console.log('AGI-Global-Climate-Orchestrator tests passed.');
} catch (error) {
    console.error('AGI-Global-Climate-Orchestrator tests failed:', error);
    process.exit(1);
}
