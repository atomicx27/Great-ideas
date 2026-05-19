const assert = require('assert');
const { test } = require('node:test');
const { synthesizeTerraformingStrategy } = require('../script.js');

test('should synthesize terraforming strategy correctly', () => {
    const atmosphere = { tempIncreaseC: 10, timelineYears: 20 };
    const hydrology = { seaLevelRiseM: 50, timelineYears: 50 };
    const biosphere = { coveragePercent: 30 };

    const result = synthesizeTerraformingStrategy(atmosphere, hydrology, biosphere);

    assert.strictEqual(result.missionStatus, "Planetary Biosphere Initiated: Phase 1 Terraforming");
    assert.strictEqual(result.actions.length, 3);
    assert.ok(result.actions[0].includes('+10°C'));
    assert.ok(result.actions[0].includes('20 years'));
    assert.ok(result.actions[1].includes('50 meters'));
    assert.ok(result.actions[2].includes('30%'));
});
