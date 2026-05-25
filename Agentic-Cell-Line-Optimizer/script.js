async function runOptimization(targetTraits, apiKey, provider) {
    if (!targetTraits || typeof targetTraits !== 'string') {
        throw new Error('Invalid target traits');
    }

    const systemPrompt = `You are an expert Cell Line Optimization Agent for cultured meat production.
Your task is to analyze the requested target traits and autonomously propose a series of simulated genetic edits (e.g., CRISPR-Cas9 targets, media adaptation strategies) to achieve the goal.
Provide a concise markdown report detailing:
1. Identified genes for modification.
2. Simulated optimization steps.
3. Expected phenotype results.`;

    const userMessage = `Optimize cell line for the following traits: ${targetTraits}`;

    let result = '';

    // fetchOpenAI, fetchAnthropic, fetchOllama are expected to be available globally from shared/llm-api.js
    if (provider === 'openai') {
        result = await fetchOpenAI(apiKey, 'gpt-4o-mini', systemPrompt, userMessage, { temperature: 0.4 });
    } else if (provider === 'anthropic') {
        result = await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20241022', systemPrompt, userMessage, { temperature: 0.4 });
    } else if (provider === 'ollama') {
        result = await fetchOllama('llama3', systemPrompt, userMessage, { temperature: 0.4 });
    } else {
        throw new Error('Unsupported provider');
    }

    return result;
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const apiKeyInput = document.getElementById('api-key');
        const providerSelect = document.getElementById('llm-provider');
        const targetTraitsInput = document.getElementById('target-traits');
        const optimizeBtn = document.getElementById('optimize-btn');
        const outputStatus = document.getElementById('output-status');
        const resultDisplay = document.getElementById('result-display');
        const log = document.getElementById('log');

        function appendLog(msg) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            log.prepend(entry);
        }

        optimizeBtn.addEventListener('click', async () => {
            const traits = targetTraitsInput.value.trim();
            const apiKey = apiKeyInput.value.trim();
            const provider = providerSelect.value;

            if (!traits) {
                alert('Please enter target traits.');
                return;
            }
            if (provider !== 'ollama' && !apiKey) {
                alert('API key is required for cloud providers.');
                return;
            }

            optimizeBtn.disabled = true;
            optimizeBtn.textContent = 'Agent Running...';
            outputStatus.textContent = 'Agent is simulating optimization...';
            outputStatus.style.backgroundColor = '#fcf3cf';
            outputStatus.style.color = '#b7950b';
            resultDisplay.style.display = 'none';
            resultDisplay.innerHTML = '';

            appendLog(`Agent initialized for traits: ${traits} using ${provider}`);

            try {
                const markdownResult = await runOptimization(traits, apiKey, provider);

                outputStatus.textContent = 'Optimization Complete!';
                outputStatus.style.backgroundColor = '#d4edda';
                outputStatus.style.color = '#155724';

                // Parse markdown and sanitize
                const parsedHTML = marked.parse(markdownResult);
                const safeHTML = DOMPurify.sanitize(parsedHTML);

                resultDisplay.innerHTML = safeHTML;
                resultDisplay.style.display = 'block';

                appendLog(`Analysis successful.`);
            } catch (error) {
                outputStatus.textContent = `Error: ${error.message}`;
                outputStatus.style.backgroundColor = '#fce4e4';
                outputStatus.style.color = '#c0392b';
                appendLog(`Analysis Failed: ${error.message}`);
            } finally {
                optimizeBtn.disabled = false;
                optimizeBtn.textContent = 'Run Cell Line Optimization';
            }
        });
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { runOptimization };
}
