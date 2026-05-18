// Simulated tools for the Agent
const tools = {
    queryMarketPrices: async () => {
        return new Promise(resolve => setTimeout(() => {
            resolve({
                reforestation: { pricePerTon: 15, qualityRating: 'A', availableTons: 500 },
                directAirCapture: { pricePerTon: 250, qualityRating: 'A+', availableTons: 50 },
                renewableEnergy: { pricePerTon: 8, qualityRating: 'B', availableTons: 1000 }
            });
        }, 1000));
    },
    executeTrade: async (projectType, tons, maxPrice) => {
        return new Promise((resolve, reject) => setTimeout(() => {
            const currentPrices = { reforestation: 15, directAirCapture: 250, renewableEnergy: 8 };
            const price = currentPrices[projectType];

            if (!price) return reject("Invalid project type");
            if (price > maxPrice) return reject("Price exceeds maximum threshold");

            resolve({
                status: "Success",
                project: projectType,
                tonsPurchased: tons,
                totalCost: tons * price
            });
        }, 1500));
    }
};

// Main agent logic
async function runTradingAgent(budget, targetOffset, logCallback) {
    try {
        logCallback(`Thinking: Goal is to offset ${targetOffset} tons of CO2 with a budget of $${budget}.`, 'log-thought');

        logCallback(`Executing Tool: queryMarketPrices()`, 'log-action');
        const marketData = await tools.queryMarketPrices();
        logCallback(`Observation: Market data retrieved. Options: Reforestation ($${marketData.reforestation.pricePerTon}/t), DAC ($${marketData.directAirCapture.pricePerTon}/t), Renewables ($${marketData.renewableEnergy.pricePerTon}/t).`, 'log-info');

        logCallback(`Thinking: Evaluating optimal portfolio to maximize quality while staying within budget.`, 'log-thought');

        // Simple logic simulation: Prefer Reforestation if affordable, fallback to Renewables
        let selectedProject = 'renewableEnergy';
        let estimatedCost = targetOffset * marketData.renewableEnergy.pricePerTon;

        if (targetOffset * marketData.reforestation.pricePerTon <= budget) {
            selectedProject = 'reforestation';
            estimatedCost = targetOffset * marketData.reforestation.pricePerTon;
        }

        if (estimatedCost > budget) {
             throw new Error(`Insufficient budget. Minimum cost is $${estimatedCost}, but budget is $${budget}.`);
        }

        logCallback(`Thinking: Proceeding with '${selectedProject}' project. Estimated cost: $${estimatedCost}.`, 'log-thought');
        logCallback(`Executing Tool: executeTrade(project: ${selectedProject}, tons: ${targetOffset})`, 'log-action');

        const tradeResult = await tools.executeTrade(selectedProject, targetOffset, marketData[selectedProject].pricePerTon);

        logCallback(`Observation: Trade executed successfully.`, 'log-success');
        return tradeResult;

    } catch (error) {
        logCallback(`Error: ${error.message || error}`, 'log-error');
        throw error;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('provider-select');
        const apiKeyGroup = document.getElementById('api-key-group');
        const modelGroup = document.getElementById('model-group');
        const runBtn = document.getElementById('run-agent-btn');
        const outputLog = document.getElementById('output-log');
        const finalResultsContainer = document.getElementById('final-results');
        const budgetInput = document.getElementById('budget');
        const targetInput = document.getElementById('offset-target');

        providerSelect.addEventListener('change', (e) => {
            if (e.target.value === 'ollama') {
                apiKeyGroup.style.display = 'none';
                modelGroup.style.display = 'block';
            } else {
                apiKeyGroup.style.display = 'block';
                modelGroup.style.display = 'none';
            }
        });

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        runBtn.addEventListener('click', async () => {
            const budget = parseFloat(budgetInput.value);
            const target = parseFloat(targetInput.value);

            outputLog.innerHTML = '';
            finalResultsContainer.innerHTML = '';
            finalResultsContainer.classList.add('hidden');
            runBtn.disabled = true;

            appendLog(`Starting Agentic Carbon Offset Trader...`, 'log-info');

            try {
                const result = await runTradingAgent(budget, target, appendLog);

                finalResultsContainer.innerHTML = `
                    <h3>Trading Execution Summary</h3>
                    <ul class="results-list">
                        <li><strong>Status:</strong> ${DOMPurify.sanitize(result.status)}</li>
                        <li><strong>Project Type:</strong> ${DOMPurify.sanitize(result.project)}</li>
                        <li><strong>Tons Purchased:</strong> ${DOMPurify.sanitize(result.tonsPurchased.toString())} Tons CO2</li>
                        <li><strong>Total Cost:</strong> $${DOMPurify.sanitize(result.totalCost.toString())}</li>
                        <li><strong>Budget Remaining:</strong> $${DOMPurify.sanitize((budget - result.totalCost).toString())}</li>
                    </ul>
                `;
                finalResultsContainer.classList.remove('hidden');

            } catch (error) {
                appendLog(`Agent execution halted due to errors.`, 'log-error');
            } finally {
                runBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTradingAgent, tools };
}