const test = require('node:test');
const assert = require('node:assert');
const { tools, formulateOptimizationPlan } = require('../script.js');

test('Agentic-Drug-Designer logic', (t) => {
    let result = formulateOptimizationPlan("Affinity Score: -8.5 kcal/mol (Strong Binding).", "Liver toxicity risk: Low.");
    assert.strictEqual(result, "Candidate Molecule X-1.");

    result = formulateOptimizationPlan("Affinity Score: -4.2 kcal/mol (Weak Binding).", "Liver toxicity risk: Low.");
    assert.strictEqual(result, "Modifying hydrogen bond donors to improve binding affinity. ");

    result = formulateOptimizationPlan("Affinity Score: -8.5 kcal/mol (Strong Binding).", "Liver toxicity risk: High due to aromatic ring structure.");
    assert.strictEqual(result, "Candidate Molecule X-1.Substituting aromatic ring with aliphatic chain to reduce liver toxicity risk.");

    result = formulateOptimizationPlan("Affinity Score: -4.2 kcal/mol (Weak Binding).", "Liver toxicity risk: High due to aromatic ring structure.");
    assert.strictEqual(result, "Modifying hydrogen bond donors to improve binding affinity. Substituting aromatic ring with aliphatic chain to reduce liver toxicity risk.");
});