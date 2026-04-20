document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // Modal
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings');
    const settingsModal = document.getElementById('settings-modal');

    // Config
    const providerSelect = document.getElementById('llm-provider');
    const apiKeyInput = document.getElementById('api-key');
    const modelInput = document.getElementById('model-name');
    const ollamaUrlContainer = document.getElementById('ollama-url-container');
    const ollamaUrlInput = document.getElementById('ollama-url');

    // Inputs
    const documentInput = document.getElementById('document-input');
    const runBoardBtn = document.getElementById('run-board-btn');

    // States
    const stateIdle = document.getElementById('dashboard-idle');
    const stateProcessing = document.getElementById('dashboard-processing');
    const stateResults = document.getElementById('dashboard-results');

    const statusList = document.getElementById('agent-status-list');
    const synthesisOutput = document.getElementById('synthesis-output');
    const critiqueContainer = document.getElementById('critique-container');
    const copyReportBtn = document.getElementById('copy-report-btn');

    let rawMasterOutput = '';

    const PERSONA_CONFIGS = {
        'legal': { name: 'Strict Legal Counsel', icon: 'fa-scale-balanced', prompt: 'You are the Strict Legal Counsel. Review this document for legal liabilities, compliance risks, ambiguous phrasing that could lead to lawsuits, and contractual loopholes.' },
        'finance': { name: 'Frugal CFO', icon: 'fa-chart-line', prompt: 'You are the Frugal CFO. Review this document for hidden costs, poor ROI, financial risks, and budget inefficiencies. Suggest ways to cut costs.' },
        'marketing': { name: 'Creative CMO', icon: 'fa-bullhorn', prompt: 'You are the Creative CMO. Review this document for brand alignment, messaging clarity, public perception risks, and missed marketing opportunities.' },
        'engineering': { name: 'Pragmatic CTO', icon: 'fa-code', prompt: 'You are the Pragmatic CTO. Review this document for technical feasibility, architectural flaws, scalability issues, and unrealistic timelines.' },
        'hr': { name: 'Empathetic CHRO', icon: 'fa-user-tie', prompt: 'You are the Empathetic CHRO. Review this document for its impact on company culture, employee morale, diversity/inclusion issues, and staffing constraints.' },
        'security': { name: 'Paranoid CISO', icon: 'fa-shield-halved', prompt: 'You are the Paranoid CISO. Review this document for data privacy risks, security vulnerabilities, and potential vectors for cyber attacks.' }
    };

    // --- Init ---
    const savedSettings = JSON.parse(localStorage.getItem('agiReviewBoardSettings')) || {};
    if (savedSettings.provider) providerSelect.value = savedSettings.provider;
    if (savedSettings.apiKey) apiKeyInput.value = savedSettings.apiKey;
    if (savedSettings.modelName) modelInput.value = savedSettings.modelName;
    if (savedSettings.ollamaUrl) ollamaUrlInput.value = savedSettings.ollamaUrl;
    updateUIForProvider();

    // --- Event Listeners ---
    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

    providerSelect.addEventListener('change', () => {
        updateUIForProvider();
        saveSettings();
    });

    [apiKeyInput, modelInput, ollamaUrlInput].forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    copyReportBtn.addEventListener('click', () => {
        if (rawMasterOutput) {
            navigator.clipboard.writeText(rawMasterOutput);
            const originalHTML = copyReportBtn.innerHTML;
            copyReportBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => { copyReportBtn.innerHTML = originalHTML; }, 2000);
        }
    });

    runBoardBtn.addEventListener('click', executeReviewBoard);

    // --- Functions ---
    function updateUIForProvider() {
        const provider = providerSelect.value;
        if (provider === 'ollama') {
            document.getElementById('api-key-container').classList.add('hidden');
            ollamaUrlContainer.classList.remove('hidden');
            if(modelInput.value.includes('gpt') || modelInput.value.includes('claude')) modelInput.value = 'llama3';
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
        localStorage.setItem('agiReviewBoardSettings', JSON.stringify(settings));
    }

    function createStatusRow(id, title) {
        const row = document.createElement('div');
        row.className = 'status-row';
        row.id = `status-row-${id}`;
        row.innerHTML = `
            <span><i class="fa-solid fa-robot"></i> ${title}</span>
            <span class="status-working" id="status-text-${id}">Reading... <i class="fa-solid fa-spinner fa-spin"></i></span>
        `;
        statusList.appendChild(row);
    }

    function updateStatusRow(id, status, isError = false) {
        const textEl = document.getElementById(`status-text-${id}`);
        if(textEl) {
            if(isError) {
                textEl.innerHTML = `<span style="color:#ef4444">${status} <i class="fa-solid fa-circle-exclamation"></i></span>`;
            } else {
                textEl.className = 'status-done';
                textEl.innerHTML = `${status} <i class="fa-solid fa-check"></i>`;
            }
        }
    }

    function createCritiqueCard(title, icon, content) {
        const card = document.createElement('div');
        card.className = 'critique-card';
        card.innerHTML = `
            <div class="critique-header">
                <i class="fa-solid ${icon}"></i> ${title} Critique
            </div>
            <div class="critique-body markdown-body">
                ${marked.parse(content)}
            </div>
        `;
        critiqueContainer.appendChild(card);
    }

    // --- MAIN AGI WORKFLOW ---
    async function executeReviewBoard() {
        const documentText = documentInput.value.trim();
        if (!documentText) {
            alert('Please paste a document to review.');
            return;
        }

        const selectedCheckboxes = document.querySelectorAll('.persona-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select at least one expert persona.');
            return;
        }

        const provider = providerSelect.value;
        const apiKey = apiKeyInput.value.trim();
        const model = modelInput.value.trim();

        if (provider !== 'ollama' && !apiKey) {
            alert('Please enter an API key in the settings.');
            settingsModal.classList.remove('hidden');
            return;
        }

        // Transition UI
        stateIdle.classList.add('hidden');
        stateResults.classList.add('hidden');
        stateProcessing.classList.remove('hidden');
        runBoardBtn.disabled = true;

        statusList.innerHTML = '';
        critiqueContainer.innerHTML = '';
        synthesisOutput.innerHTML = '';
        rawMasterOutput = '';

        try {
            // STEP 1: Spawn Parallel Persona Agents
            const activePersonas = Array.from(selectedCheckboxes).map(cb => {
                const key = cb.value;
                return { key, ...PERSONA_CONFIGS[key] };
            });

            const agentPromises = activePersonas.map(persona => {
                createStatusRow(persona.key, persona.name);

                const systemPrompt = `${persona.prompt}
You are reviewing the provided document. Be critical, specific, and format your output in clean Markdown. Provide 3-5 key points.`;

                return askLLM(provider, apiKey, model, systemPrompt, documentText)
                    .then(result => {
                        updateStatusRow(persona.key, 'Review Complete');
                        createCritiqueCard(persona.name, persona.icon, result);
                        return { name: persona.name, output: result };
                    })
                    .catch(err => {
                        updateStatusRow(persona.key, 'Failed', true);
                        createCritiqueCard(persona.name, persona.icon, `*Error generating critique: ${err.message}*`);
                        return { name: persona.name, output: `Error: ${err.message}` };
                    });
            });

            // Wait for all sub-agents
            const critiqueResults = await Promise.all(agentPromises);

            // STEP 2: Master Synthesis
            createStatusRow('master', 'Master Synthesizer');
            updateStatusRow('master', 'Synthesizing...', false);
            document.getElementById('status-text-master').className = 'status-working';
            document.getElementById('status-text-master').innerHTML = `Synthesizing... <i class="fa-solid fa-spinner fa-spin"></i>`;

            let compiledCritiques = critiqueResults.map(r => `### ${r.name} Feedback:\n${r.output}\n`).join('\n---\n');

            const synthesisPrompt = `You are the Master Orchestrator of an Executive Review Board.
The user submitted a document for review by several specialized experts. Below are their individual critiques.

Your task is to synthesize these critiques into a single, cohesive Executive Summary.
- Identify the most critical risks across all feedback.
- Highlight any conflicting feedback (e.g., Marketing wants X, but Legal says Y is risky).
- Provide a prioritized list of action items for the author.
Format strictly in beautiful Markdown.

RAW EXPERT CRITIQUES:
${compiledCritiques}`;

            rawMasterOutput = await askLLM(provider, apiKey, model, synthesisPrompt, "Synthesizing master report.");

            updateStatusRow('master', 'Synthesis Complete');

            // STEP 3: Render Final Dashboard
            synthesisOutput.innerHTML = marked.parse(rawMasterOutput);

            stateProcessing.classList.add('hidden');
            stateResults.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            alert(`Workflow Error: ${error.message}`);
            stateProcessing.classList.add('hidden');
            stateIdle.classList.remove('hidden');
        } finally {
            runBoardBtn.disabled = false;
        }
    }

    // --- API Integrations ---
    async function askLLM(provider, apiKey, model, systemPrompt, userMessage) {
        if (provider === 'openai') return await fetchOpenAI(apiKey, model, systemPrompt, userMessage);
        if (provider === 'anthropic') return await fetchAnthropic(apiKey, model, systemPrompt, userMessage);
        if (provider === 'ollama') return await fetchOllama(ollamaUrlInput.value.trim(), model, systemPrompt, userMessage);
    }

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
                temperature: 0.4
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
                max_tokens: 4096,
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                stream: false
            })
        });

        if (!response.ok) throw new Error('Ollama API Error. Ensure Ollama is running and CORS is enabled.');
        const data = await response.json();
        return data.message.content.trim();
    }
});
