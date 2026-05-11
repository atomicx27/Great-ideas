document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const providerSelect = document.getElementById('llm-provider');
    const apiKeyInput = document.getElementById('api-key');
    const modelInput = document.getElementById('model-name');
    const ollamaUrlContainer = document.getElementById('ollama-url-container');
    const ollamaUrlInput = document.getElementById('ollama-url');

    const contextInput = document.getElementById('email-context');
    const toneSelect = document.getElementById('email-tone');
    const lengthSelect = document.getElementById('email-length');
    const draftOutput = document.getElementById('email-draft');

    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('aiCopilotSettings')) || {};
    if (savedSettings.provider) providerSelect.value = savedSettings.provider;
    if (savedSettings.apiKey) apiKeyInput.value = savedSettings.apiKey;
    if (savedSettings.modelName) modelInput.value = savedSettings.modelName;
    if (savedSettings.ollamaUrl) ollamaUrlInput.value = savedSettings.ollamaUrl;

    updateUIForProvider();

    // Event Listeners
    providerSelect.addEventListener('change', () => {
        updateUIForProvider();
        saveSettings();
    });

    [apiKeyInput, modelInput, ollamaUrlInput].forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    clearBtn.addEventListener('click', () => {
        contextInput.value = '';
        draftOutput.value = '';
    });

    copyBtn.addEventListener('click', () => {
        if (draftOutput.value) {
            navigator.clipboard.writeText(draftOutput.value);
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
        }
    });

    generateBtn.addEventListener('click', generateDraft);

    // Functions
    function updateUIForProvider() {
        const provider = providerSelect.value;
        if (provider === 'ollama') {
            document.getElementById('api-key-container').classList.add('hidden');
            ollamaUrlContainer.classList.remove('hidden');
            if(modelInput.value.includes('gpt') || modelInput.value.includes('claude')) {
                modelInput.value = 'llama3';
            }
        } else {
            document.getElementById('api-key-container').classList.remove('hidden');
            ollamaUrlContainer.classList.add('hidden');
            if(provider === 'openai' && !modelInput.value.includes('gpt')) modelInput.value = 'gpt-4o-mini';
            if(provider === 'anthropic' && !modelInput.value.includes('claude')) modelInput.value = 'claude-3-haiku-20240307';
        }
    }

    function saveSettings() {
        const settings = {
            provider: providerSelect.value,
            apiKey: apiKeyInput.value,
            modelName: modelInput.value,
            ollamaUrl: ollamaUrlInput.value
        };
        localStorage.setItem('aiCopilotSettings', JSON.stringify(settings));
    }

    async function generateDraft() {
        const context = contextInput.value.trim();
        if (!context) {
            alert('Please provide some context for the email.');
            return;
        }

        const provider = providerSelect.value;
        const apiKey = apiKeyInput.value.trim();
        const model = modelInput.value.trim();

        if (provider !== 'ollama' && !apiKey) {
            alert('Please enter an API key for cloud providers.');
            return;
        }

        loadingOverlay.classList.remove('hidden');
        generateBtn.disabled = true;

        const systemPrompt = `You are an expert executive assistant. Write an email based on the user's instructions.
Tone: ${toneSelect.value}. Length: ${lengthSelect.value}.
Output ONLY the email body. Do not include subject lines unless asked. Do not include introductory text like "Here is your email:".`;

        try {
            let result = '';
            if (provider === 'openai') {
                result = await fetchOpenAI(apiKey, model, systemPrompt, context, { temperature: 0.7 });
            } else if (provider === 'anthropic') {
                result = await fetchAnthropic(apiKey, model, systemPrompt, context, { max_tokens: 1024 });
            } else if (provider === 'ollama') {
                result = await fetchOllama(ollamaUrlInput.value.trim(), model, systemPrompt, context);
            }

            draftOutput.value = result;
        } catch (error) {
            console.error(error);
            alert(`Error generating draft: ${error.message}`);
        } finally {
            loadingOverlay.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }
});
