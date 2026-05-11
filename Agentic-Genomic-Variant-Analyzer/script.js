// Simulated Tools
const simulatedTools = {
    queryClinVar: (variant) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (variant.includes('BRCA1')) resolve("ClinVar Record: Pathogenic. Associated with Hereditary Breast and Ovarian Cancer syndrome.");
                else if (variant.includes('MTHFR')) resolve("ClinVar Record: Benign/Likely Benign. Common population variant.");
                else resolve("ClinVar Record: Variant of Uncertain Significance (VUS).");
            }, 800);
        });
    },
    checkLiterature: (variant) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (variant.includes('BRCA1')) resolve("Literature: 154 citations found linking variant to loss of protein function.");
                else if (variant.includes('MTHFR')) resolve("Literature: Extensive studies show no significant disease correlation in isolation.");
                else resolve("Literature: 2 minor mentions in early-stage sequencing studies. No functional evidence.");
            }, 1000);
        });
    },
    assessPathogenicity: (clinvarData, litData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (clinvarData.includes('Pathogenic') && litData.includes('loss of protein function')) {
                    resolve("ACMG Classification: Class 5 (Pathogenic). Actionable finding.");
                } else if (clinvarData.includes('Benign')) {
                    resolve("ACMG Classification: Class 1 (Benign). No clinical action required.");
                } else {
                    resolve("ACMG Classification: Class 3 (VUS). Recommend ongoing monitoring and familial testing.");
                }
            }, 600);
        });
    }
};

// Agent Logic Function (exported for testing)
async function runAgentAnalysis(variant, tools = simulatedTools, onLog = () => {}) {
    onLog(`[Thought] Goal: Analyze variant ${variant}. I need to check clinical databases first.`, 'thought');

    onLog(`[Tool Call] Executing queryClinVar("${variant}")...`, 'tool-call');
    const clinVarResult = await tools.queryClinVar(variant);
    onLog(`[Tool Result] ${clinVarResult}`, 'tool-result');

    onLog(`[Thought] ClinVar data retrieved. Now I need to check recent medical literature for functional evidence.`, 'thought');

    onLog(`[Tool Call] Executing checkLiterature("${variant}")...`, 'tool-call');
    const litResult = await tools.checkLiterature(variant);
    onLog(`[Tool Result] ${litResult}`, 'tool-result');

    onLog(`[Thought] I have clinical and literature data. I will now synthesize this to assess final pathogenicity.`, 'thought');

    onLog(`[Tool Call] Executing assessPathogenicity(...)`, 'tool-call');
    const finalClassification = await tools.assessPathogenicity(clinVarResult, litResult);
    onLog(`[Tool Result] ${finalClassification}`, 'tool-result');

    onLog(`[Thought] Analysis complete. Generating final report.`, 'thought');

    return `
        <strong>Variant Analyzed:</strong> ${variant}<br><br>
        <strong>ClinVar Findings:</strong><br> ${clinVarResult}<br><br>
        <strong>Literature Review:</strong><br> ${litResult}<br><br>
        <strong>Final Assessment:</strong><br> <span style="color: #8e44ad; font-weight:bold;">${finalClassification}</span>
    `;
}

// UI Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const analyzeBtn = document.getElementById('analyze-btn');
        const variantInput = document.getElementById('variant-input');
        const agentLog = document.getElementById('agent-log');
        const finalReport = document.getElementById('final-report');

        function appendLog(message, type) {
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.textContent = message;
            agentLog.appendChild(entry);
            agentLog.scrollTop = agentLog.scrollHeight;
        }

        analyzeBtn.addEventListener('click', async () => {
            const variant = variantInput.value.trim();
            if (!variant) return;

            analyzeBtn.disabled = true;
            agentLog.innerHTML = '';
            finalReport.innerHTML = 'Analyzing...';

            try {
                const reportHTML = await runAgentAnalysis(variant, simulatedTools, appendLog);
                finalReport.innerHTML = reportHTML;
            } catch (error) {
                appendLog(`[Error] Analysis failed: ${error.message}`, 'tool-call');
                finalReport.innerHTML = 'Analysis failed. Check logs.';
            } finally {
                analyzeBtn.disabled = false;
            }
        });
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAgentAnalysis, simulatedTools };
}