const { describe, it } = require('node:test');
const assert = require('node:assert');
const { monitorHologramState, triggerAlerts } = require('../script.js');

describe('Automated Hologram Monitor Logic', () => {
    it('should return stable state for high power and stability', () => {
        assert.strictEqual(monitorHologramState(80, 0.9), "Hologram stable");
    });

    it('should return warning state for low power', () => {
        assert.strictEqual(monitorHologramState(40, 0.9), "Warning: Hologram unstable");
    });

    it('should return warning state for low stability', () => {
        assert.strictEqual(monitorHologramState(80, 0.7), "Warning: Hologram unstable");
    });

    it('should trigger alert on warning', () => {
        assert.strictEqual(triggerAlerts("Warning: Hologram unstable"), "Alert triggered: Technician dispatched");
    });

    it('should not trigger alert on stable', () => {
        assert.strictEqual(triggerAlerts("Hologram stable"), "No alerts");
    });
});
