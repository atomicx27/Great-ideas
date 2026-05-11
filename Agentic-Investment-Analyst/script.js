// Agent Tools logic
const tools = {
    get_stock_price: (ticker) => {
        if (ticker.toUpperCase() === 'AAPL') {
            return { price: 175.50, trend: '+1.2%' };
        }
        return { price: 100.00, trend: '0%' };
    },
    fetch_latest_news: (ticker) => {
        if (ticker.toUpperCase() === 'AAPL') {
            return ["AAPL announces new headset", "Tech stocks rally on earnings beat"];
        }
        return ["No major news"];
    }
};

function formatAgentOutput(ticker, priceData, newsData) {
    return `Analysis Complete for ${ticker.toUpperCase()}:\nPrice: $${priceData.price} (${priceData.trend})\nRecent News: ${newsData.join(', ')}\nRecommendation: HOLD. While news is positive, wait for market consolidation.`;
}

// Browser environment specific logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('provider-select');
        const apiKeyGroup = document.getElementById('api-key-group');
        const modelGroup = document.getElementById('model-group');
        const runBtn = document.getElementById('run-agent-btn');
        const outputLog = document.getElementById('output-log');

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

        runBtn.addEventListener('click', () => {
            const task = document.getElementById('task-prompt').value;
            outputLog.innerHTML = '';
            runBtn.disabled = true;

            appendLog(`Starting Analysis Task: "${task}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: I need to extract the ticker and fetch data...', 'log-thought');
            }, 500);

            setTimeout(() => {
                appendLog('Executing Tool: get_stock_price("AAPL")', 'log-action');
                const priceData = tools.get_stock_price('AAPL');
                appendLog(`Observation: Price is $${priceData.price}`, 'log-info');
            }, 1500);

            setTimeout(() => {
                appendLog('Executing Tool: fetch_latest_news("AAPL")', 'log-action');
                const newsData = tools.fetch_latest_news('AAPL');
                appendLog(`Observation: Found ${newsData.length} articles`, 'log-info');
            }, 2500);

            setTimeout(() => {
                appendLog('Thinking: Synthesizing price and sentiment data...', 'log-thought');
                const result = formatAgentOutput('AAPL', tools.get_stock_price('AAPL'), tools.fetch_latest_news('AAPL'));
                appendLog(result, 'log-success');
                runBtn.disabled = false;
            }, 3500);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, formatAgentOutput };
}