const test = require('node:test');
const assert = require('node:assert');
const { allocateBuildingMaterials } = require('../script.js');

test('allocateBuildingMaterials calculates correct allocations', (t) => {
    // Valid inputs
    let result = allocateBuildingMaterials(100, 4);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.materials.regolithConcrete, '250.00');
    assert.strictEqual(result.materials.aluminumFrames, '80.00');
    assert.strictEqual(result.materials.glassComposite, '200.00');

    // Invalid volume
    result = allocateBuildingMaterials(5, 4);
    assert.strictEqual(result.success, false);
    assert.match(result.message, /Minimum volume is 10/);

    // Invalid crew
    result = allocateBuildingMaterials(100, 60);
    assert.strictEqual(result.success, false);
    assert.match(result.message, /Crew size must be between 1 and 50/);
});
