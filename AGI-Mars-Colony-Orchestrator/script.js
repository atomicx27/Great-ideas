async function manageColonyExpansion() {
    const openaiKey = 'sk-mock-openai';
    const anthropicKey = 'sk-mock-anthropic';

    const lifeSupportPrompt = "Analyze colony life support. Return JSON: 'oxygen_reserves' and 'sustainability_score'.";
    const resourcePrompt = "Calculate expansion resources. Return JSON: 'extracted_tons' and 'expansion_viability'.";

    try {
        const [lifeSupportTask, resourceTask] = await Promise.all([
            fetchAnthropic(anthropicKey, 'claude-3-haiku-20240307', lifeSupportPrompt, "Colony Population: 150", { max_tokens: 500 }),
            fetchOpenAI(openaiKey, 'gpt-4o-mini', resourcePrompt, "Ice mining sector alpha.", { temperature: 0.1 })
        ]);

        return {
            lifeSupport: JSON.parse(lifeSupportTask),
            resources: JSON.parse(resourceTask)
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
            statusText.textContent = "Orchestrating Sub-Systems...";
            output.innerHTML = '<p>Initiating concurrent colony analysis...</p>';

            try {
                const results = await manageColonyExpansion();

                statusText.textContent = "Expansion Cycle Coordinated";
                output.innerHTML = `
                    <h3>Life Support Agent (Anthropic)</h3>
                    <p><strong>Oxygen Reserves:</strong> ${results.lifeSupport.oxygen_reserves}</p>
                    <p><strong>Sustainability Score:</strong> ${results.lifeSupport.sustainability_score}/100</p>

                    <h3>Resource Agent (OpenAI)</h3>
                    <p><strong>Extracted Material:</strong> ${results.resources.extracted_tons} tons</p>
                    <p><strong>Expansion Viability:</strong> ${results.resources.expansion_viability}</p>
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
    module.exports = { manageColonyExpansion };
}
