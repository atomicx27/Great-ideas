async function orchestrateQuantumSwarm() {
    const openaiKey = 'sk-mock-openai';
    const anthropicKey = 'sk-mock-anthropic';

    const securityPrompt = "Analyze the quantum key distribution (QKD) integrity. Return JSON with 'security_status' and 'threat_level'.";
    const routingPrompt = "Optimize global entangled pair routing. Return JSON with 'primary_route' and 'efficiency'.";

    try {
        const [securityTask, routingTask] = await Promise.all([
            fetchAnthropic(anthropicKey, 'claude-3-haiku-20240307', securityPrompt, "Current Network state: 4 active QKD nodes", { max_tokens: 500 }),
            fetchOpenAI(openaiKey, 'gpt-4o-mini', routingPrompt, "Global routing table matrix...", { temperature: 0.1 })
        ]);

        return {
            securityData: JSON.parse(securityTask),
            routingData: JSON.parse(routingTask)
        };
    } catch (err) {
        throw new Error(`Orchestration Failed: ${err.message}`);
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
        const btn = document.getElementById('orchestrate-btn');
        const output = document.getElementById('output');
        const statusText = document.getElementById('status-text');

        btn.addEventListener('click', async () => {
            btn.disabled = true;
            statusText.textContent = "Orchestrating Agents...";
            output.innerHTML = '<p>Initiating multi-agent coordination...</p>';

            try {
                const results = await orchestrateQuantumSwarm();

                statusText.textContent = "Orchestration Complete";
                output.innerHTML = `
                    <h3>Security Sub-system (Anthropic)</h3>
                    <p><strong>Status:</strong> ${results.securityData.security_status}</p>
                    <p><strong>Threat Level:</strong> ${results.securityData.threat_level}</p>

                    <h3>Routing Sub-system (OpenAI)</h3>
                    <p><strong>Primary Route:</strong> ${results.routingData.primary_route}</p>
                    <p><strong>Efficiency:</strong> ${results.routingData.efficiency}</p>
                `;
                showToast("Orchestration Successful");
            } catch (err) {
                statusText.textContent = "Orchestration Failed";
                output.innerHTML = `<p class="error">${err.message}</p>`;
                showToast("System Error");
            } finally {
                btn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateQuantumSwarm };
}
