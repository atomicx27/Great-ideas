const tools = {
    check_weather: () => "High winds detected at 500ft altitude.",
    check_radar: () => "Dynamic obstacle detected: Construction crane at coordinates 34.2, -118.3."
};

function formulateFlightPlan(weather, radar) {
    let plan = "Direct Route.";
    if (weather.includes('High winds')) {
        plan = "Lowering altitude to 200ft to avoid high winds. ";
    }
    if (radar.includes('crane')) {
        plan += "Rerouting 500m East to avoid construction crane.";
    }
    return plan;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const navBtn = document.getElementById('navigate-btn');
        const outputLog = document.getElementById('output-log');
        const destInput = document.getElementById('destination-input');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        navBtn.addEventListener('click', () => {
            const dest = destInput.value;
            outputLog.innerHTML = '';
            navBtn.disabled = true;

            appendLog(`Target Destination Received: "${dest}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: Need to verify flight path safety. Checking weather and radar.', 'log-thought');
            }, 1000);

            let weatherResult = '';
            setTimeout(() => {
                appendLog('Executing Tool: check_weather()', 'log-action');
                weatherResult = tools.check_weather();
                appendLog(`Observation: ${weatherResult}`, 'log-info');
            }, 2500);

            let radarResult = '';
            setTimeout(() => {
                appendLog('Executing Tool: check_radar()', 'log-action');
                radarResult = tools.check_radar();
                appendLog(`Observation: ${radarResult}`, 'log-info');
            }, 4000);

            setTimeout(() => {
                appendLog('Thinking: Synthesizing tool data into safe flight plan.', 'log-thought');
                const plan = formulateFlightPlan(weatherResult, radarResult);
                appendLog(`Final Flight Plan: ${plan}`, 'log-success');
                navBtn.disabled = false;
            }, 5500);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, formulateFlightPlan };
}