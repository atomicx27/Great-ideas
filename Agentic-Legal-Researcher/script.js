// Simulated Tools
const tools = {
    queryCaseLaw: (query) => {
        const keywords = query.toLowerCase();
        if (keywords.includes('autonomous') || keywords.includes('robot')) {
            return `Found 3 relevant cases:
            1. Smith v. RoboDeliveries (2021) - Strict liability applied.
            2. State v. AutoDriveTech (2022) - Negligence standard applied.
            3. Doe v. DroneCorp (2023) - Operator held liable.`;
        }
        return `Found standard negligence precedents: Palsgraf v. Long Island Railroad Co.`;
    },
    summarizePrecedent: (caseName) => {
        if (caseName.includes('RoboDeliveries')) {
            return `In Smith v. RoboDeliveries, the court held that companies deploying fully autonomous robots on public sidewalks are strictly liable for damages, classifying it as an abnormally dangerous activity.`;
        }
        return `Precedent indicates standard duty of care applies.`;
    }
};

// Agent State
let agentState = {
    logs: [],
    addLog: (type, message) => {
        agentState.logs.push({ type, message });
        if (typeof document !== 'undefined') updateUI();
    }
};

function updateUI() {
    const logEl = document.getElementById('agent-log');
    if (!logEl) return;
    logEl.innerHTML = agentState.logs.map(l => `<div class="log-entry ${l.type}">[${l.type.toUpperCase()}] ${l.message}</div>`).join('');
    logEl.scrollTop = logEl.scrollHeight;
}

// Agent Execution Loop
async function runAgent(query, provider, apiKey) {
    agentState.logs = [];
    agentState.addLog('system', `Agent Initialized. Goal: Draft Legal Brief for query: "${query}"`);

    const modelMap = {
        'openai': 'gpt-4o',
        'anthropic': 'claude-3-5-sonnet-20241022',
        'ollama': 'llama3.2'
    };
    const model = modelMap[provider];

    // Simulating ReAct (Reasoning and Acting) loop
    agentState.addLog('action', `Deciding next action...`);
    agentState.addLog('action', `Calling tool: queryCaseLaw("${query}")`);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));

    const caseLawData = tools.queryCaseLaw(query);
    agentState.addLog('result', `Tool output: ${caseLawData}`);

    agentState.addLog('action', `Deciding next action...`);
    agentState.addLog('action', `Calling tool: summarizePrecedent("Smith v. RoboDeliveries")`);

    await new Promise(r => setTimeout(r, 1000));

    const summaryData = tools.summarizePrecedent("Smith v. RoboDeliveries");
    agentState.addLog('result', `Tool output: ${summaryData}`);

    agentState.addLog('system', `Gathered enough context. Synthesizing final brief using LLM...`);

    const systemPrompt = `You are an expert legal researcher. Synthesize the provided case law into a concise, professional legal brief.`;
    const userPrompt = `Query: ${query}\nContext Data: ${caseLawData}\nPrecedent Summary: ${summaryData}\nDraft a brief (3 paragraphs) summarizing liability.`;

    let finalBrief = '';

    // In test environments, mock the fetch
    if (typeof fetch !== 'function' || !apiKey) {
        agentState.addLog('system', 'No API key provided or running in test mode. Generating simulated LLM response.');
        await new Promise(r => setTimeout(r, 800));
        finalBrief = `<h3>Executive Legal Brief</h3><p>Based on the query regarding autonomous robot liability, our research indicates a split in precedent. In <strong>Smith v. RoboDeliveries (2021)</strong>, the court established that operating autonomous robots in public spaces constitutes an abnormally dangerous activity, thus applying strict liability.</p><p>However, other recent rulings have applied standard negligence. Given the synthesized data: ${summaryData}</p><p><strong>Recommendation:</strong> Advise the client to assume strict liability applies in jurisdictions lacking specific autonomous vehicle statutes, and procure insurance accordingly.</p>`;
    } else {
        try {
            if (provider === 'openai') {
                finalBrief = await fetchOpenAI(apiKey, model, systemPrompt, userPrompt);
            } else if (provider === 'anthropic') {
                finalBrief = await fetchAnthropic(apiKey, model, systemPrompt, userPrompt);
            } else if (provider === 'ollama') {
                finalBrief = await fetchOllama(apiKey, model, systemPrompt, userPrompt);
            }
            // Simple markdown formatting for HTML
            finalBrief = finalBrief.replace(/\n\n/g, '</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            finalBrief = `<p>${finalBrief}</p>`;
        } catch (error) {
            agentState.addLog('system', `LLM Error: ${error.message}`);
            finalBrief = `<p style="color:red">Error generating brief: ${error.message}</p>`;
        }
    }

    agentState.addLog('system', `Task Complete.`);

    if (typeof document !== 'undefined') {
        document.getElementById('brief-content').innerHTML = finalBrief;
        document.getElementById('results-panel').classList.remove('hidden');
    }

    return finalBrief;
}

// UI Event Listeners
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-btn');
        runBtn.addEventListener('click', async () => {
            const query = document.getElementById('legal-query').value;
            const provider = document.getElementById('llm-provider').value;
            const apiKey = document.getElementById('api-key').value;

            if (!query) return alert("Please enter a legal query.");

            runBtn.disabled = true;
            document.getElementById('results-panel').classList.add('hidden');

            await runAgent(query, provider, apiKey);

            runBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { runAgent, tools };
}