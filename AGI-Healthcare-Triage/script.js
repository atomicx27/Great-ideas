async function runSubAgent(apiKey, agentRole, systemPrompt, text) {
    try {
        const response = await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, text, { temperature: 0.2 });
        return response;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

async function orchestrateTriage(apiKey, text, updateCallback) {
    if (!text) return 'Error: Empty input';

    updateCallback('triage', 'Evaluating clinical urgency...', true);
    updateCallback('specialist', 'Consulting specialist knowledge base...', true);
    updateCallback('resource', 'Analyzing hospital capacity constraints...', true);

    const triagePrompt = "You are the Primary Triage Agent. Determine the clinical urgency (Level 1-5) and immediate stabilizing interventions needed based on the case details. Keep it brief.";
    const specialistPrompt = "You are the Specialist Consult Agent. Identify what specific specialist interventions (e.g., surgery, neurology) are required and the time-sensitivity. Keep it brief.";
    const resourcePrompt = "You are the Resource Allocation Agent. Based on the case constraints (e.g., bed capacity, staff availability), determine how to route this patient (admit, transfer to another facility, discharge). Keep it brief.";

    const [triageResp, specialistResp, resourceResp] = await Promise.all([
        runSubAgent(apiKey, 'triage', triagePrompt, text),
        runSubAgent(apiKey, 'specialist', specialistPrompt, text),
        runSubAgent(apiKey, 'resource', resourcePrompt, text)
    ]);

    updateCallback('triage', triageResp, false);
    updateCallback('specialist', specialistResp, false);
    updateCallback('resource', resourceResp, false);

    const masterPrompt = `You are the Master Hospital Orchestrator. Review the inputs from your sub-agents regarding this complex case:
"${text}"

Triage Input: ${triageResp}
Specialist Input: ${specialistResp}
Resource Input: ${resourceResp}

Synthesize these perspectives to create a unified emergency action plan. Balance clinical need with resource availability.
Format in Markdown:
- **Final Patient Disposition:** [Admit / Transfer / Treat & Release / etc.]
- **Resource Adjustments:** [What resources need to be moved or freed up]
- **Immediate Next Steps:** [Actionable steps for hospital staff]`;

    try {
        const finalPlan = await fetchOpenAI(apiKey, 'gpt-4o', masterPrompt, 'Provide emergency action plan.', { temperature: 0.2 });
        return finalPlan;
    } catch (error) {
        return `Error in Orchestrator: ${error.message}`;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const processBtn = document.getElementById('process-btn');
        const apiKeyInput = document.getElementById('api-key');
        const contextInput = document.getElementById('context-input');
        const agentsSection = document.getElementById('agents-section');
        const finalSection = document.getElementById('final-decision-section');
        const resultOutput = document.getElementById('result-output');

        const updateAgentBox = (agent, content, isRunning) => {
            const box = document.getElementById(`${agent}-agent`);
            const statusEl = box.querySelector('.status');
            const contentEl = box.querySelector('.content');

            contentEl.innerHTML = isRunning ? content : DOMPurify.sanitize(marked.parse(content));
            statusEl.textContent = isRunning ? 'Running...' : 'Complete';
            statusEl.className = `status ${isRunning ? 'running' : 'done'}`;
        };

        processBtn.addEventListener('click', async () => {
            const apiKey = apiKeyInput.value.trim();
            const text = contextInput.value.trim();

            if (!apiKey || !text) {
                alert('Please enter both an API key and case context.');
                return;
            }

            processBtn.textContent = 'Orchestrating...';
            processBtn.disabled = true;
            agentsSection.classList.remove('hidden');
            finalSection.classList.add('hidden');

            const finalPlan = await orchestrateTriage(apiKey, text, updateAgentBox);

            finalSection.classList.remove('hidden');
            resultOutput.innerHTML = DOMPurify.sanitize(marked.parse(finalPlan));

            processBtn.textContent = 'Initiate Swarm Orchestration';
            processBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { orchestrateTriage };
}
