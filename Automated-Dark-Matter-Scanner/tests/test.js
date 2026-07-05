const { describe, it } = require('node:test');
const assert = require('node:assert');
const { scanDarkMatter } = require('../script.js');

describe('Automated Dark Matter Scanner', () => {
    it('should detect high concentration', () => {
        const result = scanDarkMatter(6.0, 5);
        assert.strictEqual(result.type, 'HIGH_CONCENTRATION');
    });

    it('should detect moderate concentration', () => {
        const result = scanDarkMatter(3.0, 15);
        assert.strictEqual(result.type, 'MODERATE_CONCENTRATION');
    });

    it('should detect low concentration', () => {
        const result = scanDarkMatter(1.0, 20);
        assert.strictEqual(result.type, 'LOW_CONCENTRATION');
    });
});
