const test = require('node:test');
const assert = require('node:assert');
const { runLinter } = require('../script.js');

test('Automated-Code-Linter logic', (t) => {
    const badCode = `
var x = 10;
let y = 20
console.log(x);
    `;
    const issues = runLinter(badCode);

    assert.strictEqual(issues.length, 3);
    assert.ok(issues[0].includes('var'));
    assert.ok(issues[1].includes('semicolon'));
    assert.ok(issues[2].includes('console.log'));

    const goodCode = `
const x = 10;
let y = 20;
    `;
    const clean = runLinter(goodCode);
    assert.strictEqual(clean.length, 0);
});