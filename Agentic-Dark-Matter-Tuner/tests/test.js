const { describe, it } = require('node:test');
const assert = require('node:assert');
const { tuneDarkMatterContainment } = require('../script.js');

describe('Agentic Dark Matter Tuner', () => {
    it('should successfully optimize fields given a valid JSON response from LLM', async () => {
        const input = [
            { id: 'Alpha', currentStability: 45, harmonics: 1.2 }
        ];

        const mockFetch = async () => JSON.stringify([{ id: 'Alpha', currentStability: 80, harmonics: 2.0 }]);

        const result = await tuneDarkMatterContainment(input, mockFetch, 'test-key');

        assert.strictEqual(result.success, true);
        assert.strictEqual(result.optimizedFields[0].harmonics, 2.0);
        assert.strictEqual(result.optimizedFields[0].currentStability, 80);
    });

    it('should handle JSON parse errors from LLM gracefully', async () => {
        const input = [ { id: 'Alpha', currentStability: 45, harmonics: 1.2 } ];
        const mockFetch = async () => "Invalid JSON";

        const result = await tuneDarkMatterContainment(input, mockFetch, 'test-key');

        assert.strictEqual(result.success, false);
        assert.ok(result.error);
    });
});
