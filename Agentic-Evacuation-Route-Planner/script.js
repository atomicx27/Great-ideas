const tools = {
    check_bridge_status: (bridgeName) => {
        if (bridgeName === 'Main St Bridge') return "Closed due to structural damage.";
        return "Open and structurally sound.";
    },
    check_flood_levels: (route) => {
        if (route.includes('valley')) return "Impassable. 3ft of standing water.";
        return "Clear. No standing water.";
    }
};

function planEvacuationRoute(scenario) {
    const isFlooding = scenario.toLowerCase().includes('flood');

    if (isFlooding) {
        return "Safe Route: Take Highway 9 over the Ridge. Avoid Main St Bridge and the valley road.";
    }
    return "Standard evacuation routes are clear. Proceed via Main St.";
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
            const prompt = document.getElementById('prompt').value;
            outputLog.innerHTML = '';
            runBtn.disabled = true;

            appendLog(`Received Scenario: "${prompt}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: Possible flooding mentioned. I need to check the valley roads and bridges.', 'log-thought');
            }, 1000);

            setTimeout(() => {
                appendLog('Executing Tool: check_flood_levels("valley route")', 'log-action');
                const floodRes = tools.check_flood_levels('valley');
                appendLog(`Observation: Valley route is ${floodRes}`, 'log-info');
            }, 2500);

            setTimeout(() => {
                appendLog('Executing Tool: check_bridge_status("Main St Bridge")', 'log-action');
                const bridgeRes = tools.check_bridge_status('Main St Bridge');
                appendLog(`Observation: Main St Bridge is ${bridgeRes}`, 'log-info');
            }, 4000);

            setTimeout(() => {
                appendLog('Thinking: Primary route blocked. Rerouting to higher ground.', 'log-thought');
            }, 5500);

            setTimeout(() => {
                const plan = planEvacuationRoute(prompt);
                appendLog(`Final Route: ${plan}`, 'log-success');
                runBtn.disabled = false;
            }, 7000);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, planEvacuationRoute };
}