const assert = require('assert');
const { describe, it } = require('node:test');
const { optimizeAerodynamicShape, queryWindTunnelSim } = require('../script.js');

describe('Agentic Shape Shifter Logic', () => {
    describe('queryWindTunnelSim', () => {
        it('should return drag warning for blunt-cylinder', () => {
            const res = queryWindTunnelSim('blunt-cylinder', 0.8);
            assert.match(res, /High drag coefficient/);
        });

        it('should return subsonic optimal for teardrop at low speed', () => {
            const res = queryWindTunnelSim('teardrop', 0.5);
            assert.match(res, /Subsonic optimal/);
        });
    });

    describe('optimizeAerodynamicShape', () => {
        it('should successfully parse a valid JSON LLM response', async () => {
            const mockFetch = async () => JSON.stringify({
                thought: "High drag, need airfoil",
                action: "Change to airfoil",
                observation: "Drag reduced",
                final_shape: "airfoil"
            });

            const result = await optimizeAerodynamicShape('blunt-cylinder', 2.0, 'mock', mockFetch);

            assert.strictEqual(result.thought, "High drag, need airfoil");
            assert.strictEqual(result.final_shape, "airfoil");
        });

        it('should handle malformed JSON gracefully', async () => {
            const mockFetch = async () => "Not a JSON string";
            const result = await optimizeAerodynamicShape('blunt-cylinder', 2.0, 'mock', mockFetch);

            assert.strictEqual(result.action, "Error");
            assert.strictEqual(result.final_shape, "blunt-cylinder");
        });
    });
});