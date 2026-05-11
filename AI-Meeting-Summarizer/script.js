document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const providerSelect = document.getElementById('llm-provider');
    const apiKeyInput = document.getElementById('api-key');
    const modelInput = document.getElementById('model-name');
    const ollamaUrlContainer = document.getElementById('ollama-url-container');
    const ollamaUrlInput = document.getElementById('ollama-url');
    const extractActionsToggle = document.getElementById('extract-actions');

    const transcriptInput = document.getElementById('transcript-input');
    const outputContent = document.getElementById('output-content');

    const summarizeBtn = document.getElementById('summarize-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const loadingOverlay = document.getElementById('loading-overlay');

    let rawMarkdownOutput = '';

    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('aiMeetingSettings')) || {};
    if (savedSettings.provider) providerSelect.value = savedSettings.provider;
    if (savedSettings.apiKey) apiKeyInput.value = savedSettings.apiKey;
    if (savedSettings.modelName) modelInput.value = savedSettings.modelName;
    if (savedSettings.ollamaUrl) ollamaUrlInput.value = savedSettings.ollamaUrl;
    if (savedSettings.extractActions !== undefined) extractActionsToggle.checked = savedSettings.extractActions;

    updateUIForProvider();

    // Event Listeners
    providerSelect.addEventListener('change', () => {
        updateUIForProvider();
        saveSettings();
    });

    [apiKeyInput, modelInput, ollamaUrlInput, extractActionsToggle].forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    clearBtn.addEventListener('click', () => {
        transcriptInput.value = '';
    });

    copyBtn.addEventListener('click', () => {
        if (rawMarkdownOutput) {
            navigator.clipboard.writeText(rawMarkdownOutput);
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            copyBtn.classList.add('btn-primary');
            copyBtn.classList.remove('btn-success');
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('btn-primary');
                copyBtn.classList.add('btn-success');
            }, 2000);
        }
    });

    summarizeBtn.addEventListener('click', generateSummary);

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
            ollamaUrl: ollamaUrlInput.value,
            extractActions: extractActionsToggle.checked
        };
        localStorage.setItem('aiMeetingSettings', JSON.stringify(settings));
    }

    async function generateSummary() {
        const transcript = transcriptInput.value.trim();
        if (!transcript) {
            alert('Please paste a transcript to summarize.');
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
        summarizeBtn.disabled = true;

        let systemPrompt = `You are a highly skilled executive assistant. Your task is to read the provided meeting transcript and create a highly structured, professional summary.
Format your output in Markdown.
Always include a "## Executive Summary" section with a 2-3 sentence overview.
Always include a "## Key Decisions" section outlining what was agreed upon.`;

        if(extractActionsToggle.checked) {
            systemPrompt += `\nAlways include an "## Action Items" section. Format this as a checklist, explicitly stating the assigned owner if mentioned (e.g., "- [ ] **Alice**: Update the database schema").`;
        }

        try {
            let result = '';
            if (provider === 'openai') {
                result = await fetchOpenAI(apiKey, model, systemPrompt, transcript, { temperature: 0.3 });
            } else if (provider === 'anthropic') {
                result = await fetchAnthropic(apiKey, model, systemPrompt, transcript, { max_tokens: 2048 });
            } else if (provider === 'ollama') {
                result = await fetchOllama(ollamaUrlInput.value.trim(), model, systemPrompt, transcript);
            }

            rawMarkdownOutput = result;
            outputContent.innerHTML = marked.parse(result); // Render markdown to HTML

        } catch (error) {
            console.error(error);
            alert(`Error generating summary: ${error.message}`);
        } finally {
            loadingOverlay.classList.add('hidden');
            summarizeBtn.disabled = false;
        }
    }
});
