class BusRoutingAgent {
    constructor() {
        this.tools = {
            checkTrafficAPI: () => "Accident reported on Main St. 20 min delay expected.",
            queryPassengers: () => "42 passengers currently on board.",
            calculateAlternative: () => "Route B via Elm St is clear. Adds 5 mins to total trip time."
        };
    }

    async handleObstruction(obstructionData) {
        let thoughtProcess = [];
        thoughtProcess.push(`[Goal: Efficient Routing] Alert: ${obstructionData}`);
        thoughtProcess.push("Gathering context...");

        let traffic = this.tools.checkTrafficAPI();
        thoughtProcess.push(`Tool Action: checkTrafficAPI() -> ${traffic}`);

        let passengers = this.tools.queryPassengers();
        thoughtProcess.push(`Tool Action: queryPassengers() -> ${passengers}`);

        let altRoute = this.tools.calculateAlternative();
        thoughtProcess.push(`Tool Action: calculateAlternative() -> ${altRoute}`);

        thoughtProcess.push("Synthesizing data to determine optimal route...");

        const decision = {
            action: "Divert to Route B via Elm St.",
            confidence: "95%",
            reason: "Avoiding the 20-minute delay on Main St by taking Elm St will save 15 minutes of travel time for the 42 passengers on board."
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
        const triggerBtn = document.getElementById('trigger-reroute-btn');
        const logWindow = document.getElementById('agent-log');
        const decisionWindow = document.getElementById('agent-decision');

        triggerBtn.addEventListener('click', async () => {
            triggerBtn.disabled = true;
            logWindow.innerHTML = '';
            decisionWindow.innerHTML = '<p>Processing...</p>';

            const agent = new BusRoutingAgent();
            const { thoughtProcess, decision } = await agent.handleObstruction("Obstruction detected on primary route.");

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

            showToast("Agent autonomous rerouting executed.");
            triggerBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BusRoutingAgent };
}