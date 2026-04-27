const tools = {
    check_grid_load: () => {
        return { status: "Critical", utilization: "98%" };
    },
    draw_from_battery: (megawatts) => {
        return `Successfully drew ${megawatts}MW from reserve batteries.`;
    },
    curtail_demand: (sector) => {
        return `Demand response activated for ${sector} sector.`;
    }
};

function generateActionPlan(prompt, isCritical) {
    if (prompt.toLowerCase().includes('heatwave') && isCritical) {
        return "Action Plan: Draw 500MW from batteries and curtail industrial demand. Grid stabilized.";
    }
    return "Action Plan: Continue normal monitoring.";
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
                appendLog('Thinking: Possible load spike detected. I need to check current grid status.', 'log-thought');
            }, 1000);

            setTimeout(() => {
                appendLog('Executing Tool: check_grid_load()', 'log-action');
                const load = tools.check_grid_load();
                appendLog(`Observation: Load Status is ${load.status} (${load.utilization} utilization)`, 'log-info');
            }, 2500);

            setTimeout(() => {
                appendLog('Thinking: Grid is at critical capacity. I need to take immediate balancing actions.', 'log-thought');
            }, 4000);

            setTimeout(() => {
                appendLog('Executing Tool: draw_from_battery(500)', 'log-action');
                const batteryRes = tools.draw_from_battery(500);
                appendLog(`Observation: ${batteryRes}`, 'log-info');
            }, 5500);

            setTimeout(() => {
                appendLog('Executing Tool: curtail_demand("industrial")', 'log-action');
                const curtailRes = tools.curtail_demand('industrial');
                appendLog(`Observation: ${curtailRes}`, 'log-info');
            }, 7000);

            setTimeout(() => {
                const plan = generateActionPlan(prompt, true);
                appendLog(`Final Assessment: ${plan}`, 'log-success');
                runBtn.disabled = false;
            }, 8500);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, generateActionPlan };
}