document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const providerSelect = document.getElementById('llm-provider');
    const apiKeyInput = document.getElementById('api-key');
    const modelInput = document.getElementById('model-name');
    const ollamaUrlContainer = document.getElementById('ollama-url-container');
    const ollamaUrlInput = document.getElementById('ollama-url');

    const goalInput = document.getElementById('goal-input');
    const startSwarmBtn = document.getElementById('start-swarm-btn');

    const swarmUI = document.getElementById('swarm-ui');
    const orchestratorStatus = document.getElementById('orchestrator-status');
    const orchestratorNode = document.querySelector('.orchestrator-node');
    const subAgentsContainer = document.getElementById('sub-agents-container');

    const finalOutputContainer = document.getElementById('final-output-container');
    const outputContent = document.getElementById('output-content');
    const copyBtn = document.getElementById('copy-btn');

    let rawMarkdownOutput = '';

    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('agiSwarmSettings')) || {};
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

    copyBtn.addEventListener('click', () => {
        if (rawMarkdownOutput) {
            navigator.clipboard.writeText(rawMarkdownOutput);
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
        }
    });

    startSwarmBtn.addEventListener('click', executeSwarmWorkflow);

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
            if(provider === 'anthropic' && !modelInput.value.includes('claude')) modelInput.value = 'claude-3-5-sonnet-20240620';
        }
    }

    function saveSettings() {
        const settings = {
            provider: providerSelect.value,
            apiKey: apiKeyInput.value,
            modelName: modelInput.value,
            ollamaUrl: ollamaUrlInput.value
        };
        localStorage.setItem('agiSwarmSettings', JSON.stringify(settings));
    }

    function createSubAgentNode(id, title, task) {
        const node = document.createElement('div');
        node.className = 'sub-agent-node processing';
        node.id = `agent-${id}`;

        const header = document.createElement('div');
        header.className = 'agent-header';

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-gear agent-icon';

        const h5 = document.createElement('h5');
        h5.className = 'agent-title';
        h5.textContent = title;

        header.appendChild(icon);
        header.appendChild(h5);

        const pTask = document.createElement('p');
        pTask.className = 'agent-task';
        pTask.textContent = task;

        const pStatus = document.createElement('p');
        pStatus.className = 'agent-status';
        pStatus.id = `status-${id}`;
        pStatus.textContent = 'Executing...';

        node.appendChild(header);
        node.appendChild(pTask);
        node.appendChild(pStatus);

        subAgentsContainer.appendChild(node);
        return node;
    }

    function updateSubAgentStatus(id, statusText, isDone = false) {
        const statusEl = document.getElementById(`status-${id}`);
        const nodeEl = document.getElementById(`agent-${id}`);
        if (statusEl) statusEl.textContent = statusText;
        if (isDone && nodeEl) {
            nodeEl.classList.remove('processing');
            nodeEl.classList.add('done');
            nodeEl.querySelector('.agent-icon').classList.replace('fa-gear', 'fa-check');
        }
    }

    // --- SWARM WORKFLOW ---
    async function executeSwarmWorkflow() {
        const goal = goalInput.value.trim();
        if (!goal) {
            alert('Please enter an overarching goal.');
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
        startSwarmBtn.disabled = true;
        swarmUI.classList.remove('hidden');
        finalOutputContainer.classList.add('hidden');
        subAgentsContainer.innerHTML = '';
        outputContent.innerHTML = '';
        rawMarkdownOutput = '';

        orchestratorNode.classList.add('processing');
        orchestratorStatus.textContent = 'Decomposing goal into parallel sub-tasks...';

        try {
            // STEP 1: Orchestrator Decomposes Goal
            const planPrompt = `You are a Master Orchestrator AGI. The user has provided an overarching goal: "${goal}".
Break this goal down into EXACTLY 3 distinct, highly focused sub-tasks that can be executed in parallel by specialized sub-agents.

You must respond ONLY with a valid JSON array of objects. Do not include markdown formatting or backticks.
Format:
[
  {"title": "Agent 1 Role", "task": "Specific instructions for Agent 1"},
  {"title": "Agent 2 Role", "task": "Specific instructions for Agent 2"},
  {"title": "Agent 3 Role", "task": "Specific instructions for Agent 3"}
]`;

            const rawPlan = await askLLM(provider, apiKey, model, planPrompt, "Extract JSON task list.");

            // Try to parse JSON (strip markdown if LLM included it despite instructions)
            let taskList = [];
            try {
                let cleanJson = rawPlan.replace(/```json/gi, '').replace(/```/gi, '').trim();
                taskList = JSON.parse(cleanJson);
                if (!Array.isArray(taskList)) throw new Error("Not an array");
            } catch (e) {
                console.error("Failed to parse JSON plan:", rawPlan);
                throw new Error("Master Orchestrator failed to output valid JSON. Please try again.");
            }

            orchestratorStatus.textContent = `Goal decomposed into ${taskList.length} tasks. Spawning swarm...`;

            // STEP 2: Execute Swarm in Parallel
            const agentPromises = taskList.map((taskItem, index) => {
                createSubAgentNode(index, taskItem.title, taskItem.task);

                const agentPrompt = `You are an expert, highly specialized AI agent assigned the role of "${taskItem.title}".
Your overarching context is the main goal: "${goal}".
Your specific, assigned task to complete is: "${taskItem.task}".

Execute your task comprehensively. Provide detailed, well-formatted markdown output. Do not write intro/outro fluff, just deliver the work.`;

                // Return a promise that resolves with the agent's output
                return askLLM(provider, apiKey, model, agentPrompt, "You are a specialized sub-agent executing a specific task.")
                    .then(result => {
                        updateSubAgentStatus(index, 'Task Complete', true);
                        return { title: taskItem.title, output: result };
                    })
                    .catch(err => {
                        updateSubAgentStatus(index, `Error: ${err.message}`, true);
                        return { title: taskItem.title, output: `*Agent failed: ${err.message}*` };
                    });
            });

            // Wait for all sub-agents to finish simultaneously
            const swarmResults = await Promise.all(agentPromises);

            // STEP 3: Synthesis
            orchestratorStatus.textContent = 'Swarm execution complete. Synthesizing final master document...';

            let compiledContext = swarmResults.map(r => `### From ${r.title}:\n${r.output}\n`).join('\n---\n');

            const synthesisPrompt = `You are the Master Orchestrator AGI. You assigned sub-agents to complete parts of this overarching goal: "${goal}".
Below are the raw outputs from your swarm of sub-agents.
Your job is to synthesize these outputs into a single, cohesive, highly professional master document.
Format the document beautifully using Markdown. Add a strong executive summary at the top, and logically organize the rest of the content.

RAW SUB-AGENT OUTPUTS:
${compiledContext}`;

            const finalDocument = await askLLM(provider, apiKey, model, synthesisPrompt, "Synthesize inputs into a master document.");

            orchestratorNode.classList.remove('processing');
            orchestratorStatus.textContent = 'Workflow Complete.';

            // Render Output
            rawMarkdownOutput = finalDocument;
            const dirtyHTML = marked.parse(finalDocument);
            outputContent.innerHTML = DOMPurify.sanitize(dirtyHTML);
            finalOutputContainer.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            orchestratorNode.classList.remove('processing');
            orchestratorStatus.textContent = `Error: ${error.message}`;
        } finally {
            startSwarmBtn.disabled = false;
        }
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
            throw new Error('Ollama API Error. Ensure Ollama is running and CORS is enabled.');
        }

        const data = await response.json();
        return data.message.content.trim();
    }
});
