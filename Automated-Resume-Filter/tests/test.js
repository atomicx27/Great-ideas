const test = require('node:test');
const assert = require('node:assert');
const { filterResume } = require('../script.js');

test('Automated Resume Filter - High Match', (t) => {
    const resume = "Experienced software engineer with deep knowledge of JavaScript, React, and Node.js backend systems.";
    const keywords = "JavaScript, React, Node.js";
    const result = filterResume(resume, keywords);

    assert.strictEqual(result.score, 100);
    assert.deepStrictEqual(result.matched, ['javascript', 'react', 'node.js']);
    assert.deepStrictEqual(result.missing, []);
});

test('Automated Resume Filter - Medium Match', (t) => {
    const resume = "Frontend developer skilled in JavaScript and React.";
    const keywords = "JavaScript, React, Node.js";
    const result = filterResume(resume, keywords);

    assert.strictEqual(result.score, 67);
    assert.deepStrictEqual(result.matched, ['javascript', 'react']);
    assert.deepStrictEqual(result.missing, ['node.js']);
});

test('Automated Resume Filter - Low Match', (t) => {
    const resume = "Python developer.";
    const keywords = "JavaScript, React, Node.js";
    const result = filterResume(resume, keywords);

    assert.strictEqual(result.score, 0);
    assert.deepStrictEqual(result.matched, []);
    assert.deepStrictEqual(result.missing, ['javascript', 'react', 'node.js']);
});

test('Automated Resume Filter - Empty inputs', (t) => {
    const result = filterResume("", "");
    assert.strictEqual(result.score, 0);
});
