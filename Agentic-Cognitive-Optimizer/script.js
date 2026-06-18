async function generateProtocol(loadProfile, logFn) {
    logFn(`[Agent] Assessing cognitive load profile: ${loadProfile}`);

    const systemPrompt = "You are a Neuroplasticity Optimization AI. Provide a specific, actionable protocol (e.g., frequencies, stimulation patterns) to resolve the user's cognitive state.";
    const userMessage = `Generate a protocol for: ${loadProfile}`;

    logFn("[Agent] Generating neuroplasticity protocol via LLM...");

    let result = "";
    try {
        result = await fetchAnthropic('mock-api-key', 'claude-3', systemPrompt, userMessage, { max_tokens: 150 });
        logFn(`[Protocol] ${result}`);
    } catch (e) {
        logFn(`[Error] Failed to generate protocol: ${e.message}`);
        result = "Error in generation.";
    }

    logFn("[Agent] Protocol generation complete.");
    return result;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const optBtn = document.getElementById('optimize-btn');
        const loadSelect = document.getElementById('cognitive-load');
        const resultsPanel = document.getElementById('results-panel');
        const logBox = document.getElementById('agent-log');

        function appendLog(msg) {
            const el = document.createElement('div');
            el.textContent = `> ${msg}`;
            logBox.appendChild(el);
            logBox.scrollTop = logBox.scrollHeight;
        }

        optBtn.addEventListener('click', async () => {
            const loadProfile = loadSelect.value;
            optBtn.disabled = true;
            resultsPanel.classList.remove('hidden');
            appendLog(`--- New Request: ${loadProfile} ---`);

            await generateProtocol(loadProfile, appendLog);

            optBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateProtocol };
}
