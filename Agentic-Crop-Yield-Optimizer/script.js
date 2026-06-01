async function analyzeCropHealth(sensorData) {
    // Simulated external tool to retrieve historical context
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                currentData: sensorData,
                historicalTrend: "Nitrogen deficiency detected over last 72 hours",
                weatherForecast: "Humid, no rain"
            });
        }, 800);
    });
}

async function decideOptimalTreatment(apiKey, cropData, logCallback) {
    logCallback(`[Agent] Initiating health analysis...`);

    logCallback(`[Agent] Calling external tool: analyzeCropHealth()`);
    const context = await analyzeCropHealth(cropData);
    logCallback(`[Agent] Tool returned historical trend: ${context.historicalTrend}`);

    logCallback(`[Agent] Consulting LLM for optimized nutrient formulation...`);

    const systemPrompt = "You are an autonomous Agronomy Agent. Analyze the crop health data and output a concise treatment plan in Markdown, including specific nutrient adjustments (e.g., Nitrogen, Phosphorus) and lighting changes.";
    const userMessage = `Data Context:\n${JSON.stringify(context, null, 2)}`;

    try {
        let plan;
        if (typeof fetchOpenAI !== 'undefined') {
            plan = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', systemPrompt, userMessage);
        } else {
            // Fallback for isolated testing environments
            plan = "**Simulated Treatment Plan:**\n- Increase Nitrogen delivery by 15%\n- Raise pH slightly to 6.5\n- Maintain current LED spectrum";
        }
        logCallback(`[Agent] Formulation complete.`);
        return plan;
    } catch (error) {
        logCallback(`[Error] LLM API Call Failed: ${error.message}`);
        throw error;
    }
}

async function startOptimization() {
    const apiKey = document.getElementById('apiKey').value;
    const cropData = document.getElementById('cropData').value;
    const resultsArea = document.getElementById('resultsArea');
    const logDiv = document.getElementById('agentLog');
    const planDiv = document.getElementById('treatmentPlan');

    if (!apiKey || !cropData) {
        alert("Please provide both an API Key and Crop Data.");
        return;
    }

    resultsArea.classList.remove('hidden');
    logDiv.innerHTML = '';
    planDiv.innerHTML = '<p>Generating plan...</p>';

    const addLog = (text) => {
        const p = document.createElement('p');
        p.textContent = text;
        logDiv.appendChild(p);
        logDiv.scrollTop = logDiv.scrollHeight;
    };

    try {
        const markdown = await decideOptimalTreatment(apiKey, cropData, addLog);

        // Parse and sanitize markdown
        if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
            const rawHtml = marked.parse(markdown);
            planDiv.innerHTML = DOMPurify.sanitize(rawHtml);
        } else {
            planDiv.textContent = markdown;
        }
    } catch (error) {
        planDiv.innerHTML = `<p style="color: red;">Optimization failed: ${error.message}</p>`;
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('optimizeBtn').addEventListener('click', startOptimization);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeCropHealth, decideOptimalTreatment };
}
