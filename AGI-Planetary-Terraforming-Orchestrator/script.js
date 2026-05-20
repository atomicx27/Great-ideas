function synthesizeTerraformingStrategy(atmosphere, hydrology, biosphere) {
    return {
        missionStatus: "Planetary Biosphere Initiated: Phase 1 Terraforming",
        actions: [
            `Atmosphere: CO2 levels adjusting. Projected global temperature increase: +${atmosphere.tempIncreaseC}°C within ${atmosphere.timelineYears} years.`,
            `Hydrology: Ice caps melting. Estimated sea level rise: ${hydrology.seaLevelRiseM} meters over ${hydrology.timelineYears} years.`,
            `Biosphere: Lichen/microbial seeded across ${biosphere.coveragePercent}% of equatorial zones.`
        ]
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-swarm-btn');
        const swarmContainer = document.getElementById('swarm-container');
        const synthesisNode = document.getElementById('synthesis-node');
        const masterStatus = document.getElementById('master-status');
        const finalStrategy = document.getElementById('final-strategy');

        const agents = {
            atmosphere: { card: document.getElementById('agent-atmosphere'), status: document.querySelector('#agent-atmosphere .agent-status'), output: document.querySelector('#agent-atmosphere .agent-output') },
            hydrology: { card: document.getElementById('agent-hydrology'), status: document.querySelector('#agent-hydrology .agent-status'), output: document.querySelector('#agent-hydrology .agent-output') },
            biosphere: { card: document.getElementById('agent-biosphere'), status: document.querySelector('#agent-biosphere .agent-status'), output: document.querySelector('#agent-biosphere .agent-output') }
        };

        function appendAgentLog(agentKey, message) {
            const p = document.createElement('p');
            p.textContent = `> ${message}`;
            agents[agentKey].output.appendChild(p);
            agents[agentKey].output.scrollTop = agents[agentKey].output.scrollHeight;
        }

        function setAgentState(agentKey, isActive, statusText) {
            agents[agentKey].status.textContent = statusText;
            if (isActive) {
                agents[agentKey].card.classList.add('active');
            } else {
                agents[agentKey].card.classList.remove('active');
            }
        }

        const simulateAgentProcessing = async (agentKey, steps) => {
            setAgentState(agentKey, true, "Processing...");
            for (let step of steps) {
                await new Promise(r => setTimeout(r, Math.random() * 800 + 500));
                appendAgentLog(agentKey, step);
            }
            setAgentState(agentKey, false, "Task Complete");
        };

        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            swarmContainer.style.display = 'flex';
            synthesisNode.style.display = 'none';
            finalStrategy.innerHTML = '';

            Object.keys(agents).forEach(k => {
                agents[k].output.innerHTML = '';
                setAgentState(k, false, "Pending...");
            });

            masterStatus.textContent = "Analyzing global topological and atmospheric data...";
            await new Promise(r => setTimeout(r, 1500));
            masterStatus.textContent = "Deploying AGI Swarm for Planetary Engineering";

            const atmoSteps = ["Analyzing trace greenhouse gases", "Calculating albedo modifications", "Deploying orbital mirror swarm"];
            const hydroSteps = ["Scanning polar ice cap volume", "Targeting sub-surface aquifers", "Initiating targeted laser melting"];
            const bioSteps = ["Synthesizing radiation-resistant lichen", "Mapping optimal equatorial distribution", "Deploying high-altitude seeding drones"];

            await Promise.all([
                simulateAgentProcessing('atmosphere', atmoSteps),
                simulateAgentProcessing('hydrology', hydroSteps),
                simulateAgentProcessing('biosphere', bioSteps)
            ]);

            masterStatus.textContent = "Synthesizing Planetary Biosphere Architecture...";
            await new Promise(r => setTimeout(r, 1500));

            masterStatus.textContent = "Master Strategy Ready. Awaiting execution authorization.";
            synthesisNode.style.display = 'block';

            const result = synthesizeTerraformingStrategy(
                { tempIncreaseC: 15, timelineYears: 50 },
                { seaLevelRiseM: 200, timelineYears: 100 },
                { coveragePercent: 45 }
            );

            finalStrategy.innerHTML = `
                <p><strong>Status:</strong> <span style="color:var(--accent-orange); font-weight:bold;">${result.missionStatus}</span></p>
                <ul>
                    ${result.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
            `;
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeTerraformingStrategy };
}
