const { describe, it } = require('node:test');
const assert = require('node:assert');
const { checkGateStatus, dispatchPod, openGate, closeGate } = require('../script.js');

describe('Automated-Hyperloop-Gate tests', () => {
    // Mock the DOM and log elements
    global.document = {
        getElementById: () => null
    };

    it('should initially have a closed gate', () => {
        closeGate();
        assert.strictEqual(checkGateStatus(), false);
    });

    it('should open the gate', () => {
        openGate();
        assert.strictEqual(checkGateStatus(), true);
    });

    it('should fail to dispatch if gate is closed', () => {
        closeGate();
        assert.strictEqual(dispatchPod(), false);
    });

    it('should successfully dispatch if gate is open', () => {
        openGate();
        assert.strictEqual(dispatchPod(), true);
        assert.strictEqual(checkGateStatus(), false); // Gate closes after dispatch
    });
});
