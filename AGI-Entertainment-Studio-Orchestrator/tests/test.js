const test = require('node:test');
const assert = require('node:assert');
const { synthesizeCampaign } = require('../script.js');

test('synthesizeCampaign formats correctly', (t) => {
    const prompt = "Test Campaign";
    const writer = { title: "Test Title", script: "Test Script" };
    const video = { prompt: "Test Prompt", duration: 15 };
    const marketing = { demographic: "Test Demo", budget: "$100" };

    const result = synthesizeCampaign(prompt, writer, video, marketing);

    assert.strictEqual(result.concept, "Test Campaign");
    assert.strictEqual(result.assets.length, 3);

    assert.ok(result.assets[0].content.includes("Test Title"));
    assert.ok(result.assets[0].content.includes("Test Script"));

    assert.ok(result.assets[1].content.includes("Test Prompt"));
    assert.ok(result.assets[1].content.includes("15s"));

    assert.ok(result.assets[2].content.includes("Test Demo"));
    assert.ok(result.assets[2].content.includes("$100"));
});
