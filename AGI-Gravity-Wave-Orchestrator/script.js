async function orchestrateInterstellarComms(goal, apiKey = 'mock-key') {
    const llmFetch = typeof fetchOpenAI !== 'undefined' ? fetchOpenAI : require('../shared/llm-api.js').fetchOpenAI;

    const systemPrompt = "You are a sub-agent of an AGI Orchestrator managing interstellar gravity wave communications.";

    const detectorPrompt = `Goal: ${goal}. Outline the interferometer alignment required to detect the incoming signal. Keep it brief.`;
    const decoderPrompt = `Goal: ${goal}. Define the decryption protocol for the modulated spacetime ripples. Keep it brief.`;
    const transmitterPrompt = `Goal: ${goal}. Specify the energy requirements and targeting for the return pulse. Keep it brief.`;

    try {
        const [detectorRes, decoderRes, transmitterRes] = await Promise.all([
            llmFetch(apiKey, 'gpt-4o', systemPrompt, detectorPrompt),
            llmFetch(apiKey, 'gpt-4o', systemPrompt, decoderPrompt),
            llmFetch(apiKey, 'gpt-4o', systemPrompt, transmitterPrompt)
        ]);

        return { detectorRes, decoderRes, transmitterRes };
    } catch (e) {
        throw new Error(`Orchestration failed: ${e.message}`);
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-swarm-btn');
        const swarmContainer = document.getElementById('swarm-container');
        const synthesisNode = document.getElementById('synthesis-node');
        const masterStatus = document.getElementById('master-status');
        const finalStrategy = document.getElementById('final-strategy');

        const agents = {
            detector: { card: document.getElementById('agent-detector'), status: document.querySelector('#agent-detector .agent-status'), output: document.querySelector('#agent-detector .agent-output') },
            decoder: { card: document.getElementById('agent-decoder'), status: document.querySelector('#agent-decoder .agent-status'), output: document.querySelector('#agent-decoder .agent-output') },
            transmitter: { card: document.getElementById('agent-transmitter'), status: document.querySelector('#agent-transmitter .agent-status'), output: document.querySelector('#agent-transmitter .agent-output') }
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

        startBtn.addEventListener('click', async () => {
            const goal = document.getElementById('network-status').value;
            const apiKey = localStorage.getItem('openai_api_key') || 'mock-key';

            startBtn.disabled = true;
            masterStatus.textContent = "Status: Orchestrator Active. Spawning Swarm...";
            swarmContainer.style.display = 'grid';
            synthesisNode.style.display = 'none';
            finalStrategy.innerHTML = '';

            for (let key in agents) {
                agents[key].output.innerHTML = '';
                setAgentState(key, true, 'Synchronizing...');
            }

            try {
                const results = await orchestrateInterstellarComms(goal, apiKey);

                appendAgentLog('detector', results.detectorRes);
                setAgentState('detector', false, 'Task Complete');

                appendAgentLog('decoder', results.decoderRes);
                setAgentState('decoder', false, 'Task Complete');

                appendAgentLog('transmitter', results.transmitterRes);
                setAgentState('transmitter', false, 'Task Complete');

                masterStatus.textContent = "Status: Swarm Tasks Complete. Synthesizing Protocol...";

                setTimeout(() => {
                    synthesisNode.style.display = 'block';
                    finalStrategy.innerHTML = `
                        <p><strong>Detection:</strong> Alignment confirmed.</p>
                        <p><strong>Decoding:</strong> Handshake sequence decrypted.</p>
                        <p><strong>Transmission:</strong> Return pulse fired.</p>
                        <p><strong>Orchestrator Conclusion:</strong> ${goal} established.</p>
                    `;
                    masterStatus.textContent = "Status: Communications Link Active.";
                    startBtn.disabled = false;
                }, 1000);

            } catch (err) {
                masterStatus.textContent = `Status: Error - ${err.message}`;
                startBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateInterstellarComms };
}
