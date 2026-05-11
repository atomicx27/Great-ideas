const tools = {
    run_diagnostic: (component) => {
        if (component.includes('Solar Array B')) return "Voltage regulator fault detected.";
        if (component.includes('Comm Antenna')) return "Signal interference from solar flare.";
        return "All systems nominal.";
    },
    reboot_system: (component) => {
        return `Reboot sequence completed for ${component}. Nominal operation restored.`;
    }
};

function mitigateAnomaly(anomaly) {
    if (anomaly.toLowerCase().includes('solar array b')) {
        return "Action completed: Rebooted voltage regulator on Solar Array B.";
    }
    if (anomaly.toLowerCase().includes('comm')) {
        return "Action completed: Realigned comm antenna to avoid interference.";
    }
    return "No actionable anomalies found.";
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
            const anomaly = document.getElementById('anomaly').value;
            outputLog.innerHTML = '';
            runBtn.disabled = true;

            appendLog(`Received Alert: "${anomaly}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: I need to run a diagnostic on the affected component to isolate the issue.', 'log-thought');
            }, 1000);

            setTimeout(() => {
                appendLog(`Executing Tool: run_diagnostic("Affected Component")`, 'log-action');
                const diagRes = tools.run_diagnostic(anomaly);
                appendLog(`Observation: ${diagRes}`, 'log-info');
            }, 2500);

            setTimeout(() => {
                appendLog('Thinking: Fault isolated. I will attempt a system reboot to clear the error state.', 'log-thought');
            }, 4000);

            setTimeout(() => {
                appendLog(`Executing Tool: reboot_system("Affected Component")`, 'log-action');
                const mitigation = mitigateAnomaly(anomaly);
                appendLog(`Observation: ${mitigation}`, 'log-success');
                runBtn.disabled = false;
            }, 5500);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, mitigateAnomaly };
}
