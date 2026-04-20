document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const providerSelect = document.getElementById('llm-provider');
    const apiKeyInput = document.getElementById('api-key');
    const modelInput = document.getElementById('model-name');
    const ollamaUrlContainer = document.getElementById('ollama-url-container');
    const ollamaUrlInput = document.getElementById('ollama-url');

    const topicInput = document.getElementById('research-topic');
    const researchBtn = document.getElementById('research-btn');

    const agentProcessContainer = document.getElementById('agent-process');
    const processSteps = document.getElementById('process-steps');

    const finalOutputContainer = document.getElementById('final-output-container');
    const outputContent = document.getElementById('output-content');
    const copyBtn = document.getElementById('copy-btn');

    let rawMarkdownOutput = '';

    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('agenticResearchSettings')) || {};
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

    topicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') researchBtn.click();
    });

    copyBtn.addEventListener('click', () => {
        if (rawMarkdownOutput) {
            navigator.clipboard.writeText(rawMarkdownOutput);
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
        }
    });

    researchBtn.addEventListener('click', runAgenticWorkflow);

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
            if(provider === 'openai' && !modelInput.value.includes('gpt')) modelInput.value = 'gpt-4o';
            if(provider === 'anthropic' && !modelInput.value.includes('claude')) modelInput.value = 'claude-3-sonnet-20240229';
        }
    }

    function saveSettings() {
        const settings = {
            provider: providerSelect.value,
            apiKey: apiKeyInput.value,
            modelName: modelInput.value,
            ollamaUrl: ollamaUrlInput.value
        };
        localStorage.setItem('agenticResearchSettings', JSON.stringify(settings));
    }

    function addLogStep(text, status = 'active') {
        const li = document.createElement('li');
        li.innerHTML = text;
        li.className = status;
        processSteps.appendChild(li);
        li.scrollIntoView({ behavior: 'smooth' });
        return li;
    }

    function updateLogStep(element, text, status) {
        element.innerHTML = text;
        element.className = status;
    }

    // --- AGENTIC WORKFLOW ---
    async function runAgenticWorkflow() {
        const topic = topicInput.value.trim();
        if (!topic) {
            alert('Please enter a topic to research.');
            return;
        }

        const provider = providerSelect.value;
        const apiKey = apiKeyInput.value.trim();
        const model = modelInput.value.trim();

        if (provider !== 'ollama' && !apiKey) {
            alert('Please enter an API key for cloud providers.');
            return;
        }

        // Reset UI
        researchBtn.disabled = true;
        agentProcessContainer.classList.remove('hidden');
        finalOutputContainer.classList.add('hidden');
        processSteps.innerHTML = '';
        outputContent.innerHTML = '';
        rawMarkdownOutput = '';

        try {
            // STEP 1: Plan Search Query
            let planStep = addLogStep(`Analyzing prompt and planning search strategy for: "${topic}"...`);

            const planPrompt = `You are an expert research assistant. The user wants to know about: "${topic}".
Generate exactly ONE specific search query that I can use to search Wikipedia to find information about this topic.
Respond WITH THE SEARCH QUERY ONLY. No quotes, no intro text.`;

            const searchQuery = await askLLM(provider, apiKey, model, planPrompt, "Extract search query.");
            updateLogStep(planStep, `Planned Wikipedia search query: <strong>[${searchQuery}]</strong>`, 'success');

            // STEP 2: Fetch Live Data (Tool Use Simulation)
            let fetchStep = addLogStep(`Executing Tool: Searching Wikipedia API for "${searchQuery}"...`);
            const wikiData = await fetchWikipedia(searchQuery);

            if (!wikiData) {
                updateLogStep(fetchStep, `Tool Execution Failed: No Wikipedia article found for "${searchQuery}".`, 'error');
                throw new Error("Could not find sufficient data on Wikipedia to answer the prompt.");
            }
            updateLogStep(fetchStep, `Tool Execution Success: Retrieved Wikipedia article "${wikiData.title}" (${wikiData.extract.length} characters).`, 'success');

            // STEP 3: Synthesize
            let synthStep = addLogStep(`Synthesizing retrieved data to answer the user's prompt...`);

            const synthPrompt = `You are an expert research assistant. The user asked: "${topic}".
Use the following live Wikipedia data to answer their question comprehensively.
Format your output in Markdown. Use headings and bullet points where appropriate.
If the Wikipedia data does not answer the question, state that clearly based on the available data.

--- WIKIPEDIA DATA FOR: ${wikiData.title} ---
${wikiData.extract}`;

            const finalReport = await askLLM(provider, apiKey, model, synthPrompt, "Synthesizing final report based on context.");
            updateLogStep(synthStep, `Synthesis complete. Rendering final report.`, 'success');

            // Render Output
            rawMarkdownOutput = finalReport;
            outputContent.innerHTML = marked.parse(finalReport);
            finalOutputContainer.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            addLogStep(`Agent Workflow Aborted: ${error.message}`, 'error');
        } finally {
            researchBtn.disabled = false;
        }
    }

    // --- EXTERNAL TOOL: Wikipedia API ---
    async function fetchWikipedia(query) {
        // 1. Search for the closest page title
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.query.search.length === 0) return null;

        const bestTitle = searchData.query.search[0].title;

        // 2. Fetch the actual content extract of that page
        const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=false&explaintext=true&titles=${encodeURIComponent(bestTitle)}&format=json&origin=*`;
        const extractRes = await fetch(extractUrl);
        const extractData = await extractRes.json();

        const pages = extractData.query.pages;
        const pageId = Object.keys(pages)[0];

        return {
            title: pages[pageId].title,
            extract: pages[pageId].extract.substring(0, 8000) // Limit context size
        };
    }

    // --- LLM ROUTER ---
    async function askLLM(provider, apiKey, model, prompt, systemMsg) {
        if (provider === 'openai') {
            return await fetchOpenAI(apiKey, model, systemMsg, prompt);
        } else if (provider === 'anthropic') {
            return await fetchAnthropic(apiKey, model, systemMsg, prompt);
        } else if (provider === 'ollama') {
            return await fetchOllama(ollamaUrlInput.value.trim(), model, systemMsg, prompt);
        }
    }

    // --- API Integrations ---

    async function fetchOpenAI(apiKey, model, systemPrompt, userMessage) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'OpenAI API Error');
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    async function fetchAnthropic(apiKey, model, systemPrompt, userMessage) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerously-allow-browser': 'true'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 2048,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userMessage }
                ]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Anthropic API Error');
        }

        const data = await response.json();
        return data.content[0].text.trim();
    }

    async function fetchOllama(baseUrl, model, systemPrompt, userMessage) {
        const url = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

        const response = await fetch(`${url}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error('Ollama API Error. Ensure Ollama is running and CORS is enabled if needed.');
        }

        const data = await response.json();
        return data.message.content.trim();
    }
});
