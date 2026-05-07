const tools = {
    deployDroneCamera: (sector) => {
        if (sector.includes('7')) return "Thermal signatures detected: 2 humans, 1 large animal.";
        return "No anomalous thermal signatures detected.";
    },
    queryGPSCollars: (sector) => {
        return `Rhino collar ID-402 shows sudden movement burst in ${sector}.`;
    }
};

function formulateActionPlan(droneData, gpsData) {
    if (droneData.includes('humans') && gpsData.includes('sudden movement')) {
        return "CRITICAL ALERT: High probability of poaching activity. Dispatching armed ranger team to Sector 7 immediately.";
    }
    return "Status Normal. Logging anomaly as likely environmental noise. Continuing standard patrol.";
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const investBtn = document.getElementById('investigate-btn');
        const outputLog = document.getElementById('output-log');
        const anomalyInput = document.getElementById('anomaly-input');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        investBtn.addEventListener('click', () => {
            const anomaly = anomalyInput.value;
            outputLog.innerHTML = '';
            investBtn.disabled = true;

            appendLog(`System Alert Received: "${anomaly}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: Possible poaching event. I need visual confirmation and wildlife distress status.', 'log-thought');
            }, 1000);

            let droneResult = '';
            setTimeout(() => {
                appendLog('Executing Tool: deployDroneCamera("Sector 7")', 'log-action');
                droneResult = tools.deployDroneCamera("Sector 7");
                appendLog(`Observation: ${droneResult}`, 'log-info');
            }, 2500);

            let gpsResult = '';
            setTimeout(() => {
                appendLog('Executing Tool: queryGPSCollars("Sector 7")', 'log-action');
                gpsResult = tools.queryGPSCollars("Sector 7");
                appendLog(`Observation: ${gpsResult}`, 'log-info');
            }, 4000);

            setTimeout(() => {
                appendLog('Thinking: Synthesizing multi-source intelligence to determine response.', 'log-thought');
                const plan = formulateActionPlan(droneResult, gpsResult);
                appendLog(`Final Action: ${plan}`, 'log-success');
                investBtn.disabled = false;
            }, 5500);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, formulateActionPlan };
}
