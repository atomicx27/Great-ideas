const { describe, it } = require('node:test');
const assert = require('node:assert');
const { relaySubspaceSignal } = require('../script.js');

describe('Automated Subspace Relay', () => {
    it('should correctly route packets based on deterministic rules', () => {
        const input = [
            { id: '1', strength: 90, integrity: 95 },
            { id: '2', strength: 40, integrity: 60 },
            { id: '3', strength: 10, integrity: 10 }
        ];

        const result = relaySubspaceSignal(input);

        assert.strictEqual(result.relayedCount, 1);
        assert.strictEqual(result.processed[0].status, 'Optimal (Relayed)');
        assert.strictEqual(result.processed[1].status, 'Degraded (Buffered)');
        assert.strictEqual(result.processed[2].status, 'Lost (Dropped)');
    });
});
