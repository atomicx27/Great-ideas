const assert = require('node:assert');
const test = require('node:test');
const { processOnboarding } = require('../script.js');

test('Automated Customer Onboarding - Deterministic Logic', async (t) => {

    await t.test('Standard onboarding for small retail company', () => {
        const steps = processOnboarding(20, 'retail', 'basic');
        assert.strictEqual(steps.length, 3);
        assert.strictEqual(steps[1].type, 'compliance');
        assert.ok(steps[1].title.includes('Standard'));
        assert.strictEqual(steps[2].type, 'support');
        assert.ok(steps[2].title.includes('Standard'));
    });

    await t.test('Compliance routing for healthcare industry', () => {
        const steps = processOnboarding(50, 'healthcare', 'pro');
        assert.strictEqual(steps[1].type, 'compliance');
        assert.ok(steps[1].title.includes('High-Security'));
        assert.ok(steps[1].description.includes('HIPAA/SOC2'));
    });

    await t.test('Support routing for Enterprise tier', () => {
        const steps = processOnboarding(100, 'tech', 'enterprise');
        assert.strictEqual(steps[2].type, 'support');
        assert.ok(steps[2].title.includes('Dedicated Account Manager'));
    });

    await t.test('Support routing for large company regardless of tier', () => {
        const steps = processOnboarding(600, 'finance', 'basic');
        assert.strictEqual(steps[2].type, 'support');
        assert.ok(steps[2].title.includes('Dedicated Account Manager'));
        // Also verify finance compliance
        assert.ok(steps[1].title.includes('High-Security'));
    });
});