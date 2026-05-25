const assert = require('node:assert');
const { test } = require('node:test');
const { orchestrateFranchise } = require('../script.js');

test('orchestrates franchise rollout', async () => {
    const mockFetch = async () => "- Real Estate: secured\n- Supply Chain: contracted";
    const expected = ["- Real Estate: secured", "- Supply Chain: contracted"];
    const result = await orchestrateFranchise("Test Goal", mockFetch);
    assert.deepStrictEqual(result, expected);
});
