const assert = require('node:assert');
const test = require('node:test');
const { getGateState } = require('../script.js');

test('Automated Train Gate State', async (t) => {
    await t.test('Should close gate when train is approaching', () => {
        assert.strictEqual(getGateState(true), 'closed');
    });

    await t.test('Should open gate when no train is approaching', () => {
        assert.strictEqual(getGateState(false), 'open');
    });
});