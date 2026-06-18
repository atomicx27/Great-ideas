/**
 * Main orchestrator function that spawns parallel sub-agents to manage a 3D workspace.
 */
async function manage3DWorkspace(intent, provider, fetchFn = null) {
    const fetchFunc = fetchFn || window.fetchLLMResponse;
    if (!fetchFunc) throw new Error("fetchLLMResponse is not defined");

    const basePrompt = `You are a specialized sub-agent for the Holographic Workspace Orchestrator.
The Multi-User Intent is: "${intent}"\n`;

    // 1. Define Sub-Agents
    const layoutPrompt = basePrompt + `As the Spatial Layout Manager, output the ideal 3D positioning of primary objects and user avatars to maximize visibility.`;
    const dataPrompt = basePrompt + `As the Data Visualizer, output the necessary charts, holograms, or toolbars to surface for this specific intent.`;
    const syncPrompt = basePrompt + `As the Real-time Collaboration Sync agent, output the required permission protocols and latency conflict-resolution strategies needed.`;

    // 2. Execute parallel requests
    const [layoutRes, dataRes, syncRes] = await Promise.all([
        fetchFunc(provider, layoutPrompt),
        fetchFunc(provider, dataPrompt),
        fetchFunc(provider, syncPrompt)
    ]);

    // 3. Master Synthesis
    const synthesisPrompt = `You are the Master AGI Orchestrator managing a Holographic Workspace.
Synthesize the following sub-agent reports into a single cohesive configuration for the 3D environment:
Intent: ${intent}
Layout Report: ${layoutRes}
Data Report: ${dataRes}
Sync Report: ${syncRes}

Provide a structured master environment configuration.`;

    const masterPlan = await fetchFunc(provider, synthesisPrompt);

    return {
        layout: layoutRes,
        data: dataRes,
        sync: syncRes,
        masterPlan: masterPlan
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const orchestrateBtn = document.getElementById('orchestrate-btn');
        const intentInput = document.getElementById('multi-user-intent');
        const providerSelect = document.getElementById('provider');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');

        const elLayout = document.getElementById('agent-layout');
        const elData = document.getElementById('agent-data');
        const elSync = document.getElementById('agent-sync');
        const elMaster = document.getElementById('master-synthesis');

        orchestrateBtn.addEventListener('click', async () => {
            if (!intentInput.value) return alert('Please enter an intent.');

            statusText.textContent = 'Status: Orchestrator Spawning Sub-Agents...';
            orchestrateBtn.disabled = true;
            resultsPanel.classList.remove('hidden');

            elLayout.textContent = 'Calculating room coordinates...';
            elData.textContent = 'Loading visual assets...';
            elSync.textContent = 'Establishing peer connections...';
            elMaster.textContent = 'Waiting for sub-agent synchronization...';

            try {
                const results = await manage3DWorkspace(intentInput.value, providerSelect.value);

                elLayout.textContent = results.layout;
                elData.textContent = results.data;
                elSync.textContent = results.sync;
                elMaster.textContent = results.masterPlan;

                statusText.textContent = 'Status: Environment Configured';
            } catch (error) {
                elMaster.textContent = `Error during orchestration: ${error.message}`;
                statusText.textContent = 'Status: Orchestration Failed';
            } finally {
                orchestrateBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { manage3DWorkspace };
}