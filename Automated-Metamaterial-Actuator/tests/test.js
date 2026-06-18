const assert = require('assert');
const { describe, it } = require('node:test');
const { calculateActuationSequence } = require('../script.js');

describe('calculateActuationSequence', () => {
    it('should return correct sequence for auxetic expanded', () => {
        assert.strictEqual(calculateActuationSequence('auxetic', 'expanded'), 'Apply uniform outward tension');
    });

    it('should return correct sequence for auxetic contracted', () => {
        assert.strictEqual(calculateActuationSequence('auxetic', 'contracted'), 'Apply uniform inward compression');
    });

    it('should return invalid for auxetic twisted', () => {
        assert.strictEqual(calculateActuationSequence('auxetic', 'twisted'), 'Invalid target state for auxetic material');
    });

    it('should return correct sequence for chiral twisted', () => {
        assert.strictEqual(calculateActuationSequence('chiral', 'twisted'), 'Apply longitudinal force');
    });

    it('should return correct sequence for origami expanded', () => {
        assert.strictEqual(calculateActuationSequence('origami', 'expanded'), 'Unfold valley folds, then mountain folds');
    });

    it('should return unknown for invalid inputs', () => {
        assert.strictEqual(calculateActuationSequence('unknown', 'expanded'), 'Unknown material or state');
    });
});