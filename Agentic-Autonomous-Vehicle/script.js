const tools = {
    read_lidar: () => "Distance to object: 5 meters",
    read_camera: () => "Object identified: Pedestrian on curb"
};

function determineAction(environmentPrompt) {
    if (environmentPrompt.toLowerCase().includes('pedestrian')) {
        return "Action: Apply Brakes. Yield to pedestrian.";
    }
    return "Action: Maintain Speed.";
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-agent-btn');
        const outputLog = document.getElementById('output-log');
        const envPrompt = document.getElementById('environment-prompt');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        runBtn.addEventListener('click', () => {
            const env = envPrompt.value;
            outputLog.innerHTML = '';
            runBtn.disabled = true;

            appendLog(`Environment perceived: "${env}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: Possible obstacle detected. I need to verify with sensors.', 'log-thought');
            }, 1000);

            setTimeout(() => {
                appendLog('Executing Tool: read_lidar()', 'log-action');
                appendLog(`Observation: ${tools.read_lidar()}`, 'log-info');
            }, 2000);

            setTimeout(() => {
                appendLog('Executing Tool: read_camera()', 'log-action');
                appendLog(`Observation: ${tools.read_camera()}`, 'log-info');
            }, 3000);

            setTimeout(() => {
                appendLog('Thinking: Pedestrian in proximity. Safety protocol requires yielding.', 'log-thought');
                const action = determineAction(env);
                appendLog(action, 'log-success');
                runBtn.disabled = false;
            }, 4000);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, determineAction };
}
