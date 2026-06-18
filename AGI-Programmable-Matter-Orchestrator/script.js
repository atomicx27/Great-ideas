/**
 * Main orchestrator function that spawns parallel sub-agents.
 */
async function coordinateSwarmFormation(highLevelGoal, provider, fetchFn = null) {
    const fetchFunc = fetchFn || window.fetchLLMResponse;
    if (!fetchFunc) throw new Error("fetchLLMResponse is not defined");

    const basePrompt = `You are a specialized sub-agent for the Programmable Matter Swarm Orchestrator.
The High-Level Goal is: "${highLevelGoal}"\n`;

    // 1. Define Sub-Agents
    const structurePrompt = basePrompt + `As the Structural Engineer, analyze the load-bearing requirements and output a short summary of the ideal macro-structure.`;
    const materialPrompt = basePrompt + `As the Material Properties Analyzer, output the ideal microscopic material state (e.g., auxetic, stiff, elastic) required to support this structure.`;
    const aeroPrompt = basePrompt + `As the Aerodynamics Expert, output the necessary surface shape adjustments to handle atmospheric or fluid friction for this goal.`;

    // 2. Execute parallel requests
    const [structureRes, materialRes, aeroRes] = await Promise.all([
        fetchFunc(provider, structurePrompt),
        fetchFunc(provider, materialPrompt),
        fetchFunc(provider, aeroPrompt)
    ]);

    // 3. Master Synthesis
    const synthesisPrompt = `You are the Master AGI Orchestrator. Synthesize the following sub-agent reports into a single, cohesive executable plan for the programmable matter swarm:
Goal: ${highLevelGoal}
Structural Report: ${structureRes}
Material Report: ${materialRes}
Aero Report: ${aeroRes}

Provide a structured, step-by-step master plan.`;

    const masterPlan = await fetchFunc(provider, synthesisPrompt);

    return {
        structure: structureRes,
        material: materialRes,
        aero: aeroRes,
        masterPlan: masterPlan
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const orchestrateBtn = document.getElementById('orchestrate-btn');
        const goalInput = document.getElementById('high-level-goal');
        const providerSelect = document.getElementById('provider');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');

        const elStructure = document.getElementById('agent-structure');
        const elMaterial = document.getElementById('agent-material');
        const elAero = document.getElementById('agent-aero');
        const elMaster = document.getElementById('master-synthesis');

        orchestrateBtn.addEventListener('click', async () => {
            if (!goalInput.value) return alert('Please enter a goal.');

            statusText.textContent = 'Status: Orchestrator Spawning Sub-Agents...';
            orchestrateBtn.disabled = true;
            resultsPanel.classList.remove('hidden');

            elStructure.textContent = 'Analyzing loads...';
            elMaterial.textContent = 'Calculating tensors...';
            elAero.textContent = 'Simulating fluid dynamics...';
            elMaster.textContent = 'Waiting for sub-agent synchronization...';

            try {
                const results = await coordinateSwarmFormation(goalInput.value, providerSelect.value);

                elStructure.textContent = results.structure;
                elMaterial.textContent = results.material;
                elAero.textContent = results.aero;
                elMaster.textContent = results.masterPlan;

                statusText.textContent = 'Status: Swarm Orchestration Complete';
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
    module.exports = { coordinateSwarmFormation };
}