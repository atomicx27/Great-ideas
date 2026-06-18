const assert = require('assert');
const { moderateContent } = require('../script.js');

// Test 1: Safe content
{
    const result = moderateContent('Hello, this is a very nice post.');
    assert.strictEqual(result.status, 'safe');
}

// Test 2: Flagged content
{
    const result = moderateContent('Check out this amazing crypto scam!');
    assert.strictEqual(result.status, 'flagged');
    assert.ok(result.matched.includes('crypto'));
    assert.ok(result.matched.includes('scam'));
}

console.log('Automated-Content-Moderator tests passed!');
