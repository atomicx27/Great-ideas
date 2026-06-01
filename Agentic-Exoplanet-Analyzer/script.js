class ExoplanetAgent {
    constructor() {
        this.apiKey = 'mock-api-key';
    }

    async analyzeTransit(lightCurveData) {
        let thoughtProcess = [];
        thoughtProcess.push(`[Goal: Detect Habitability] Received light curve data: Transit Depth ${lightCurveData.depth}%, Duration ${lightCurveData.duration} hrs.`);
        thoughtProcess.push("Cross-referencing transit signatures with LLM astrophysics models...");

        let decision = { classification: "Unknown", confidence: "0%", reason: "Analysis pending." };

        try {
            const systemPrompt = "You are an astrophysics AI. Analyze the exoplanet transit data. Output ONLY JSON in this format: {\"classification\": \"string\", \"confidence\": \"string\", \"reason\": \"string\"}";
            const userMessage = `Data: Depth ${lightCurveData.depth}%, Duration ${lightCurveData.duration} hrs.`;

            if (typeof fetchOpenAI !== 'undefined') {
                 const llmResponse = await fetchOpenAI(this.apiKey, 'gpt-3.5-turbo', systemPrompt, userMessage);
                 thoughtProcess.push(`LLM Analysis received.`);
                 try {
                     decision = JSON.parse(llmResponse);
                 } catch (e) {
                     thoughtProcess.push(`Error parsing LLM response: ${e}`);
                 }
            } else {
                 thoughtProcess.push(`fetchOpenAI not available. Using mock logic.`);
                 if (lightCurveData.depth > 1.0 && lightCurveData.duration > 5) {
                     decision = { classification: "Gas Giant (Hot Jupiter)", confidence: "85%", reason: "Deep transit and short duration suggest a large planet close to the host star." };
                 } else {
                     decision = { classification: "Terrestrial (Possible Habitable Zone)", confidence: "75%", reason: "Shallow transit consistent with an Earth-sized planet." };
                 }
            }
        } catch (error) {
            thoughtProcess.push(`Tool execution failed: ${error}`);
        }

        return { thoughtProcess, decision };
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const analyzeBtn = document.getElementById('analyze-btn');
        const logWindow = document.getElementById('agent-log');
        const decisionWindow = document.getElementById('agent-decision');

        analyzeBtn.addEventListener('click', async () => {
            analyzeBtn.disabled = true;
            logWindow.innerHTML = '';
            decisionWindow.innerHTML = '<p>Processing light curves...</p>';

            const agent = new ExoplanetAgent();
            const mockData = { depth: 0.08, duration: 12 };

            const { thoughtProcess, decision } = await agent.analyzeTransit(mockData);

            for (let step of thoughtProcess) {
                const p = document.createElement('p');
                p.textContent = `> ${step}`;
                logWindow.appendChild(p);
                logWindow.scrollTop = logWindow.scrollHeight;
                await new Promise(r => setTimeout(r, 600));
            }

            decisionWindow.innerHTML = `
                <p><strong>Classification:</strong> ${decision.classification}</p>
                <p><strong>Confidence:</strong> ${decision.confidence}</p>
                <p><strong>Reasoning:</strong> ${decision.reason}</p>
            `;

            analyzeBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExoplanetAgent };
}
