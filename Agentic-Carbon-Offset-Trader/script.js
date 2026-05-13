// Simulated market data API
const marketAPI = {
    fetchPrices: async () => {
        return {
            Forestry: { price: 15, available: 10000, risk: 'Low' },
            DirectAirCapture: { price: 300, available: 500, risk: 'Very Low' },
            RenewableEnergy: { price: 5, available: 50000, risk: 'Medium' }
        };
    },
    executeTrade: async (type, amount) => {
        return { status: 'Success', id: `TRD-${Math.floor(Math.random()*10000)}`, type, amount };
    }
};

async function executeTradingAgent(goal, llmConfig, updateStateCallback) {
    const log = (msg, type = 'info') => {
        if (updateStateCallback) updateStateCallback(msg, type);
    };

    log(`[AGENT STARTED] Goal: ${goal}`);

    log(`[ACTION] Calling tool: fetchPrices()`, 'tool-call');
    const marketData = await marketAPI.fetchPrices();
    log(`[DATA] Current Prices: Forestry $${marketData.Forestry.price}/MT, DAC $${marketData.DirectAirCapture.price}/MT`);
    await new Promise(r => setTimeout(r, 800));

    log(`[THINKING] Optimizing portfolio allocation based on budget and MT targets...`);

    let allocationStr = `Calculated Allocation:
- 4950 MT of Forestry @ $15 = $74,250
- 50 MT of Direct Air Capture @ $300 = $15,000
Total MT: 5000 | Total Cost: $89,250 (Under $150k budget)`;

    if (typeof fetchLLMResponse !== 'undefined') {
        log(`[API CALL] Requesting LLM to solve allocation optimization...`);
        try {
            const prompt = `Given these prices: ${JSON.stringify(marketData)}. Determine an allocation strategy for this goal: "${goal}". Return a short summary of the MT and cost breakdown.`;
            const llmResponse = await fetchLLMResponse(prompt, llmConfig);
            if (llmResponse) {
                allocationStr = llmResponse;
            }
        } catch (e) {
            log(`[API ERROR] LLM failed, using fallback allocation logic.`);
        }
    }

    log(`[DECISION] Strategy formulation complete.`);
    await new Promise(r => setTimeout(r, 600));

    log(`[ACTION] Calling tool: executeTrade(Forestry, 4950)`, 'tool-call');
    const trade1 = await marketAPI.executeTrade('Forestry', 4950);

    log(`[ACTION] Calling tool: executeTrade(DirectAirCapture, 50)`, 'tool-call');
    const trade2 = await marketAPI.executeTrade('DirectAirCapture', 50);

    log(`[AGENT FINISHED] Goal accomplished.`);

    return `### Trading Execution Report
**Goal:** ${goal}

**Strategy:**
${allocationStr}

**Executed Trades:**
1. [${trade1.id}] Purchased ${trade1.amount} MT of ${trade1.type}
2. [${trade2.id}] Purchased ${trade2.amount} MT of ${trade2.type}

**Status:** Portfolio Balanced & Offset Target Met.`;
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-trading-btn');
        const statusText = document.getElementById('status-text');
        const logContainer = document.getElementById('agent-log');
        const resultContainer = document.getElementById('trade-result');
        const goalInput = document.getElementById('trade-goal');

        const providerSelect = document.getElementById('llm-provider');
        const apiKeyInput = document.getElementById('api-key');

        function updateLog(msg, type) {
            const div = document.createElement('div');
            div.className = `log-entry ${type}`;
            div.textContent = `> ${msg}`;
            logContainer.appendChild(div);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        startBtn.addEventListener('click', async () => {
            const goal = goalInput.value;
            const llmConfig = {
                provider: providerSelect.value,
                apiKey: apiKeyInput.value
            };

            logContainer.innerHTML = '';
            resultContainer.style.display = 'none';
            statusText.textContent = 'Running';
            startBtn.disabled = true;

            const report = await executeTradingAgent(goal, llmConfig, updateLog);

            statusText.textContent = 'Completed';
            startBtn.disabled = false;

            resultContainer.textContent = report;
            resultContainer.style.display = 'block';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { executeTradingAgent, marketAPI };
}