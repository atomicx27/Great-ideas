const test = require('node:test');
const assert = require('node:assert');
const { screenResumes } = require('../script.js');

test('Automated-Resume-Screener logic', (t) => {
    const keywords = ['React', 'JavaScript', 'HTML'];
    const resumes = [
        { id: 'C1', name: 'Dev 1', content: 'I know React, JavaScript, and HTML perfectly.' }, // 3/3 = 100%
        { id: 'C2', name: 'Dev 2', content: 'I write JavaScript and HTML.' }, // 2/3 = 66%
        { id: 'C3', name: 'Dev 3', content: 'I am a Python dev.' } // 0/3 = 0%
    ];

    const results = screenResumes(resumes, keywords);

    assert.strictEqual(results.length, 3);

    assert.strictEqual(results[0].candidateId, 'C1');
    assert.strictEqual(results[0].matchPercentage, '100');
    assert.strictEqual(results[0].status, 'Pass');

    assert.strictEqual(results[1].candidateId, 'C2');
    assert.strictEqual(results[1].matchPercentage, '67'); // 66.6... rounds up
    assert.strictEqual(results[1].status, 'Pass');

    assert.strictEqual(results[2].candidateId, 'C3');
    assert.strictEqual(results[2].matchPercentage, '0');
    assert.strictEqual(results[2].status, 'Fail');
});