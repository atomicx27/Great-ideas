async function optimizeSynthesis(beamEnergy, positronDensity, apiKey = 'mock-key') {
    const prompt = `Analyze the synthesis parameters for antihydrogen production: Beam Energy = ${beamEnergy} MeV, Positron Density = ${positronDensity} x10^7/cm^3. Provide a brief recommendation to optimize the yield.`;

    // In a browser environment, fetchOpenAI is provided globally by shared/llm-api.js.
    // In tests, we might inject it or mock it.
    const llmFetch = typeof fetchOpenAI !== 'undefined' ? fetchOpenAI : require('../shared/llm-api.js').fetchOpenAI;

    try {
        const response = await llmFetch(apiKey, 'gpt-4o', 'You are an expert physicist specializing in antimatter synthesis.', prompt);
        return response;
    } catch (e) {
        return `Optimization failed: ${e.message}`;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('optimize-btn');
        const energyInput = document.getElementById('beam-energy');
        const densityInput = document.getElementById('positron-density');
        const display = document.getElementById('results-display');
        const statusText = document.getElementById('status-text');

        btn.addEventListener('click', async () => {
            const energy = parseFloat(energyInput.value);
            const density = parseFloat(densityInput.value);

            statusText.textContent = 'Status: Optimizing...';
            display.innerHTML = '<p>Querying synthesis agent...</p>';
            btn.disabled = true;

            const apiKey = localStorage.getItem('openai_api_key') || 'mock-key';
            const result = await optimizeSynthesis(energy, density, apiKey);

            display.innerHTML = `<p>${result}</p>`;
            statusText.textContent = 'Status: Optimization Complete';
            btn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { optimizeSynthesis };
}
