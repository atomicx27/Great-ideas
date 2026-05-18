const tools = {
    check_market_price: (tons) => {
        return `Current market price is $12.50/ton for ${tons} volume.`;
    },
    execute_trade: (tons, price) => {
        return `Successfully purchased ${tons} tons at $${price}/ton.`;
    }
};

function resolveTradingEvent(goal) {
    if (goal.toLowerCase().includes('500') && goal.toLowerCase().includes('15')) {
        return "Trading completed: Offset 500 tons of CO2 within budget constraint.";
    }
    return "Trading completed: Goal achieved.";
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-btn');
        const outputLog = document.getElementById('output-log');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        runBtn.addEventListener('click', () => {
            const goalStr = document.getElementById('portfolio-goal').value;
            outputLog.innerHTML = '';
            runBtn.disabled = true;

            appendLog(`Portfolio Goal: "${goalStr}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: I need to check the current market prices to see if they meet the budget constraint.', 'log-thought');
            }, 1000);

            setTimeout(() => {
                appendLog(`Executing Tool: check_market_price("500")`, 'log-action');
                const priceRes = tools.check_market_price(500);
                appendLog(`Observation: ${priceRes}`, 'log-info');
            }, 2500);

            setTimeout(() => {
                appendLog('Thinking: Price is $12.50/ton, which is under the $15.00/ton constraint. I will execute the trade.', 'log-thought');
            }, 4000);

            setTimeout(() => {
                appendLog(`Executing Tool: execute_trade(500, 12.50)`, 'log-action');
                const tradeRes = tools.execute_trade(500, 12.50);
                appendLog(`Observation: ${tradeRes}`, 'log-info');
            }, 5500);

            setTimeout(() => {
                const finalRes = resolveTradingEvent(goalStr);
                appendLog(`Final Result: ${finalRes}`, 'log-info');
                runBtn.disabled = false;
            }, 7000);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, resolveTradingEvent };
}
