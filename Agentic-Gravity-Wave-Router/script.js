async function routeWaveMessage(signalData, apiKey = 'mock-key') {
    const prompt = `Decode the following interstellar spacetime ripple signal and determine its priority routing: ${signalData}. Provide a concise routing instruction.`;

    const llmFetch = typeof fetchOpenAI !== 'undefined' ? fetchOpenAI : require('../shared/llm-api.js').fetchOpenAI;

    try {
        const response = await llmFetch(apiKey, 'gpt-4o', 'You are an autonomous interstellar communications router.', prompt);
        return response;
    } catch (e) {
        return `Routing failed: ${e.message}`;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('route-btn');
        const dataInput = document.getElementById('signal-data');
        const display = document.getElementById('results-display');
        const statusText = document.getElementById('status-text');

        btn.addEventListener('click', async () => {
            const data = dataInput.value;

            statusText.textContent = 'Status: Decoding...';
            display.innerHTML = '<p>Processing signal with agent...</p>';
            btn.disabled = true;

            const apiKey = localStorage.getItem('openai_api_key') || 'mock-key';
            const result = await routeWaveMessage(data, apiKey);

            display.innerHTML = `<p>${result}</p>`;
            statusText.textContent = 'Status: Routed';
            btn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { routeWaveMessage };
}
