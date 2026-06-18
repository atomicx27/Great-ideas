const assert = require('assert');
const { describe, it } = require('node:test');
const { adaptToUserGaze } = require('../script.js');

describe('Agentic Holographic Assistant Logic', () => {
    it('should successfully parse a valid JSON LLM response', async () => {
        const mockFetch = async () => JSON.stringify({
            thought: "User looking at engine, needs parts list.",
            context_menu: "['View Specs', 'Explode View', 'Order Parts']",
            hologram_adjustment: "explode view"
        });

        const result = await adaptToUserGaze('engine-schematic', 'mock', mockFetch);

        assert.strictEqual(result.thought, "User looking at engine, needs parts list.");
        assert.strictEqual(result.hologram_adjustment, "explode view");
        assert.strictEqual(result.context_menu, "['View Specs', 'Explode View', 'Order Parts']");
    });

    it('should handle malformed JSON gracefully', async () => {
        const mockFetch = async () => "Not a JSON string";
        const result = await adaptToUserGaze('medical-scan', 'mock', mockFetch);

        assert.strictEqual(result.context_menu, "Error loading context");
        assert.strictEqual(result.hologram_adjustment, "Maintain current state");
    });
});