const test = require('node:test');
const assert = require('node:assert');
const { runAgentAnalysis, simulatedTools } = require('../script.js');

test('Agentic Genomic Variant Analyzer Logic', async (t) => {

    await t.test('Agent correctly classifies Pathogenic variant (BRCA1)', async () => {
        let logs = [];
        const logger = (msg, type) => logs.push({msg, type});

        const report = await runAgentAnalysis('BRCA1 c.68_69delAG', simulatedTools, logger);

        assert.ok(report.includes('Pathogenic'), 'Report should indicate pathogenic');
        assert.ok(report.includes('Class 5'), 'Report should include ACMG Class 5');

        // Verify tool call flow
        assert.ok(logs.some(l => l.msg.includes('queryClinVar')), 'Agent should call ClinVar tool');
        assert.ok(logs.some(l => l.msg.includes('checkLiterature')), 'Agent should call Literature tool');
        assert.ok(logs.some(l => l.msg.includes('assessPathogenicity')), 'Agent should call Assessment tool');
    });

    await t.test('Agent correctly classifies Benign variant (MTHFR)', async () => {
        const report = await runAgentAnalysis('MTHFR C677T', simulatedTools, () => {});
        assert.ok(report.includes('Benign'), 'Report should indicate benign');
        assert.ok(report.includes('Class 1'), 'Report should include ACMG Class 1');
    });

    await t.test('Agent correctly classifies VUS (Unknown Variant)', async () => {
        const report = await runAgentAnalysis('UNKNOWN_GENE_MUTATION', simulatedTools, () => {});
        assert.ok(report.includes('Variant of Uncertain Significance'), 'Report should indicate VUS');
        assert.ok(report.includes('Class 3'), 'Report should include ACMG Class 3');
    });
});