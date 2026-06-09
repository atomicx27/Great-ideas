// Abstracted logging for UI updates
function updateLog(elementId, message) {
    if (typeof document !== 'undefined') {
        const el = document.getElementById(elementId);
        if (el) el.textContent += message + '\n';
    }
}

async function orchestrateHolisticHealth(patientData, apiKey) {
    if (!apiKey) throw new Error("API Key is required");

    // Clear logs
    ['dietLog', 'fitnessLog', 'sleepLog'].forEach(id => {
        if (typeof document !== 'undefined') {
            const el = document.getElementById(id);
            if(el) el.textContent = '';
        }
    });

    const dataStr = JSON.stringify(patientData);

    const runAgent = async (role, logId) => {
        updateLog(logId, `[INIT] Spawning ${role} Agent...`);
        updateLog(logId, `[THINKING] Analyzing patient profile...`);

        const systemPrompt = `You are a specialized ${role} Agent. Analyze this patient data and provide a concise 2-sentence recommendation strictly from a ${role} perspective.`;
        const userMessage = dataStr;

        const response = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', systemPrompt, userMessage, { temperature: 0.6 });
        updateLog(logId, `[DONE] Recommendation generated.`);
        return response;
    };

    // Run sub-agents in parallel
    const [dietRes, fitnessRes, sleepRes] = await Promise.all([
        runAgent('Dietary', 'dietLog'),
        runAgent('Fitness', 'fitnessLog'),
        runAgent('Sleep', 'sleepLog')
    ]);

    // Master Orchestrator Synthesis
    if (typeof document !== 'undefined') {
        document.getElementById('synthesisOutput').textContent = "Master Orchestrator synthesizing reports...";
    }

    const masterPrompt = `You are the Master Health Orchestrator. Synthesize the following sub-agent reports into a cohesive, holistic 1-paragraph summary for the patient. Highlight any synergies.`;
    const masterUserMessage = `Diet: ${dietRes}\nFitness: ${fitnessRes}\nSleep: ${sleepRes}`;

    const synthesis = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', masterPrompt, masterUserMessage, { temperature: 0.8 });

    return synthesis;
}

if (typeof document !== 'undefined') {
    document.getElementById('runBtn').addEventListener('click', async () => {
        const apiKey = document.getElementById('apiKey').value.trim();
        const dataStr = document.getElementById('patientData').value.trim();
        const synthEl = document.getElementById('synthesisOutput');

        if (!apiKey) {
            synthEl.textContent = 'Please enter an API Key.';
            return;
        }

        let patientData;
        try {
            patientData = JSON.parse(dataStr);
        } catch (e) {
            synthEl.textContent = 'Invalid Patient Data JSON.';
            return;
        }

        try {
            const result = await orchestrateHolisticHealth(patientData, apiKey);
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
    module.exports = { orchestrateHolisticHealth };
}