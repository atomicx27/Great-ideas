function createLogger(elementId) {
    const el = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
    return (msg) => {
        if (!el) return;
        if (el.textContent === 'Waiting...') el.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = `> ${msg}`;
        el.appendChild(p);
        el.scrollTop = el.scrollHeight;
    };
}

async function spawnThreatIntelAgent(apiKey, goal, logger) {
    logger("Initializing Threat Intel Analysis...");
    await new Promise(r => setTimeout(r, 1000));
    logger("Scanning social networks for anomaly signatures...");

    const prompt = `Act as a Threat Intelligence Agent. The overall goal is: "${goal}". Generate a concise 3-bullet list of likely origin points or distribution nodes for the deepfake campaign.`;

    try {
        let res;
        if (typeof fetchOpenAI !== 'undefined') {
            res = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', prompt, "Analyze the threat landscape.");
        } else {
            res = "- Suspicious bot network on Platform X\n- Unverified video sharing channels\n- Known disinformation forums";
        }
        logger("Threat Intel report generated.");
        return res;
    } catch (e) {
        logger(`Error: ${e.message}`);
        return "Threat Intel Failed.";
    }
}

async function spawnTakedownAgent(apiKey, goal, logger) {
    logger("Initializing Takedown Protocol Agent...");
    await new Promise(r => setTimeout(r, 1200));
    logger("Drafting automated DMCA/Terms of Service notices...");

    const prompt = `Act as a Takedown Operations Agent. The overall goal is: "${goal}". Generate a short template for a legal/policy takedown notice for the malicious content.`;

    try {
        let res;
        if (typeof fetchOpenAI !== 'undefined') {
            res = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', prompt, "Draft the takedown strategy.");
        } else {
            res = "Subject: Urgent Takedown Request - Synthetic Media Violation\nWe demand immediate removal of content ID [X] due to severe violations of synthetic media policies.";
        }
        logger("Takedown templates drafted.");
        return res;
    } catch (e) {
        logger(`Error: ${e.message}`);
        return "Takedown Ops Failed.";
    }
}

async function spawnCounterMessagingAgent(apiKey, goal, logger) {
    logger("Initializing Counter-Messaging Agent...");
    await new Promise(r => setTimeout(r, 1500));
    logger("Analyzing narrative counter-strategies...");

    const prompt = `Act as a PR/Counter-Messaging Agent. The overall goal is: "${goal}". Generate a 2-sentence public statement clarifying the authenticity of the situation to mitigate panic.`;

    try {
        let res;
        if (typeof fetchOpenAI !== 'undefined') {
            res = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', prompt, "Draft the counter-message.");
        } else {
            res = "We are aware of manipulated synthetic videos circulating online. Please rely on official channels for verified, authentic information regarding this matter.";
        }
        logger("Counter-messaging statement prepared.");
        return res;
    } catch (e) {
        logger(`Error: ${e.message}`);
        return "Counter-messaging Failed.";
    }
}

async function orchestrateDefense(apiKey, goal, loggers) {
    const { master, intel, takedown, messaging } = loggers;
    master("Parsing high-level objective...");
    master(`Goal: "${goal}"`);
    master("Breaking down goal and spawning specialized sub-agents in parallel...");

    // Execute sub-agents in parallel
    const [intelResult, takedownResult, messagingResult] = await Promise.all([
        spawnThreatIntelAgent(apiKey, goal, intel),
        spawnTakedownAgent(apiKey, goal, takedown),
        spawnCounterMessagingAgent(apiKey, goal, messaging)
    ]);

    master("All sub-agent tasks completed. Synthesizing executive strategy...");

    const finalReport = `
## Executive Strategy: Deepfake Defense Campaign

### 1. Threat Intelligence
${intelResult}

### 2. Takedown Operations
${takedownResult}

### 3. Public Counter-Messaging
${messagingResult}
    `;

    master("Synthesis complete. Operations proceeding.");
    return finalReport;
}

async function startOrchestration() {
    const apiKey = document.getElementById('apiKey').value;
    const goal = document.getElementById('highLevelGoal').value;
    const dashboard = document.getElementById('dashboard');
    const finalDiv = document.getElementById('finalOutput');

    if (!apiKey || !goal) {
        alert("Please provide both an API Key and a High-Level Objective.");
        return;
    }

    dashboard.classList.remove('hidden');
    finalDiv.innerHTML = '<p>Synthesizing...</p>';

    const loggers = {
        master: createLogger('masterLog'),
        intel: createLogger('intelLog'),
        takedown: createLogger('takedownLog'),
        messaging: createLogger('messagingLog')
    };

    try {
        const markdown = await orchestrateDefense(apiKey, goal, loggers);

        if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
            finalDiv.innerHTML = DOMPurify.sanitize(marked.parse(markdown));
        } else {
            finalDiv.textContent = markdown;
        }
    } catch (error) {
        finalDiv.innerHTML = `<p style="color: red;">Orchestration failed: ${error.message}</p>`;
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('orchestrateBtn').addEventListener('click', startOrchestration);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        orchestrateDefense,
        spawnThreatIntelAgent,
        spawnTakedownAgent,
        spawnCounterMessagingAgent
    };
}
