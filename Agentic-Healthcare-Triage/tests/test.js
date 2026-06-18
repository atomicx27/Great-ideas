const assert = require('assert');

global.fetchOpenAI = async (apiKey, model, systemPrompt, text) => {
    if (text.includes('diabetes')) {
        return '**Triage Level:** Level 2\n**Clinical Reasoning:** High risk.';
    }
    return '**Triage Level:** Level 5\n**Clinical Reasoning:** Low risk.';
};

const { analyzePatientContext } = require('../script.js');

async function runTests() {
    // Test 1: High risk
    const result1 = await analyzePatientContext('key', 'Patient has chest pain and diabetes.');
    assert.ok(result1.includes('Level 2'));

    // Test 2: Low risk
    const result2 = await analyzePatientContext('key', 'Patient has a mild cough.');
    assert.ok(result2.includes('Level 5'));

    console.log('Agentic-Healthcare-Triage tests passed!');
}

runTests().catch(err => {
    console.error(err);
    process.exit(1);
});
