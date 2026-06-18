async function orchestrateCognition(brainState, logFn) {
    logFn(`<span class="orchestrator-node">[Orchestrator]</span> Initiating cognitive swarm for macro state: ${brainState}`);

    // Step 1: Memory Indexer Agent
    logFn(`<span class="orchestrator-node">[Orchestrator]</span> Tasking Neural-Memory-Indexer...`);
    const indexerPrompt = "You are an AI Memory Indexer. Analyze the brain state and define which memory engrams need isolating. Keep it to 1 sentence.";
    let indexSpec = "";
    try {
        indexSpec = await fetchOpenAI('mock-key', 'gpt-4', indexerPrompt, brainState, { temperature: 0.1 });
        logFn(`<span class="agent-indexer">[Memory Indexer]</span> ${indexSpec}`);
    } catch (e) {
        logFn(`<span class="agent-indexer">[Memory Indexer]</span> Error: ${e.message}`);
        return;
    }

    // Step 2: Cognitive Optimizer Agent
    logFn(`<span class="orchestrator-node">[Orchestrator]</span> Tasking Cognitive-Optimizer...`);
    const optPrompt = "You are a Neuroplasticity AI. Based on the isolated engrams, suggest a specific stimulation protocol. 1 sentence.";
    let optSpec = "";
    try {
        optSpec = await fetchAnthropic('mock-key', 'claude-3', optPrompt, indexSpec, { max_tokens: 50 });
        logFn(`<span class="agent-optimizer">[Cognitive Optimizer]</span> ${optSpec}`);
    } catch (e) {
        logFn(`<span class="agent-optimizer">[Cognitive Optimizer]</span> Error: ${e.message}`);
        return;
    }

    // Synthesis
    logFn(`<span class="orchestrator-node">[Orchestrator]</span> Workflow complete. Final Cognitive Plan formulated.`);
    return `Plan: ${indexSpec} | ${optSpec}`;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const orchBtn = document.getElementById('orchestrate-btn');
        const stateInput = document.getElementById('brain-state');
        const resultsPanel = document.getElementById('results-panel');
        const logBox = document.getElementById('swarm-log');

        function appendLog(htmlMsg) {
            const el = document.createElement('div');
            el.innerHTML = DOMPurify.sanitize(htmlMsg); // Safe here
            logBox.appendChild(el);
            logBox.scrollTop = logBox.scrollHeight;
        }

        orchBtn.addEventListener('click', async () => {
            const state = stateInput.value;
            orchBtn.disabled = true;
            resultsPanel.classList.remove('hidden');
            appendLog(`--- New Orchestration Request ---`);

            await orchestrateCognition(state, appendLog);

            orchBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateCognition };
}
