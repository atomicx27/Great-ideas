class DroneNavigatorAgent {
    constructor() {
        this.tools = {
            checkWeather: () => "Severe microburst detected 2km ahead on current vector.",
            pingRadar: () => "Clear path at higher altitude. Heavy drone traffic below.",
            checkAirTraffic: () => "Dynamic no-fly zone activated for medevac chopper in Sector 7."
        };
    }

    async analyzeAndReroute(destinationId) {
        let thoughtProcess = [];
        thoughtProcess.push(`[Goal: Safe Delivery] En route to ${destinationId}. Anomaly detected.`);
        thoughtProcess.push("Determining necessary context tools...");

        let weatherData = this.tools.checkWeather();
        thoughtProcess.push(`Tool Action: checkWeather() -> ${weatherData}`);

        let radarData = this.tools.pingRadar();
        thoughtProcess.push(`Tool Action: pingRadar() -> ${radarData}`);

        let trafficData = this.tools.checkAirTraffic();
        thoughtProcess.push(`Tool Action: checkAirTraffic() -> ${trafficData}`);

        thoughtProcess.push("Synthesizing multi-source telemetry...");

        const decision = {
            action: "Increase altitude by 150m and reroute via Sector 8.",
            confidence: "98.5%",
            reason: "Current vector compromised by severe microburst. Sector 7 is restricted due to medevac. Radar confirms clear path at higher altitude via Sector 8, avoiding traffic and weather."
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
        const launchBtn = document.getElementById('launch-agent-btn');
        const logWindow = document.getElementById('agent-log');
        const decisionWindow = document.getElementById('agent-decision');

        launchBtn.addEventListener('click', async () => {
            launchBtn.disabled = true;
            logWindow.innerHTML = '';
            decisionWindow.innerHTML = '<p>Processing telemetry...</p>';

            const agent = new DroneNavigatorAgent();
            const destinationId = "Drop-Point-Alpha-Niner";
            const { thoughtProcess, decision } = await agent.analyzeAndReroute(destinationId);

            for (let step of thoughtProcess) {
                const p = document.createElement('p');
                p.textContent = `> ${step}`;
                logWindow.appendChild(p);
                logWindow.scrollTop = logWindow.scrollHeight;
                await new Promise(r => setTimeout(r, 700)); // visualization delay
            }

            decisionWindow.innerHTML = `
                <p class="decision-action">Action Executed: ${decision.action}</p>
                <p><strong>Confidence:</strong> ${decision.confidence}</p>
                <p><strong>Reasoning:</strong> ${decision.reason}</p>
            `;

            showToast("Agent autonomous rerouting complete.");
            launchBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DroneNavigatorAgent };
}