async function runSubAgent(apiKey, agentRole, systemPrompt, text) {
    try {
        const response = await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, text, { temperature: 0.3 });
        return response;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

async function orchestrateModeration(apiKey, text, updateCallback) {
    if (!text) return 'Error: Empty input';

    updateCallback('legal', 'Analyzing legal liabilities...', true);
    updateCallback('cultural', 'Evaluating cultural nuances...', true);
    updateCallback('safety', 'Checking psychological safety...', true);

    const legalPrompt = "You are the Legal Agent. Analyze the content for potential legal risks (defamation, illegal acts). Keep it brief.";
    const culturalPrompt = "You are the Cultural Context Agent. Analyze the content for cultural sensitivities, satire, or nuanced expressions. Keep it brief.";
    const safetyPrompt = "You are the Psychological Safety Agent. Analyze the content for hate speech, bullying, or self-harm. Keep it brief.";

    const [legalResp, culturalResp, safetyResp] = await Promise.all([
        runSubAgent(apiKey, 'legal', legalPrompt, text),
        runSubAgent(apiKey, 'cultural', culturalPrompt, text),
        runSubAgent(apiKey, 'safety', safetyPrompt, text)
    ]);

    updateCallback('legal', legalResp, false);
    updateCallback('cultural', culturalResp, false);
    updateCallback('safety', safetyResp, false);

    const masterPrompt = `You are the Master Orchestrator. Review the inputs from your sub-agents regarding this content:
"${text}"

Legal Input: ${legalResp}
Cultural Input: ${culturalResp}
Safety Input: ${safetyResp}

Synthesize these perspectives and provide a final consensus decision.
Format in Markdown:
- **Final Verdict:** [Safe / Flagged / Shadowban]
- **Key Factors:** [Brief synthesis of the sub-agents' points]
- **Action Plan:** [What to do with the content]`;

    try {
        const finalConsensus = await fetchOpenAI(apiKey, 'gpt-4o', masterPrompt, 'Provide final verdict.', { temperature: 0.2 });
        return finalConsensus;
    } catch (error) {
        return `Error in Orchestrator: ${error.message}`;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const processBtn = document.getElementById('process-btn');
        const apiKeyInput = document.getElementById('api-key');
        const contentInput = document.getElementById('content-input');
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
            const text = contentInput.value.trim();

            if (!apiKey || !text) {
                alert('Please enter both an API key and content.');
                return;
            }

            processBtn.textContent = 'Orchestrating...';
            processBtn.disabled = true;
            agentsSection.classList.remove('hidden');
            finalSection.classList.add('hidden');

            const finalConsensus = await orchestrateModeration(apiKey, text, updateAgentBox);

            finalSection.classList.remove('hidden');
            resultOutput.innerHTML = DOMPurify.sanitize(marked.parse(finalConsensus));

            processBtn.textContent = 'Start Orchestration';
            processBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { orchestrateModeration };
}
