document.addEventListener('DOMContentLoaded', () => {
    const providerSelect = document.getElementById('provider-select');
    const apiKeyGroup = document.getElementById('api-key-group');
    const modelGroup = document.getElementById('model-group');
    const runBtn = document.getElementById('run-agent-btn');
    const outputLog = document.getElementById('output-log');

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

    // Logging Utility
    function appendLog(message, type = 'log-info') {
        const p = document.createElement('p');
        p.className = type;
        // Basic sanitization
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        outputLog.appendChild(p);
        outputLog.scrollTop = outputLog.scrollHeight;
    }

    // Simulated Tools
    const tools = {
        checkInventory: async () => {
            appendLog('Executing Tool: checkInventory()', 'log-action');
            return new Promise(resolve => setTimeout(() => resolve(
                JSON.stringify({ "Laptops": 2, "Monitors": 15, "Chairs": 4 })
            ), 1000));
        },
        checkSupplierPrices: async (item) => {
            appendLog(`Executing Tool: checkSupplierPrices("${item}")`, 'log-action');
            return new Promise(resolve => setTimeout(() => {
                if (item === 'Laptops') {
                    resolve(JSON.stringify({ "SupplierA": "$1200", "SupplierB": "$1150", "SupplierC": "$1250" }));
                } else {
                    resolve(JSON.stringify({ "SupplierA": "Price unavailable" }));
                }
            }, 1000));
        },
        placeOrder: async (item, supplier, quantity) => {
            appendLog(`Executing Tool: placeOrder("${item}", "${supplier}", ${quantity})`, 'log-action');
            return new Promise(resolve => setTimeout(() => resolve(
                `Successfully ordered ${quantity} ${item}(s) from ${supplier}. Order ID: #ORD-${Math.floor(Math.random()*10000)}`
            ), 1000));
        }
    };

    // Agent Simulation Logic
    runBtn.addEventListener('click', async () => {
        const provider = providerSelect.value;
        const task = document.getElementById('task-prompt').value;

        outputLog.innerHTML = ''; // Clear previous log
        appendLog(`Starting Agentic Process. Provider: ${provider.toUpperCase()}`, 'log-info');
        appendLog(`Goal: ${task}`, 'log-info');
        runBtn.disabled = true;

        try {
            // Simulated Agent Loop (In a real app, this would involve API calls to LLMs with tool schemas)

            appendLog('Thinking: I need to check current stock levels first.', 'log-thought');
            const inventory = await tools.checkInventory();
            appendLog(`Observation: Inventory levels are: ${inventory}`, 'log-info');

            appendLog('Thinking: Laptops are very low (2 left). I need to reorder them. I should check prices to find the cheapest.', 'log-thought');
            const prices = await tools.checkSupplierPrices('Laptops');
            appendLog(`Observation: Laptop prices: ${prices}`, 'log-info');

            appendLog('Thinking: SupplierB is the cheapest at $1150. I will order 5 laptops from them.', 'log-thought');
            const orderResult = await tools.placeOrder('Laptops', 'SupplierB', 5);
            appendLog(`Observation: ${orderResult}`, 'log-success');

            appendLog('Thinking: Task complete. Inventory replenished optimally.', 'log-thought');
            appendLog('Agent Finished.', 'log-success');

        } catch (error) {
            appendLog(`Error during agent execution: ${error}`, 'log-error');
        } finally {
            runBtn.disabled = false;
        }
    });
});