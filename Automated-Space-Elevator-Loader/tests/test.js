const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { loadCargo, resetPayload, getCurrentPayload, MAX_PAYLOAD_KG } = require('../script.js');

describe('Automated-Space-Elevator-Loader tests', () => {
    global.document = {
        getElementById: () => null
    };

    beforeEach(() => {
        resetPayload();
    });

    it('should successfully load valid cargo', () => {
        const result = loadCargo(5000);
        assert.strictEqual(result, true);
        assert.strictEqual(getCurrentPayload(), 5000);
    });

    it('should fail to load cargo exceeding max capacity', () => {
        const result = loadCargo(25000);
        assert.strictEqual(result, false);
        assert.strictEqual(getCurrentPayload(), 0);
    });

    it('should fail to load negative cargo', () => {
        const result = loadCargo(-500);
        assert.strictEqual(result, false);
    });
});
