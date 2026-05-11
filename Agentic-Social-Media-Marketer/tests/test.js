const test = require('node:test');
const assert = require('node:assert');
const { executeAgentWorkflow } = require('../script.js');

test('executeAgentWorkflow runs correctly', (t) => {
    const result = executeAgentWorkflow('TestProduct', 'TestAudience');

    assert.strictEqual(result.logs.length, 5);
    assert.ok(result.logs[0].text.includes('TestAudience'));
    assert.ok(result.postContent.includes('TestProduct'));
    assert.strictEqual(result.scheduleTime, "Tuesday 10:00 AM EST");
});