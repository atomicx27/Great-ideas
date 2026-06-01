class VerticalFarmAgent {
    constructor() {
        this.apiKey = 'mock-api-key'; // Assuming mocking for tests or user provides it via UI
    }

    async analyzeGrowth(data) {
        let thoughtProcess = [];
        thoughtProcess.push(`[Goal: Optimize Growth] Received data: Temp ${data.temp}°C, Humidity ${data.humidity}%, Light ${data.light} lux.`);
        thoughtProcess.push("Consulting agricultural knowledge base via LLM...");

        let decision = { action: "Maintain current settings.", confidence: "90%", reason: "All parameters nominal." };

        try {
            const systemPrompt = "You are an AI agronomist for a vertical farm. Analyze the sensor data and provide an adjustment plan. Output ONLY JSON in this format: {\"action\": \"string\", \"confidence\": \"string\", \"reason\": \"string\"}";
            const userMessage = `Current data: Temp ${data.temp}°C, Humidity ${data.humidity}%, Light ${data.light} lux.`;

            // Assuming fetchOpenAI is globally available from shared/llm-api.js or mocked in tests
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
                 if (data.humidity > 80) {
                     decision = { action: "Increase ventilation by 20%.", confidence: "95%", reason: "Humidity exceeds safe threshold for current crop stage, risking fungal infection." };
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
            decisionWindow.innerHTML = '<p>Processing telemetry...</p>';

            const agent = new VerticalFarmAgent();
            const sensorData = { temp: 24, humidity: 85, light: 15000 };

            const { thoughtProcess, decision } = await agent.analyzeGrowth(sensorData);

            for (let step of thoughtProcess) {
                const p = document.createElement('p');
                p.textContent = `> ${step}`;
                logWindow.appendChild(p);
                logWindow.scrollTop = logWindow.scrollHeight;
                await new Promise(r => setTimeout(r, 500)); // visualization delay
            }

            decisionWindow.innerHTML = `
                <p><strong>Action:</strong> ${decision.action}</p>
                <p><strong>Confidence:</strong> ${decision.confidence}</p>
                <p><strong>Reasoning:</strong> ${decision.reason}</p>
            `;

            analyzeBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VerticalFarmAgent };
}
