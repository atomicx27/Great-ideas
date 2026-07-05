const { describe, it } = require('node:test');
const assert = require('node:assert');
const { mapWormholeTopology } = require('../script.js');

describe('Automated Wormhole Mapper', () => {
    it('should map stable wormhole', () => {
        const result = mapWormholeTopology(-6.0);
        assert.strictEqual(result.isWormhole, true);
        assert.strictEqual(result.stability, 'STABLE');
    });

    it('should map unstable wormhole', () => {
        const result = mapWormholeTopology(-2.0);
        assert.strictEqual(result.isWormhole, true);
        assert.strictEqual(result.stability, 'UNSTABLE');
    });

    it('should detect normal space', () => {
        const result = mapWormholeTopology(1.0);
        assert.strictEqual(result.isWormhole, false);
        assert.strictEqual(result.stability, 'NONE');
    });
});
