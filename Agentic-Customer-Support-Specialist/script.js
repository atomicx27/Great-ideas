document.addEventListener('DOMContentLoaded', () => {
    // Settings UI
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettings = document.getElementById('close-settings');
    const settingsPanel = document.getElementById('settings-panel');
    const providerSelect = document.getElementById('llm-provider');
    const apiKeyContainer = document.getElementById('api-key-container');
    const ollamaUrlContainer = document.getElementById('ollama-url-container');

    settingsBtn.addEventListener('click', () => settingsPanel.classList.remove('hidden'));
    closeSettings.addEventListener('click', () => settingsPanel.classList.add('hidden'));

    providerSelect.addEventListener('change', (e) => {
        if (e.target.value === 'ollama') {
            apiKeyContainer.classList.add('hidden');
            ollamaUrlContainer.classList.remove('hidden');
        } else {
            apiKeyContainer.classList.remove('hidden');
            ollamaUrlContainer.classList.add('hidden');
        }
    });

    // Chat UI
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const thoughtContent = document.getElementById('thought-content');

    // Simulated Tools API
    const tools = {
        checkOrderStatus: (orderId) => {
            if (orderId === '12345') return "Status: Shipped. Expected delivery: Tomorrow.";
            if (orderId === '999') return "Status: Cancelled.";
            return "Order not found.";
        },
        issueRefund: (orderId) => {
            if (orderId === '999') return "Refund of $45.00 initiated successfully.";
            return "Cannot issue refund. Order must be cancelled first.";
        }
    };

    function appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;

        let icon = role === 'user' ? 'fa-user' : role === 'tool' ? 'fa-wrench' : 'fa-robot';

        msgDiv.innerHTML = `
            ${role !== 'tool' ? `<div class="avatar"><i class="fa-solid ${icon}"></i></div>` : ''}
            <div class="content">${text}</div>
        `;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Mock Agentic Loop (ReAct paradigm simulation)
    async function processUserRequest(text) {
        appendMessage('user', text);
        userInput.value = '';

        // Step 1: Think
        thoughtContent.innerText = "Analyzing user intent and checking if tools are needed...";
        await new Promise(r => setTimeout(r, 1000));

        if (text.includes("12345")) {
            // Step 2: Act (Tool Call)
            thoughtContent.innerText = "Intent identified: Order Tracking. Calling checkOrderStatus('12345')...";
            await new Promise(r => setTimeout(r, 1500));
            const toolResult = tools.checkOrderStatus('12345');
            appendMessage('tool', `[Tool Call] checkOrderStatus('12345') => ${toolResult}`);

            // Step 3: Synthesize
            thoughtContent.innerText = "Synthesizing final response based on tool output...";
            await new Promise(r => setTimeout(r, 1000));
            appendMessage('system', `I checked on your order #12345. It has shipped and is expected to be delivered tomorrow!`);

        } else if (text.toLowerCase().includes("refund") && text.includes("999")) {
            thoughtContent.innerText = "Intent identified: Refund. Calling issueRefund('999')...";
            await new Promise(r => setTimeout(r, 1500));
            const toolResult = tools.issueRefund('999');
            appendMessage('tool', `[Tool Call] issueRefund('999') => ${toolResult}`);

            thoughtContent.innerText = "Synthesizing final response...";
            await new Promise(r => setTimeout(r, 1000));
            appendMessage('system', `I have successfully initiated a refund of $45.00 for order #999.`);
        } else {
            thoughtContent.innerText = "No tools required. Generating direct response.";
            await new Promise(r => setTimeout(r, 1000));
            appendMessage('system', "I'm a demo agent. Please ask me about order #12345 or ask for a refund for order #999 to see my tool usage in action!");
        }

        thoughtContent.innerText = "Waiting for input...";
    }

    sendBtn.addEventListener('click', () => {
        if (userInput.value.trim()) processUserRequest(userInput.value.trim());
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && userInput.value.trim()) processUserRequest(userInput.value.trim());
    });
});