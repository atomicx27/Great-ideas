// Mock Customer Data
const CUSTOMERS = [
    { id: 'C1001', name: 'Alice Smith', plan: 'Unlimited Pro', monthsActive: 34, tickets: 0, overage: '$0.00', risk: 'low' },
    { id: 'C1002', name: 'Bob Jones', plan: 'Basic 5GB', monthsActive: 6, tickets: 4, overage: '$45.00', risk: 'high' },
    { id: 'C1003', name: 'Charlie Brown', plan: 'Family Share', monthsActive: 12, tickets: 2, overage: '$15.00', risk: 'medium' },
    { id: 'C1004', name: 'Diana Prince', plan: 'Basic 5GB', monthsActive: 2, tickets: 5, overage: '$60.00', risk: 'high' },
    { id: 'C1005', name: 'Evan Wright', plan: 'Unlimited Pro', monthsActive: 48, tickets: 1, overage: '$0.00', risk: 'low' },
];

let selectedCustomer = null;

// Settings State
const settings = {
    provider: 'ollama',
    apiKey: '',
    ollamaUrl: 'http://localhost:11434'
};

// UI Elements
const tbody = document.getElementById('customer-tbody');
const analysisPanel = document.getElementById('analysis-panel');
const settingsModal = document.getElementById('settings-modal');

// Init
function init() {
    renderTable();
    updateMetrics();
    setupEventListeners();
}

function renderTable() {
    tbody.innerHTML = '';
    CUSTOMERS.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.plan}</td>
            <td>${c.monthsActive}</td>
            <td>${c.tickets}</td>
            <td>${c.overage}</td>
            <td><span class="badge ${c.risk}">${c.risk.toUpperCase()}</span></td>
            <td><button class="btn primary" onclick="analyzeCustomer('${c.id}')">Analyze</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function updateMetrics() {
    document.getElementById('high-risk-count').innerText = CUSTOMERS.filter(c => c.risk === 'high').length;
    document.getElementById('med-risk-count').innerText = CUSTOMERS.filter(c => c.risk === 'medium').length;
    document.getElementById('low-risk-count').innerText = CUSTOMERS.filter(c => c.risk === 'low').length;
}

function setupEventListeners() {
    // Settings Modal
    document.getElementById('settings-btn').addEventListener('click', () => settingsModal.classList.remove('hidden'));
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal')?.classList.add('hidden');
            if(e.target.id === 'close-panel') analysisPanel.classList.add('hidden');
        });
    });

    // Provider Change
    document.getElementById('llm-provider').addEventListener('change', (e) => {
        const provider = e.target.value;
        const keyGroup = document.getElementById('api-key-group');
        const urlGroup = document.getElementById('ollama-url-group');

        if (provider === 'ollama') {
            keyGroup.classList.add('hidden');
            urlGroup.classList.remove('hidden');
        } else {
            keyGroup.classList.remove('hidden');
            urlGroup.classList.add('hidden');
        }
    });

    // Save Settings
    document.getElementById('save-settings').addEventListener('click', () => {
        settings.provider = document.getElementById('llm-provider').value;
        settings.apiKey = document.getElementById('api-key').value;
        settings.ollamaUrl = document.getElementById('ollama-url').value;
        settingsModal.classList.add('hidden');
    });

    // Generate Offer
    document.getElementById('generate-offer-btn').addEventListener('click', generateOffer);
}

window.analyzeCustomer = function(id) {
    selectedCustomer = CUSTOMERS.find(c => c.id === id);
    if (!selectedCustomer) return;

    document.getElementById('analysis-title').innerText = `Analyzing: ${selectedCustomer.name}`;
    document.getElementById('customer-details').innerHTML = `
        <strong>Plan:</strong> ${selectedCustomer.plan} <br>
        <strong>Tenure:</strong> ${selectedCustomer.monthsActive} months <br>
        <strong>Recent Issues:</strong> ${selectedCustomer.tickets} support tickets, ${selectedCustomer.overage} in data overages. <br>
        <strong>Risk Status:</strong> <span style="color: red;">${selectedCustomer.risk.toUpperCase()} RISK OF CHURN</span>
    `;

    document.getElementById('llm-result').classList.add('hidden');
    document.getElementById('offer-content').innerText = '';
    analysisPanel.classList.remove('hidden');

    // Scroll to panel
    analysisPanel.scrollIntoView({ behavior: 'smooth' });
};

async function generateOffer() {
    if (!selectedCustomer) return;

    const btn = document.getElementById('generate-offer-btn');
    const spinner = document.getElementById('loading-spinner');
    const resultDiv = document.getElementById('llm-result');
    const contentBox = document.getElementById('offer-content');

    btn.classList.add('hidden');
    spinner.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    const prompt = `You are a customer retention expert at a telecom company.
    Write a short, empathetic email to ${selectedCustomer.name}.
    They have been with us for ${selectedCustomer.monthsActive} months on the ${selectedCustomer.plan} plan.
    They are frustrated because they had ${selectedCustomer.tickets} recent support tickets and ${selectedCustomer.overage} in data overage charges.
    Offer them a customized retention deal (e.g. waiving fees, upgrading data for free) to prevent them from churning. Keep it under 150 words.`;

    try {
        let responseText = "";

        if (settings.provider === 'ollama') {
            responseText = await callOllama(prompt);
        } else if (settings.provider === 'openai') {
            responseText = await callOpenAI(prompt);
        } else {
            responseText = "Simulation: Provider not implemented in this demo. \n\nDear " + selectedCustomer.name + ",\nWe noticed you've had a tough time recently with overages. We value your loyalty. We are upgrading you to Unlimited Pro at no extra cost for 12 months. Let us know if you accept.";
        }

        contentBox.innerText = responseText;
        resultDiv.classList.remove('hidden');
    } catch (error) {
        contentBox.innerText = `Error generating offer: ${error.message}\n\nPlease check your API keys or ensure Ollama is running locally.`;
        resultDiv.classList.remove('hidden');
    } finally {
        spinner.classList.add('hidden');
        btn.classList.remove('hidden');
    }
}

// BYOK Integrations
async function callOllama(prompt) {
    // Note: requires Ollama to be running locally with CORS configured or proxy.
    const res = await fetch(`${settings.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3', // default model assumption
            prompt: prompt,
            stream: false
        })
    });
    if(!res.ok) throw new Error("Failed to connect to Ollama. Make sure it's running.");
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
            messages: [{ role: 'user', content: prompt }]
        })
    });
    if(!res.ok) throw new Error("Failed API call to OpenAI. Check your API key.");
    const data = await res.json();
    return data.choices[0].message.content;
}

init();
