async function optimizeNetworkAgent(networkState) {
    if (!networkState || typeof networkState !== 'string') {
        throw new Error('Invalid network state provided.');
    }

    const systemPrompt = "You are a highly skilled Quantum Network AI Optimizer. Analyze the provided JSON network topology and identify bottlenecks. Return ONLY a single JSON object containing exactly two keys: 'optimization_strategy' (a string describing the recommended fix) and 'predicted_latency' (a string with the new latency).";

    // Default mock API Key, real implementation requires real key
    const mockApiKey = 'sk-mock-quantum-api-key';

    try {
        const responseText = await fetchOpenAI(mockApiKey, 'gpt-4o-mini', systemPrompt, networkState, { temperature: 0.2 });
        return JSON.parse(responseText);
    } catch (err) {
        throw new Error(`Optimization Failed: ${err.message}`);
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
        const form = document.getElementById('optimize-form');
        const output = document.getElementById('output');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const networkState = document.getElementById('network-state').value;
            output.innerHTML = '<p>Agent analyzing quantum topology...</p>';

            try {
                const result = await optimizeNetworkAgent(networkState);

                output.innerHTML = `
                    <p><strong>Optimization Strategy:</strong> ${result.optimization_strategy}</p>
                    <p><strong>Predicted Latency:</strong> ${result.predicted_latency}</p>
                `;
                showToast("Optimization Complete");
            } catch (err) {
                output.innerHTML = `<p class="error">${err.message}</p>`;
                showToast("Optimization Error");
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { optimizeNetworkAgent };
}
