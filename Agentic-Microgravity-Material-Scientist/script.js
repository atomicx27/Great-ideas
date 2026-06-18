async function synthesizeAlloy(baseMetal, logFn) {
    logFn(`[Agent] Initializing synthesis sequence for base metal: ${baseMetal}`);

    const systemPrompt = "You are an AI material scientist operating in a microgravity environment. Your goal is to formulate an optimal alloy mix for zero-G manufacturing.";
    const userMessage = `Formulate a high-strength alloy using ${baseMetal} as the base. Provide the dopants and the reasoning. Keep it brief.`;

    logFn("[Agent] Consulting LLM for alloy formulation...");

    let result = "";
    try {
        result = await fetchOpenAI('mock-api-key', 'gpt-4', systemPrompt, userMessage, { temperature: 0.5 });
        logFn(`[LLM Response] ${result}`);
    } catch (e) {
        logFn(`[Error] Failed to formulate alloy: ${e.message}`);
        result = "Error occurred during synthesis.";
    }

    logFn("[Agent] Synthesis sequence complete.");
    return result;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const synthBtn = document.getElementById('synthesize-btn');
        const baseMetalSelect = document.getElementById('base-metal');
        const resultsPanel = document.getElementById('results-panel');
        const logBox = document.getElementById('agent-log');

        function appendLog(msg) {
            const el = document.createElement('div');
            el.textContent = `> ${msg}`;
            logBox.appendChild(el);
            logBox.scrollTop = logBox.scrollHeight;
        }

        synthBtn.addEventListener('click', async () => {
            const baseMetal = baseMetalSelect.value;
            synthBtn.disabled = true;
            resultsPanel.classList.remove('hidden');
            appendLog(`--- New Synthesis: ${baseMetal} ---`);

            await synthesizeAlloy(baseMetal, appendLog);

            synthBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeAlloy };
}
