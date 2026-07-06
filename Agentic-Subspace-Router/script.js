// Agentic Logic
async function routeSubspaceComm(nodes, fetchOpenAI, apiKey) {
    const prompt = `You are an AI Router. Evaluate these subspace nodes:
${JSON.stringify(nodes, null, 2)}
Return a JSON object: { "selectedPath": ["nodeId1", "nodeId2"], "estimatedEfficiency": 85 }. Maximize efficiency by avoiding high congestion. Reply ONLY with valid JSON.`;

    try {
        const response = await fetchOpenAI(
            apiKey,
            'gpt-3.5-turbo',
            'You are a network routing AI. Respond only in JSON.',
            prompt
        );

        let parsed = JSON.parse(response);
        return { success: true, route: parsed };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// DOM Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const routeBtn = document.getElementById('route-btn');
        const logList = document.getElementById('log-list');
        const nodesList = document.getElementById('nodes-list');
        const agentState = document.getElementById('agent-state');
        const efficiencyFill = document.getElementById('efficiency-fill');
        const efficiencyText = document.getElementById('efficiency-text');

        const mockNodes = [
            { id: 'Node-A', latency: 12, congestion: 10 },
            { id: 'Node-B', latency: 45, congestion: 80 },
            { id: 'Node-C', latency: 22, congestion: 30 }
        ];

        function logMsg(msg) {
            const li = document.createElement('li');
            li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logList.appendChild(li);
            logList.scrollTop = logList.scrollHeight;
        }

        function renderNodes(nodes) {
            nodesList.innerHTML = '';
            nodes.forEach(n => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${n.id}</span> <span>Latency: ${n.latency}ms | Congestion: ${n.congestion}%</span>`;
                nodesList.appendChild(li);
            });
        }

        renderNodes(mockNodes);

        routeBtn.addEventListener('click', async () => {
            routeBtn.disabled = true;
            agentState.textContent = 'Calculating Route...';
            document.querySelector('.status-dot').style.backgroundColor = 'var(--primary-color)';
            logMsg('Initiating pathfinding algorithm...');

            const mockFetch = async () => JSON.stringify({
                selectedPath: ['Node-A', 'Node-C'],
                estimatedEfficiency: 92
            });

            logMsg('Agent requesting LLM optimization...');

            const apiFunc = typeof window.fetchOpenAI !== 'undefined' ? window.fetchOpenAI : mockFetch;
            const result = await routeSubspaceComm(mockNodes, apiFunc, 'mock-key');

            if (result.success) {
                logMsg(`Optimal path found: ${result.route.selectedPath.join(' -> ')}`);
                efficiencyFill.style.width = `${result.route.estimatedEfficiency}%`;
                efficiencyText.textContent = `${result.route.estimatedEfficiency}%`;
                agentState.textContent = 'Route Established';
                document.querySelector('.status-dot').style.backgroundColor = 'var(--success-color)';
            } else {
                logMsg(`Error: ${result.error}`);
                agentState.textContent = 'Error';
                document.querySelector('.status-dot').style.backgroundColor = 'var(--danger-color)';
            }

            routeBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { routeSubspaceComm };
}
