// Simulated Bio Tools
const bioTools = {
    evaluateHydrophobicity: async (sequence) => {
        return new Promise(resolve => setTimeout(() => {
            resolve(`Sequence contains 65% hydrophobic residues. Highly likely to form an internal core.`);
        }, 800));
    },
    simulateHydrogenBonds: async (sequence) => {
        return new Promise(resolve => setTimeout(() => {
            resolve(`Strong hydrogen bonding detected at positions 4, 8, and 12.`);
        }, 1000));
    }
};

async function fetchLLMResponse(provider, apiKey, model, systemPrompt, userMessage) {
    if (typeof fetchOpenAI === 'undefined' && typeof window !== 'undefined') {
        throw new Error('LLM API utilities not loaded.');
    }
    const apiModule = typeof window !== 'undefined' ? window : require('../shared/llm-api.js');

    if (provider === 'openai') {
        return await apiModule.fetchOpenAI(apiKey, model || 'gpt-4o-mini', systemPrompt, userMessage);
    } else if (provider === 'anthropic') {
        return await apiModule.fetchAnthropic(apiKey, model || 'claude-3-haiku-20240307', systemPrompt, userMessage);
    } else if (provider === 'ollama') {
        return await apiModule.fetchOllama('http://localhost:11434', model || 'llama3', systemPrompt, userMessage);
    }
    throw new Error('Invalid provider');
}

async function runFoldingAgent(provider, apiKey, model, sequence, logCallback) {
    try {
        logCallback(`Thinking: Goal is to predict the secondary structure of sequence ${sequence}.`, 'log-thought');

        logCallback(`Executing Tool: evaluateHydrophobicity()`, 'log-action');
        const hydroData = await bioTools.evaluateHydrophobicity(sequence);
        logCallback(`Observation: ${hydroData}`, 'log-info');

        logCallback(`Thinking: Need to check for bonding patterns to determine shape.`, 'log-thought');

        logCallback(`Executing Tool: simulateHydrogenBonds()`, 'log-action');
        const bondData = await bioTools.simulateHydrogenBonds(sequence);
        logCallback(`Observation: ${bondData}`, 'log-info');

        logCallback(`Thinking: Asking LLM to predict final structure based on this data.`, 'log-thought');

        const systemPrompt = `You are an Agentic Protein Folder. Analyze the hydrophobicity and bonding data for an amino acid sequence to predict its secondary structure.
Return ONLY a JSON object with two keys:
1. "prediction": A string describing the structure (e.g., "Alpha-helix formation predicted").
2. "confidence": A string indicating confidence level (e.g., "89%").
Do not include markdown or additional text.`;

        const userMessage = `Sequence: ${sequence}
Hydrophobicity: ${hydroData}
Bonds: ${bondData}
What is the predicted structure?`;

        let llmResponseText;
        try {
            llmResponseText = await fetchLLMResponse(provider, apiKey, model, systemPrompt, userMessage);
        } catch (llmError) {
            logCallback(`LLM API Error: ${llmError.message}. Falling back to default prediction.`, 'log-error');
            llmResponseText = '{"prediction":"Alpha-helix formation predicted.","confidence":"89%"}';
        }

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(llmResponseText.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (parseError) {
             logCallback(`Failed to parse LLM JSON. Falling back.`, 'log-error');
             parsedResponse = { prediction: "Alpha-helix formation predicted.", confidence: "89%" };
        }

        logCallback(`Observation: ${parsedResponse.prediction} (${parsedResponse.confidence})`, 'log-success');

        return {
            status: "Folding Complete",
            prediction: parsedResponse.prediction,
            confidence: parsedResponse.confidence
        };

    } catch (error) {
        logCallback(`CRITICAL ERROR: ${error.message || error}`, 'log-error');
        throw error;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const providerSelect = document.getElementById('provider-select');
        const apiKeyGroup = document.getElementById('api-key-group');
        const modelGroup = document.getElementById('model-group');
        const apiKeyInput = document.getElementById('api-key');
        const modelInput = document.getElementById('model-name');
        const runBtn = document.getElementById('run-agent-btn');
        const outputLog = document.getElementById('output-log');
        const sequenceInput = document.getElementById('amino-sequence');
        const finalResultsContainer = document.getElementById('final-results');

        providerSelect.addEventListener('change', (e) => {
            if (e.target.value === 'ollama') {
                apiKeyGroup.style.display = 'none';
                modelGroup.style.display = 'block';
            } else {
                apiKeyGroup.style.display = 'block';
                modelGroup.style.display = 'none';
            }
        });

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[T+${new Date().getSeconds()}s] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        runBtn.addEventListener('click', async () => {
            outputLog.innerHTML = '';
            finalResultsContainer.innerHTML = '';
            finalResultsContainer.classList.add('hidden');
            runBtn.disabled = true;

            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;
            const model = modelInput.value;
            const seq = sequenceInput.value;

            appendLog(`Initiating Agentic Folding Sequence for ${seq} via ${provider}...`, 'log-info');

            try {
                const result = await runFoldingAgent(provider, apiKey, model, seq, appendLog);

                const sanitize = (typeof DOMPurify !== 'undefined') ? DOMPurify.sanitize : (t) => t;

                finalResultsContainer.innerHTML = `
                    <h3>Final Prediction Synthesis</h3>
                    <ul>
                        <li><strong>Status:</strong> ${sanitize(result.status)}</li>
                        <li><strong>Structure:</strong> <span style="color:var(--accent-green)">${sanitize(result.prediction)}</span></li>
                        <li><strong>Confidence:</strong> ${sanitize(result.confidence)}</li>
                    </ul>
                `;
                finalResultsContainer.classList.remove('hidden');

            } catch (error) {
                appendLog(`Agent run aborted.`, 'log-error');
            } finally {
                runBtn.disabled = false;
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runFoldingAgent, bioTools, fetchLLMResponse };
}