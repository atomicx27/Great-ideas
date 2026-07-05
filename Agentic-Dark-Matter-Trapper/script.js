async function trapDarkMatter(anomalyData) {
    if (!anomalyData || anomalyData.length === 0) return { status: 'FAILED', message: 'No anomaly data provided.' };

    // Simulate LLM analysis of the anomaly tensor
    const meanAnomaly = anomalyData.reduce((a, b) => a + b, 0) / anomalyData.length;

    if (meanAnomaly > 0.7) {
        return { status: 'DEPLOYED', fieldStrength: 'HIGH', message: 'High anomaly detected. Deploying high-strength confinement field.' };
    } else if (meanAnomaly > 0.3) {
        return { status: 'DEPLOYED', fieldStrength: 'MEDIUM', message: 'Moderate anomaly. Deploying standard magnetic bottle.' };
    }

    return { status: 'STANDBY', fieldStrength: 'NONE', message: 'Anomaly too weak for trapping. Returning to standby.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('trap-btn');
        const anomalyInput = document.getElementById('anomaly-data');
        const display = document.getElementById('agent-display');
        const logs = document.getElementById('logs');

        btn.addEventListener('click', async () => {
            const rawData = anomalyInput.value;
            let data = [];
            try {
                data = JSON.parse(rawData);
                if (!Array.isArray(data)) throw new Error('Not an array');
            } catch (e) {
                display.textContent = 'Error: Invalid tensor format. Use JSON array.';
                display.className = 'status-display alert-high';
                return;
            }

            display.textContent = 'Agent analyzing anomaly...';
            display.className = 'status-display alert-medium fade-in';

            setTimeout(async () => {
                const result = await trapDarkMatter(data);
                display.textContent = `Status: ${result.status} | Field: ${result.fieldStrength}`;

                if (result.status === 'DEPLOYED') {
                    display.className = 'status-display alert-low fade-in';
                } else {
                    display.className = 'status-display alert-medium fade-in';
                }

                const logEntry = document.createElement('div');
                logEntry.textContent = `> ${result.message}`;
                logs.appendChild(logEntry);
            }, 800);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { trapDarkMatter };
}
