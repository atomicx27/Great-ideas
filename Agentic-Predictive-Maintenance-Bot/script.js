// Simulated Agentic Logic
class MaintenanceAgent {
    constructor() {
        this.tools = {
            queryThermalHistory: () => "Thermal gradient increasing 2°C/hr over 4 hours.",
            queryMaintenanceLogs: () => "Last lubrication: 400 operating hours ago (Limit: 500 hrs).",
            runAcousticAnalysis: () => "High-frequency grinding detected in bearing housing."
        };
    }

    // Core agentic loop simulation
    async analyzeAnomaly(anomalyType) {
        let thoughtProcess = [];
        thoughtProcess.push(`[Goal: Zero Downtime] Anomaly detected: ${anomalyType}`);
        thoughtProcess.push("Determining necessary context tools...");

        // Agent autonomously deciding which tools to run
        let thermalData = this.tools.queryThermalHistory();
        thoughtProcess.push(`Tool Action: queryThermalHistory() -> ${thermalData}`);

        let logData = this.tools.queryMaintenanceLogs();
        thoughtProcess.push(`Tool Action: queryMaintenanceLogs() -> ${logData}`);

        let acousticData = this.tools.runAcousticAnalysis();
        thoughtProcess.push(`Tool Action: runAcousticAnalysis() -> ${acousticData}`);

        thoughtProcess.push("Synthesizing multi-modal context...");

        const decision = {
            action: "Schedule IMMEDIATE bearing replacement and lubrication on Line 4.",
            confidence: "98%",
            reason: "Acoustic grinding and rising thermal gradient indicate imminent bearing failure within 12 hours, despite being within the 500hr lubrication limit."
        };

        return { thoughtProcess, decision };
    }
}

// Browser UI Logic
if (typeof document !== 'undefined') {
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const triggerBtn = document.getElementById('trigger-anomaly-btn');
        const logWindow = document.getElementById('agent-log');
        const decisionWindow = document.getElementById('agent-decision');

        triggerBtn.addEventListener('click', async () => {
            triggerBtn.disabled = true;
            logWindow.innerHTML = '';
            decisionWindow.innerHTML = '<p>Processing...</p>';

            const agent = new MaintenanceAgent();

            // Simulate agent thought process over time
            const anomalyData = "Lathe Motor 4 - Vibration Spike (Amplitude 4.5mm/s)";
            const { thoughtProcess, decision } = await agent.analyzeAnomaly(anomalyData);

            for (let step of thoughtProcess) {
                const p = document.createElement('p');
                p.textContent = `> ${step}`;
                logWindow.appendChild(p);
                logWindow.scrollTop = logWindow.scrollHeight;
                // Artificial delay for visualization
                await new Promise(r => setTimeout(r, 600));
            }

            decisionWindow.innerHTML = `
                <p class="decision-action">Action Executed: ${decision.action}</p>
                <p><strong>Confidence:</strong> ${decision.confidence}</p>
                <p><strong>Reasoning:</strong> ${decision.reason}</p>
            `;

            showToast("Agent autonomous action executed.");
            triggerBtn.disabled = false;
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MaintenanceAgent };
}
