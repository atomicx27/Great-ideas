async function runTuningSimulation(targetOutput, apiKey, provider) {
    if (!targetOutput || typeof targetOutput !== 'string') {
        throw new Error('Invalid target output');
    }

    const systemPrompt = `You are an expert Fusion Reactor Tuning Agent.
Your task is to analyze the requested target energy output/constraints and autonomously propose a series of simulated magnetic field adjustments and heating protocols to optimize the reactor's Q-factor.
Provide a concise markdown report detailing:
1. Proposed magnetic coil configuration adjustments.
2. Simulated plasma heating steps (e.g., ICRH, ECRH).
3. Expected confinement time and Q-factor.`;

    const userMessage = `Optimize reactor for the following target: ${targetOutput}`;

    let result = '';

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
        const targetOutputInput = document.getElementById('target-output');
        const tuneBtn = document.getElementById('tune-btn');
        const outputStatus = document.getElementById('output-status');
        const resultDisplay = document.getElementById('result-display');
        const log = document.getElementById('log');

        function appendLog(msg) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            log.prepend(entry);
        }

        tuneBtn.addEventListener('click', async () => {
            const output = targetOutputInput.value.trim();
            const apiKey = apiKeyInput.value.trim();
            const provider = providerSelect.value;

            if (!output) {
                alert('Please enter target output parameters.');
                return;
            }
            if (provider !== 'ollama' && !apiKey) {
                alert('API key is required for cloud providers.');
                return;
            }

            tuneBtn.disabled = true;
            tuneBtn.textContent = 'Agent Running...';
            outputStatus.textContent = 'Agent is simulating reactor tuning...';
            outputStatus.style.backgroundColor = '#fcf3cf';
            outputStatus.style.color = '#b7950b';
            resultDisplay.style.display = 'none';
            resultDisplay.innerHTML = '';

            appendLog(`Agent initialized for target: ${output} using ${provider}`);

            try {
                const markdownResult = await runTuningSimulation(output, apiKey, provider);

                outputStatus.textContent = 'Tuning Simulation Complete!';
                outputStatus.style.backgroundColor = '#d4edda';
                outputStatus.style.color = '#155724';

                // Parse markdown and sanitize
                const parsedHTML = marked.parse(markdownResult);
                const safeHTML = DOMPurify.sanitize(parsedHTML);

                resultDisplay.innerHTML = safeHTML;
                resultDisplay.style.display = 'block';

                appendLog(`Simulation successful.`);
            } catch (error) {
                outputStatus.textContent = `Error: ${error.message}`;
                outputStatus.style.backgroundColor = '#fce4e4';
                outputStatus.style.color = '#c0392b';
                appendLog(`Simulation Failed: ${error.message}`);
            } finally {
                tuneBtn.disabled = false;
                tuneBtn.textContent = 'Run Reactor Tuning Simulation';
            }
        });
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { runTuningSimulation };
}
