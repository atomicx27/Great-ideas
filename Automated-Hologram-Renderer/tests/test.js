const assert = require('assert');
const { describe, it } = require('node:test');
const { renderPointCloud } = require('../script.js');

describe('Automated Hologram Renderer Logic', () => {
    const testPoints = [
        { x: 10, y: 20, z: 30 },
        { x: -5, y: 0, z: 5 }
    ];

    it('should project onto XY plane correctly', () => {
        const res = renderPointCloud(testPoints, 'xy');
        assert.deepStrictEqual(res, [
            { u: 10, v: 20 },
            { u: -5, v: 0 }
        ]);
    });

    it('should project onto XZ plane correctly', () => {
        const res = renderPointCloud(testPoints, 'xz');
        assert.deepStrictEqual(res, [
            { u: 10, v: 30 },
            { u: -5, v: 5 }
        ]);
    });

    it('should project onto YZ plane correctly', () => {
        const res = renderPointCloud(testPoints, 'yz');
        assert.deepStrictEqual(res, [
            { u: 20, v: 30 },
            { u: 0, v: 5 }
        ]);
    });

    it('should throw error for invalid point format', () => {
        assert.throws(() => renderPointCloud([{ x: 10, y: 20 }], 'xy'), /Invalid point format/);
    });

    it('should throw error for non-array input', () => {
        assert.throws(() => renderPointCloud("not array", 'xy'), /Input must be an array/);
    });
});