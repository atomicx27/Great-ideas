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

async function spawnLogisticsAgent(apiKey, goal, logger) {
    logger("Initializing Logistics Planning...");
    await new Promise(r => setTimeout(r, 1100));
    logger("Analyzing spatial constraints and delivery routes...");

    const prompt = `Act as a Logistics AI Agent. Goal: "${goal}". Provide a 3-bullet summary on optimal facility placement and distribution routes.`;

    try {
        let res;
        if (typeof fetchOpenAI !== 'undefined') {
            res = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', prompt, "Analyze logistics.");
        } else {
            res = "- Repurpose abandoned industrial spaces near city limits\n- Utilize electric cargo bikes for last-mile delivery\n- Establish micro-hubs in high-density areas";
        }
        logger("Logistics plan finalized.");
        return res;
    } catch (e) {
        logger(`Error: ${e.message}`);
        return "Logistics planning failed.";
    }
}

async function spawnResourceAgent(apiKey, goal, logger) {
    logger("Initializing Resource Management Protocol...");
    await new Promise(r => setTimeout(r, 1400));
    logger("Calculating energy and water requirements...");

    const prompt = `Act as a Resource Management Agent. Goal: "${goal}". Provide a 2-bullet summary on minimizing energy and water footprint.`;

    try {
        let res;
        if (typeof fetchOpenAI !== 'undefined') {
            res = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', prompt, "Analyze resources.");
        } else {
            res = "- Implement closed-loop aeroponics saving 95% water\n- Integrate solar panels with localized battery storage to reduce grid peak load";
        }
        logger("Resource constraints modeled.");
        return res;
    } catch (e) {
        logger(`Error: ${e.message}`);
        return "Resource modeling failed.";
    }
}

async function spawnAgronomyAgent(apiKey, goal, logger) {
    logger("Initializing Agronomy Agent...");
    await new Promise(r => setTimeout(r, 1700));
    logger("Selecting optimal crop mixtures and LED spectrums...");

    const prompt = `Act as an Agronomy Agent. Goal: "${goal}". Provide a 2-bullet list of the optimal crop types to grow for maximum nutritional yield and profit.`;

    try {
        let res;
        if (typeof fetchOpenAI !== 'undefined') {
            res = await fetchOpenAI(apiKey, 'gpt-3.5-turbo', prompt, "Analyze agronomy.");
        } else {
            res = "- High-turnover microgreens (arugula, kale)\n- High-margin specialty herbs (basil, cilantro)";
        }
        logger("Agronomy strategy complete.");
        return res;
    } catch (e) {
        logger(`Error: ${e.message}`);
        return "Agronomy analysis failed.";
    }
}

async function orchestrateFarmNetwork(apiKey, goal, loggers) {
    const { master, logistics, resource, agronomy } = loggers;
    master("Parsing high-level objective...");
    master(`Goal: "${goal}"`);
    master("Spawning specialized sub-agents for Logistics, Resource Management, and Agronomy...");

    // Execute sub-agents in parallel
    const [logRes, resRes, agroRes] = await Promise.all([
        spawnLogisticsAgent(apiKey, goal, logistics),
        spawnResourceAgent(apiKey, goal, resource),
        spawnAgronomyAgent(apiKey, goal, agronomy)
    ]);

    master("All parallel tasks completed. Synthesizing executive network design...");

    const finalReport = `
## Executive Strategy: Vertical Farm Network Design

### 1. Supply Chain & Logistics
${logRes}

### 2. Resource Management
${resRes}

### 3. Agronomy & Crop Yield Strategy
${agroRes}
    `;

    master("Network design synthesis complete.");
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
        logistics: createLogger('logisticsLog'),
        resource: createLogger('resourceLog'),
        agronomy: createLogger('agronomyLog')
    };

    try {
        const markdown = await orchestrateFarmNetwork(apiKey, goal, loggers);

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
        orchestrateFarmNetwork,
        spawnLogisticsAgent,
        spawnResourceAgent,
        spawnAgronomyAgent
    };
}
