// Sub-agent functions
async function runThreatAgent(incident, provider) {
    const prompt = `As the Threat Intelligence Sub-Agent, analyze the following platform safety incident and provide 2 immediate technical mitigation steps (e.g., blocking, shadowbanning): ${incident}`;
    return await fetchLLMResponse(provider, prompt);
}

async function runPolicyAgent(incident, provider) {
    const prompt = `As the Policy & Legal Sub-Agent, analyze the following incident and identify which specific platform guidelines are violated and if law enforcement escalation is required: ${incident}`;
    return await fetchLLMResponse(provider, prompt);
}

async function runCommsAgent(incident, provider) {
    const prompt = `As the Crisis Communications Sub-Agent, analyze the following incident and draft a brief public holding statement for users and media: ${incident}`;
    return await fetchLLMResponse(provider, prompt);
}

// Master Synthesis
async function synthesizeSafetyPlan(incident, threatOutput, policyOutput, commsOutput, provider) {
    const prompt = `As the Master Safety Orchestrator, synthesize the findings from your sub-agents into a cohesive Incident Action Plan for the following event: "${incident}".

Threat Mitigation:
${threatOutput}

Policy & Legal Stance:
${policyOutput}

Communications Plan:
${commsOutput}

Provide a unified, structured Executive Summary detailing the immediate response and recovery phases.`;
    return await fetchLLMResponse(provider, prompt);
}

// Core orchestration logic wrapped for testing
async function orchestrateSafetySwarm(incident, provider, updateUI = () => {}) {
    updateUI('master', 'Triaging Incident and deploying sub-agents...');

    // Run agents in parallel
    const [threatOutput, policyOutput, commsOutput] = await Promise.all([
        runThreatAgent(incident, provider).then(res => { updateUI('agent-threat', res); return res; }),
        runPolicyAgent(incident, provider).then(res => { updateUI('agent-policy', res); return res; }),
        runCommsAgent(incident, provider).then(res => { updateUI('agent-comms', res); return res; })
    ]);

    updateUI('master', 'Synthesizing Sub-Agent Findings...');

    const finalPlan = await synthesizeSafetyPlan(incident, threatOutput, policyOutput, commsOutput, provider);

    updateUI('synthesis', finalPlan);
    return finalPlan;
}

// Browser UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('start-swarm-btn');
        const container = document.getElementById('swarm-container');
        const masterStatus = document.getElementById('master-status');
        const synthesisNode = document.getElementById('synthesis-node');
        const finalStrategy = document.getElementById('final-strategy');

        function updateUI(node, data) {
            if (node === 'master') {
                masterStatus.textContent = data;
            } else if (node === 'synthesis') {
                masterStatus.textContent = "Incident Action Plan Generated.";
                synthesisNode.style.display = 'block';
                finalStrategy.textContent = data;
                btn.disabled = false;
            } else if (node.startsWith('agent-')) {
                const card = document.getElementById(node);
                card.querySelector('.loader').classList.add('hidden');
                card.querySelector('.agent-status').textContent = 'Completed';
                const output = card.querySelector('.agent-output');
                output.style.display = 'block';
                output.textContent = data;
            }
        }

        function resetUI() {
            container.style.display = 'flex';
            synthesisNode.style.display = 'none';
            finalStrategy.textContent = '';

            document.querySelectorAll('.agent-card').forEach(card => {
                card.querySelector('.loader').classList.remove('hidden');
                card.querySelector('.agent-status').textContent = 'Processing...';
                const output = card.querySelector('.agent-output');
                output.style.display = 'none';
                output.textContent = '';
            });
        }

        btn.addEventListener('click', async () => {
            const incident = document.getElementById('agi-incident').value;
            const provider = document.getElementById('master-provider').value;

            btn.disabled = true;
            resetUI();

            await orchestrateSafetySwarm(incident, provider, updateUI);
        });
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        orchestrateSafetySwarm,
        runThreatAgent,
        runPolicyAgent,
        runCommsAgent,
        synthesizeSafetyPlan
    };
}
