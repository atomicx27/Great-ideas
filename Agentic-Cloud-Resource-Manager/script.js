const tools = {
    check_cpu_load: (region) => {
        if (region.includes('us-east-1')) return "CPU Load at 95% on Web Tier.";
        return "CPU Load normal (40%).";
    },
    scale_instances: (tier, count) => {
        return `Successfully deployed ${count} new instances to ${tier}.`;
    }
};

function resolveScalingEvent(event) {
    if (event.toLowerCase().includes('spike') && event.toLowerCase().includes('us-east-1')) {
        return "Action completed: Scaled up Web Tier by 5 instances to handle load.";
    }
    return "Action completed: Monitored event, no scaling necessary.";
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
            const eventStr = document.getElementById('event').value;
            outputLog.innerHTML = '';
            runBtn.disabled = true;

            appendLog(`Event Triggered: "${eventStr}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: I should check the current CPU load to confirm the severity of the spike.', 'log-thought');
            }, 1000);

            setTimeout(() => {
                appendLog(`Executing Tool: check_cpu_load("us-east-1")`, 'log-action');
                const loadRes = tools.check_cpu_load(eventStr);
                appendLog(`Observation: ${loadRes}`, 'log-info');
            }, 2500);

            setTimeout(() => {
                appendLog('Thinking: Load is critical. I need to scale up instances immediately to prevent downtime.', 'log-thought');
            }, 4000);

            setTimeout(() => {
                appendLog(`Executing Tool: scale_instances("Web Tier", 5)`, 'log-action');
                const resolution = resolveScalingEvent(eventStr);
                appendLog(`Observation: ${resolution}`, 'log-success');
                runBtn.disabled = false;
            }, 5500);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, resolveScalingEvent };
}
