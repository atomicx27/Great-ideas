// Mock Alert Data
const ALERTS = [
    { id: 'INC-9901', severity: 'critical', title: 'Multiple Failed Root Logins on Core Telecom Switch', target: 'switch-core-east.internal', timestamp: '10:42:01 UTC' },
    { id: 'INC-9902', severity: 'high', title: 'Unusual Egress Traffic Volume', target: 'cloud-db-cluster-04', timestamp: '10:38:15 UTC' },
    { id: 'INC-9903', severity: 'critical', title: 'Ransomware IOC Detected in VM Cluster', target: 'vm-host-alpha', timestamp: '10:35:00 UTC' }
];

let selectedAlert = null;
const settings = { provider: 'ollama', apiKey: '', ollamaUrl: 'http://localhost:11434' };

// DOM Elements
const alertsList = document.getElementById('alerts-list');
const orchestratorPanel = document.getElementById('orchestrator-panel');
const settingsModal = document.getElementById('settings-modal');

function init() {
    renderAlerts();
    setupEventListeners();
}

function renderAlerts() {
    alertsList.innerHTML = '';
    ALERTS.forEach(alert => {
        const li = document.createElement('li');
        li.className = `alert-item ${alert.severity}`;
        li.innerHTML = `
            <h4>${alert.id}: ${alert.title}</h4>
            <p>Target: ${alert.target} | Time: ${alert.timestamp}</p>
        `;
        li.addEventListener('click', () => loadIncident(alert));
        alertsList.appendChild(li);
    });
}

function setupEventListeners() {
    document.getElementById('settings-btn').addEventListener('click', () => settingsModal.classList.remove('hidden'));
    document.querySelectorAll('.close-btn').forEach(b => b.addEventListener('click', () => settingsModal.classList.add('hidden')));
    document.getElementById('close-panel').addEventListener('click', () => orchestratorPanel.classList.add('hidden'));

    document.getElementById('llm-provider').addEventListener('change', (e) => {
        const val = e.target.value;
        document.getElementById('api-key-group').classList.toggle('hidden', val === 'ollama');
        document.getElementById('ollama-url-group').classList.toggle('hidden', val !== 'ollama');
    });

    document.getElementById('save-settings').addEventListener('click', () => {
        settings.provider = document.getElementById('llm-provider').value;
        settings.apiKey = document.getElementById('api-key').value;
        settings.ollamaUrl = document.getElementById('ollama-url').value;
        settingsModal.classList.add('hidden');
    });

    document.getElementById('trigger-swarm-btn').addEventListener('click', executeSwarm);
}

function loadIncident(alert) {
    selectedAlert = alert;
    document.getElementById('incident-title').innerText = `Analyzing Incident: ${alert.id}`;

    // Reset UI state
    document.getElementById('trigger-swarm-btn').classList.remove('hidden');
    document.getElementById('final-report').classList.add('hidden');
    document.getElementById('report-content').innerText = '';

    ['intel', 'forensics', 'containment'].forEach(agent => {
        const el = document.getElementById(`agent-${agent}`);
        el.className = 'node sub-agent pending';
    });

    orchestratorPanel.classList.remove('hidden');
}

async function executeSwarm() {
    if(!selectedAlert) return;

    document.getElementById('trigger-swarm-btn').classList.add('hidden');
    const reportContent = document.getElementById('report-content');

    // Simulate parallel agents waking up
    const agents = ['intel', 'forensics', 'containment'];
    agents.forEach(agent => {
        document.getElementById(`agent-${agent}`).className = 'node sub-agent active';
    });

    // We will build the final prompt representing the master synthesis
    const prompt = `You are the Master Orchestrator for a Telecom Security Operations Center (SOC).
    An incident occurred: ${selectedAlert.title} on target ${selectedAlert.target}.
    You dispatched 3 sub-agents to investigate logs in parallel.

    Synthesize an Executive Report and Containment Playbook based on this. Keep it brief, professional, and formatted in Markdown.
    Include sections: Summary, Threat Intel Findings, Forensics Findings, Recommended Containment Steps.`;

    try {
        // Simulate time taken by parallel agents processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        let responseText = "";
        if(settings.provider === 'ollama') {
            responseText = await callOllama(prompt);
        } else if(settings.provider === 'openai') {
            responseText = await callOpenAI(prompt);
        } else if(settings.provider === 'anthropic') {
            responseText = await callAnthropic(prompt);
        } else {
            responseText = "Simulation Mode (No API Key):\n\n[CONFIDENTIAL SOC REPORT]\nIncident: " + selectedAlert.id + "\n\nSummary: Parallel analysis confirms coordinated brute force attempt on " + selectedAlert.target + ".\n\nIntel Agent: IPs originate from known bulletproof hosting (ASN 12345).\nForensics Agent: No successful authentications detected. Firewall logs show heavy volumetric traffic.\nContainment Agent Playbook:\n1. Apply temporary geo-block or ASN null-route.\n2. Rotate root keys on target switch.\n3. Escalate to Tier 3 network team.";
        }

        // Set agents to complete
        agents.forEach(agent => {
            document.getElementById(`agent-${agent}`).className = 'node sub-agent complete';
        });

        reportContent.innerText = responseText;
        document.getElementById('final-report').classList.remove('hidden');

    } catch (error) {
        agents.forEach(agent => {
            document.getElementById(`agent-${agent}`).className = 'node sub-agent pending';
        });
        reportContent.innerText = `Error orchestrating swarm: ${error.message}\nCheck your API settings.`;
        document.getElementById('final-report').classList.remove('hidden');
        document.getElementById('trigger-swarm-btn').classList.remove('hidden');
    }
}

// API Calls
async function callOllama(prompt) {
    const res = await fetch(`${settings.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama3', prompt: prompt, stream: false })
    });
    if(!res.ok) throw new Error("Failed to connect to Ollama.");
    const data = await res.json();
    return data.response;
}

async function callOpenAI(prompt) {
    if(!settings.apiKey) throw new Error("API Key is missing for OpenAI.");
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: 'You are an AGI security orchestrator.' }, { role: 'user', content: prompt }]
        })
    });
    if(!res.ok) throw new Error("API Call failed.");
    const data = await res.json();
    return data.choices[0].message.content;
}

init();

async function callAnthropic(prompt) {
    if(!settings.apiKey) throw new Error("API Key is missing for Anthropic.");
    // This is a basic mock since Anthropic requires CORS proxying in browser typically,
    // but we add it to complete the requested logic.
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': settings.apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    if(!res.ok) throw new Error("API Call failed for Anthropic.");
    const data = await res.json();
    return data.content[0].text;
}
