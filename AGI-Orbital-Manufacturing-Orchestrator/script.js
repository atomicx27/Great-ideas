async function orchestrateManufacturing(projectSpec, logFn) {
    logFn(`<span class="orchestrator-node">[Orchestrator]</span> Initiating multi-agent workflow for project: ${projectSpec}`);

    // Step 1: Material Scientist Agent
    logFn(`<span class="orchestrator-node">[Orchestrator]</span> Tasking Agentic-Material-Scientist with alloy specification...`);
    const matPrompt = "You are a Material Scientist AI. Given the following project, specify the ideal base metal and dopants. Return only a 1-sentence specification.";
    let materialSpec = "";
    try {
        materialSpec = await fetchOpenAI('mock-key', 'gpt-4', matPrompt, projectSpec, { temperature: 0.2 });
        logFn(`<span class="agent-material">[Material Scientist]</span> ${materialSpec}`);
    } catch (e) {
        logFn(`<span class="agent-material">[Material Scientist]</span> Error: ${e.message}`);
        return;
    }

    // Step 2: Printer Control Agent
    logFn(`<span class="orchestrator-node">[Orchestrator]</span> Tasking Printer-Control-Agent with manufacturing protocol...`);
    const printPrompt = "You are an Automated Zero-G Printer Control AI. Given the material spec, define the extrusion temperature, speed, and design pattern. Return 1 short sentence.";
    let printSpec = "";
    try {
        printSpec = await fetchAnthropic('mock-key', 'claude-3', printPrompt, materialSpec, { max_tokens: 50 });
        logFn(`<span class="agent-printer">[Printer Control]</span> ${printSpec}`);
    } catch (e) {
        logFn(`<span class="agent-printer">[Printer Control]</span> Error: ${e.message}`);
        return;
    }

    // Synthesis
    logFn(`<span class="orchestrator-node">[Orchestrator]</span> Workflow complete. Final Manufacturing Plan: Material-[${materialSpec}], Process-[${printSpec}].`);
    return `Plan: ${materialSpec} | ${printSpec}`;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const orchBtn = document.getElementById('orchestrate-btn');
        const projectSpecInput = document.getElementById('project-spec');
        const resultsPanel = document.getElementById('results-panel');
        const logBox = document.getElementById('swarm-log');

        function appendLog(htmlMsg) {
            const el = document.createElement('div');
            el.innerHTML = DOMPurify.sanitize(htmlMsg); // Safe here as we generate the spans and use LLM text
            logBox.appendChild(el);
            logBox.scrollTop = logBox.scrollHeight;
        }

        orchBtn.addEventListener('click', async () => {
            const spec = projectSpecInput.value;
            orchBtn.disabled = true;
            resultsPanel.classList.remove('hidden');
            appendLog(`--- New Orchestration Request ---`);

            await orchestrateManufacturing(spec, appendLog);

            orchBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateManufacturing };
}
