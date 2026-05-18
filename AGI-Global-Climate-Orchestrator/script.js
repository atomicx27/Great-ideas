function synthesizeClimateResolution(energy, capture, policy) {
    return {
        resolutionStatus: "Global Climate Strategy Synthesized and Executed.",
        actions: [
            `Energy Grid: Rerouted ${energy.renewableMW} MW of renewable energy to offset spike.`,
            `Carbon Capture: Spun up ${capture.plants} direct air capture facilities to max capacity.`,
            `Economic Policy: Adjusted carbon tax rate by +${policy.taxIncrease}% to disincentivize further emissions.`
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
            energy: { card: document.getElementById('agent-energy'), status: document.querySelector('#agent-energy .agent-status'), output: document.querySelector('#agent-energy .agent-output') },
            capture: { card: document.getElementById('agent-capture'), status: document.querySelector('#agent-capture .agent-status'), output: document.querySelector('#agent-capture .agent-output') },
            policy: { card: document.getElementById('agent-policy'), status: document.querySelector('#agent-policy .agent-status'), output: document.querySelector('#agent-policy .agent-output') }
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
                await new Promise(r => setTimeout(r, Math.random() * 800 + 300));
                appendAgentLog(agentKey, step);
            }
            setAgentState(agentKey, false, "Task Complete");
        };

        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            swarmContainer.style.display = 'flex';
            synthesisNode.style.display = 'block';
            masterStatus.textContent = "Orchestrating Sub-Agents in Parallel...";
            finalStrategy.innerHTML = "";

            Object.keys(agents).forEach(key => {
                agents[key].output.innerHTML = '';
                setAgentState(key, false, "Idle");
            });

            const energySteps = [
                "Analyzing global grid load.",
                "Identifying solar surplus in Region 4.",
                "Rerouting transmission lines.",
                "Allocated 1500 MW renewable energy."
            ];

            const captureSteps = [
                "Monitoring direct air capture (DAC) networks.",
                "Calculating required offset volume.",
                "Spinning up 12 idle DAC facilities.",
                "Facilities running at max capacity."
            ];

            const policySteps = [
                "Simulating economic impact of emission spike.",
                "Evaluating carbon pricing elasticity.",
                "Recommending dynamic tax adjustment.",
                "Tax rate adjusted by +1.5%."
            ];

            await Promise.all([
                simulateAgentProcessing('energy', energySteps),
                simulateAgentProcessing('capture', captureSteps),
                simulateAgentProcessing('policy', policySteps)
            ]);

            masterStatus.textContent = "All sub-agents completed. Synthesizing strategy...";
            await new Promise(r => setTimeout(r, 1000));

            const result = synthesizeClimateResolution(
                { renewableMW: '1500' },
                { plants: '12' },
                { taxIncrease: '1.5' }
            );

            masterStatus.textContent = result.resolutionStatus;

            const ul = document.createElement('ul');
            result.actions.forEach(action => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>Action:</strong> ${action}`;
                ul.appendChild(li);
            });
            finalStrategy.appendChild(ul);

            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { synthesizeClimateResolution };
}
