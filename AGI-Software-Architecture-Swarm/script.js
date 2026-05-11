document.addEventListener('DOMContentLoaded', () => {
    const providerSelect = document.getElementById('provider-select');
    const apiKeyGroup = document.getElementById('api-key-group');
    const modelGroup = document.getElementById('model-group');
    const runBtn = document.getElementById('run-swarm-btn');
    const orchestratorView = document.getElementById('orchestrator-view');
    const agentsGrid = document.getElementById('agents-grid');
    const finalOutput = document.getElementById('final-output');
    const goalPrompt = document.getElementById('goal-prompt');

    // UI Logic for Provider Selection
    providerSelect.addEventListener('change', (e) => {
        if (e.target.value === 'ollama') {
            apiKeyGroup.style.display = 'none';
            modelGroup.style.display = 'block';
        } else {
            apiKeyGroup.style.display = 'block';
            modelGroup.style.display = 'none';
        }
    });

    const subAgents = [
        { id: 'frontend', name: 'Frontend Architect', icon: 'fa-desktop', type: 'frontend', role: 'Focus on UI framework, state management, and real-time client connections (WebSockets).' },
        { id: 'backend', name: 'Backend Architect', icon: 'fa-server', type: 'backend', role: 'Focus on API design, microservices vs monolith, scalability, and connection handling.' },
        { id: 'database', name: 'Database Architect', icon: 'fa-database', type: 'database', role: 'Focus on data schema, storage solutions, caching layers (Redis), and read/write optimization.' }
    ];

    function createAgentCard(agent) {
        const card = document.createElement('div');
        card.className = `agent-card ${agent.type}`;
        card.id = `card-${agent.id}`;
        card.innerHTML = `
            <div class="agent-header">
                <i class="fa-solid ${agent.icon}"></i> ${agent.name}
            </div>
            <div class="agent-status" id="status-${agent.id}">Waiting for assignment...</div>
            <div class="agent-output" id="output-${agent.id}"></div>
        `;
        agentsGrid.appendChild(card);
    }

    // Simulated API Call
    async function simulateLLMCall(systemPrompt, userPrompt, delay = 2000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let response = "";
                if (systemPrompt.includes('UI framework')) {
                    response = "1. **Framework:** React.js for component reusability.\n2. **State Management:** Redux Toolkit to handle complex chat state.\n3. **Real-time:** Use `Socket.io-client` for persistent WebSocket connections to the backend.";
                } else if (systemPrompt.includes('API design')) {
                    response = "1. **Architecture:** Microservices (Auth, Chat, User).\n2. **Protocol:** REST for standard CRUD, WebSockets for message delivery.\n3. **Scaling:** Node.js horizontal scaling using Kubernetes and a load balancer.";
                } else if (systemPrompt.includes('data schema')) {
                    response = "1. **Primary DB:** PostgreSQL for structured user and channel data.\n2. **Message Store:** MongoDB or Cassandra for high-write volume message history.\n3. **Caching:** Redis for caching user presence and recent messages to reduce DB load.";
                } else if (systemPrompt.includes('Master Orchestrator')) {
                    response = `### Software Architecture Document

Based on the swarm analysis for the requirement: *"${JSON.parse(userPrompt).goal}"*

**1. Frontend Layer**
*   **React.js** with **Redux Toolkit**.
*   Real-time communication handled via **Socket.io**.

**2. Backend Layer**
*   **Node.js Microservices** (Auth, Chat, Presence).
*   API Gateway routing REST requests and managing WebSocket connections.
*   Scaled via Kubernetes.

**3. Data Layer**
*   **PostgreSQL**: User profiles, workspaces, and channel metadata.
*   **MongoDB**: Horizontally scalable document store for high-velocity chat messages.
*   **Redis**: In-memory cache for user presence (online/offline status) and pub/sub message brokering between Node instances.

*This architecture guarantees high availability and low latency for 10,000+ concurrent users.*`;
                }
                resolve(response);
            }, delay + Math.random() * 2000);
        });
    }

    runBtn.addEventListener('click', async () => {
        const goal = goalPrompt.value;
        const provider = providerSelect.value;

        // Reset UI
        orchestratorView.classList.remove('hidden');
        agentsGrid.innerHTML = '';
        finalOutput.innerHTML = 'Master Orchestrator is assigning architectural tasks... <i class="fa-solid fa-spinner spinner"></i>';
        runBtn.disabled = true;

        subAgents.forEach(agent => createAgentCard(agent));

        try {
            // Spawn sub-agents in parallel
            const agentPromises = subAgents.map(async (agent) => {
                const statusEl = document.getElementById(`status-${agent.id}`);
                const outputEl = document.getElementById(`output-${agent.id}`);

                statusEl.innerHTML = `Designing ${agent.type} layer... <i class="fa-solid fa-spinner spinner"></i>`;

                // Simulate BYOK API call
                const response = await simulateLLMCall(agent.role, goal);

                // Secure DOM update
                statusEl.innerHTML = `<span style="color: green;">Design Complete <i class="fa-solid fa-check"></i></span>`;
                const rawHtml = marked.parse(response);
                outputEl.innerHTML = DOMPurify.sanitize(rawHtml);

                return { name: agent.name, response: response };
            });

            // Wait for all sub-agents to finish
            const agentResults = await Promise.all(agentPromises);

            finalOutput.innerHTML = 'All architectural layers designed. Synthesizing final document... <i class="fa-solid fa-spinner spinner"></i>';

            // Master Orchestrator Synthesis
            const synthesisPrompt = `You are the Master Orchestrator (Lead Architect). Synthesize the following expert inputs into a cohesive architecture document.`;
            const payload = JSON.stringify({ goal: goal, agentData: agentResults });
            const finalResult = await simulateLLMCall(synthesisPrompt, payload, 3000);

            // Secure DOM update using Markdown and DOMPurify
            const finalHtml = marked.parse(finalResult);
            finalOutput.innerHTML = DOMPurify.sanitize(finalHtml);

        } catch (error) {
            finalOutput.textContent = `Error during swarm execution: ${error}`;
        } finally {
            runBtn.disabled = false;
        }
    });
});