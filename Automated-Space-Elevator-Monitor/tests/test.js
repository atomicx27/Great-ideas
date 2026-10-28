const { describe, it } = require('node:test');
const assert = require('node:assert');
const { monitorTension, checkWeatherConditions } = require('../script.js');

describe('Automated Space Elevator Monitor Logic', () => {
    it('should return critical tension', () => {
        assert.strictEqual(monitorTension(105000), "Critical Tension");
    });

    it('should return normal tension', () => {
        assert.strictEqual(monitorTension(70000), "Normal Tension");
    });

    it('should return halt operations for high wind', () => {
        assert.strictEqual(checkWeatherConditions(160, 0.1), "Halt Operations");
    });

    it('should return normal operations for safe conditions', () => {
        assert.strictEqual(checkWeatherConditions(100, 0.1), "Operations Normal");
    });
});
