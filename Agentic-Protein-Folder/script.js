async function predictFoldingStructure(sequence, apiKey, provider) {
    if (!sequence || typeof sequence !== 'string') {
        throw new Error('Invalid amino acid sequence');
    }

    sequence = sequence.trim().toUpperCase();

    // Basic structural validation - checking for valid amino acid letters
    const validAminoAcids = /^[ACDEFGHIKLMNPQRSTVWY]+$/;
    if (!validAminoAcids.test(sequence)) {
        throw new Error('Sequence contains invalid amino acid characters.');
    }

    const systemPrompt = `You are an expert bioinformatician Agent.
Your task is to analyze the following amino acid sequence and predict its likely secondary and tertiary structural properties based on hydrophobic/hydrophilic tendencies.
Provide a concise markdown report with:
1. Expected secondary structures (Alpha helices, Beta sheets).
2. Overall predicted fold (e.g., globular, transmembrane).
3. A brief explanation of the reasoning.`;

    const userMessage = `Analyze this sequence: ${sequence}`;

    let result = '';

    // fetchOpenAI, fetchAnthropic, fetchOllama are expected to be available globally from shared/llm-api.js
    if (provider === 'openai') {
        result = await fetchOpenAI(apiKey, 'gpt-4o-mini', systemPrompt, userMessage, { temperature: 0.3 });
    } else if (provider === 'anthropic') {
        result = await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20241022', systemPrompt, userMessage, { temperature: 0.3 });
    } else if (provider === 'ollama') {
        result = await fetchOllama('llama3', systemPrompt, userMessage, { temperature: 0.3 });
    } else {
        throw new Error('Unsupported provider');
    }

    return result;
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const apiKeyInput = document.getElementById('api-key');
        const providerSelect = document.getElementById('llm-provider');
        const aminoInput = document.getElementById('amino-input');
        const foldBtn = document.getElementById('fold-btn');
        const outputStatus = document.getElementById('output-status');
        const resultDisplay = document.getElementById('result-display');
        const log = document.getElementById('log');

        function appendLog(msg) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            log.prepend(entry);
        }

        foldBtn.addEventListener('click', async () => {
            const sequence = aminoInput.value.trim();
            const apiKey = apiKeyInput.value.trim();
            const provider = providerSelect.value;

            if (!sequence) {
                alert('Please enter an amino acid sequence.');
                return;
            }
            if (provider !== 'ollama' && !apiKey) {
                alert('API key is required for cloud providers.');
                return;
            }

            foldBtn.disabled = true;
            foldBtn.textContent = 'Predicting...';
            outputStatus.textContent = 'Agent is analyzing sequence...';
            outputStatus.style.backgroundColor = '#fcf3cf';
            outputStatus.style.color = '#b7950b';
            resultDisplay.style.display = 'none';
            resultDisplay.innerHTML = '';

            appendLog(`Agent initialized for sequence: ${sequence.substring(0, 10)}... using ${provider}`);

            try {
                const markdownResult = await predictFoldingStructure(sequence, apiKey, provider);

                outputStatus.textContent = 'Prediction Complete!';
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
                foldBtn.disabled = false;
                foldBtn.textContent = 'Predict Structure';
            }
        });
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { predictFoldingStructure };
}
