class ScoutDroneAgent {
    constructor() {
        this.tools = {
            scanThermalCamera: () => "Core temp: 800°C. Fire front moving North at 15 km/h.",
            checkWindData: () => "Wind: 25 km/h gusts from the South.",
            queryTopography: () => "Steep ravine 2km ahead of fire front. High risk of 'chimney effect'."
        };
    }

    async analyzeFireFront(zoneId) {
        let thoughtProcess = [];
        thoughtProcess.push(`[Goal: Assess Fire Front] Deployed to: ${zoneId}`);
        thoughtProcess.push("Activating multi-spectral sensor suite...");

        let thermal = this.tools.scanThermalCamera();
        thoughtProcess.push(`Tool Action: scanThermalCamera() -> ${thermal}`);

        let wind = this.tools.checkWindData();
        thoughtProcess.push(`Tool Action: checkWindData() -> ${wind}`);

        let topo = this.tools.queryTopography();
        thoughtProcess.push(`Tool Action: queryTopography() -> ${topo}`);

        thoughtProcess.push("Synthesizing environmental variables to predict spread...");

        const decision = {
            action: "Issue 'Red Flag' Evacuation Order for Sector 4.",
            confidence: "98%",
            reason: "The combination of a 15 km/h Northward fire front, 25 km/h Southern tailwinds, and an upcoming steep ravine creates a highly volatile 'chimney effect' scenario, threatening Sector 4 within 45 minutes."
        };

        return { thoughtProcess, decision };
    }
}

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
        const triggerBtn = document.getElementById('trigger-scout-btn');
        const logWindow = document.getElementById('agent-log');
        const decisionWindow = document.getElementById('agent-decision');

        triggerBtn.addEventListener('click', async () => {
            triggerBtn.disabled = true;
            logWindow.innerHTML = '';
            decisionWindow.innerHTML = '<p>Processing...</p>';

            const agent = new ScoutDroneAgent();
            const { thoughtProcess, decision } = await agent.analyzeFireFront("Grid Alpha-7");

            for (let step of thoughtProcess) {
                const p = document.createElement('p');
                p.textContent = `> ${step}`;
                logWindow.appendChild(p);
                logWindow.scrollTop = logWindow.scrollHeight;
                await new Promise(r => setTimeout(r, 600));
            }

            decisionWindow.innerHTML = `
                <p class="decision-action">Action Executed: ${decision.action}</p>
                <p><strong>Confidence:</strong> ${decision.confidence}</p>
                <p><strong>Reasoning:</strong> ${decision.reason}</p>
            `;

            showToast("Drone scout analysis complete.");
            triggerBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScoutDroneAgent };
}