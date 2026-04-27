const { test } = require('node:test');
const assert = require('node:assert');
const { getNextState } = require('../script');

test('Automated-Traffic-Light-Controller - getNextState', (t) => {
    assert.strictEqual(getNextState('red', false), 'green');
    assert.strictEqual(getNextState('green', false), 'yellow');
    assert.strictEqual(getNextState('yellow', false), 'red');
    assert.strictEqual(getNextState('green', true), 'yellow');
    assert.strictEqual(getNextState('red', true), 'green');
});
