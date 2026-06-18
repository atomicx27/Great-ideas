// Abstracted logging for UI updates
function updateLog(elementId, message) {
    if (typeof document !== 'undefined') {
        const el = document.getElementById(elementId);
        if (el) el.textContent += message + '\n';
    }
}

async function orchestrateMediaEmpire(brandGoal, apiKey) {
    if (!apiKey) throw new Error("API Key is required");

    // Clear logs
    ['strategyLog', 'contentLog', 'engagementLog'].forEach(id => {
        if (typeof document !== 'undefined') {
            const el = document.getElementById(id);
            if(el) el.textContent = '';
        }
    });

    const runAgent = async (role, logId) => {
        updateLog(logId, `[INIT] Spawning ${role} Agent...`);
        updateLog(logId, `[THINKING] Analyzing brand goal...`);

        const systemPrompt = `You are a specialized ${role} Agent for a media empire. Analyze this high-level brand goal and provide a concise 2-sentence actionable plan strictly from a ${role} perspective.`;
        const userMessage = brandGoal;

        const response = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', systemPrompt, userMessage, { temperature: 0.7 });
        updateLog(logId, `[DONE] Plan generated.`);
        return response;
    };

    // Run sub-agents in parallel
    const [strategyRes, contentRes, engagementRes] = await Promise.all([
        runAgent('Strategy', 'strategyLog'),
        runAgent('Content', 'contentLog'),
        runAgent('Engagement', 'engagementLog')
    ]);

    // Master Orchestrator Synthesis
    if (typeof document !== 'undefined') {
        document.getElementById('synthesisOutput').textContent = "Master Orchestrator synthesizing campaign...";
    }

    const masterPrompt = `You are the Master Media Empire Orchestrator. Synthesize the following sub-agent plans into a cohesive, high-impact 1-paragraph campaign rollout.`;
    const masterUserMessage = `Strategy: ${strategyRes}\nContent: ${contentRes}\nEngagement: ${engagementRes}`;

    const synthesis = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', masterPrompt, masterUserMessage, { temperature: 0.8 });

    return synthesis;
}

if (typeof document !== 'undefined') {
    document.getElementById('runBtn').addEventListener('click', async () => {
        const apiKey = document.getElementById('apiKey').value.trim();
        const goalStr = document.getElementById('brandGoal').value.trim();
        const synthEl = document.getElementById('synthesisOutput');

        if (!apiKey) {
            synthEl.textContent = 'Please enter an API Key.';
            return;
        }

        try {
            const result = await orchestrateMediaEmpire(goalStr, apiKey);
            if (typeof DOMPurify !== 'undefined') {
                 synthEl.innerHTML = DOMPurify.sanitize(result.replace(/\n/g, '<br>'));
            } else {
                 synthEl.textContent = result;
            }
        } catch (e) {
            synthEl.textContent = `Error: ${e.message}`;
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateMediaEmpire };
}