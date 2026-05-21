// Agentic Material Discoverer - Autonomous Agent Loop

// Mocked tools for the agent to use
const Tools = {
    searchDatabase: async (query) => {
        return `DB_RESULT: Found existing materials matching "${query}": Graphene, Boron Nitride, Carbon Nanotubes.`;
    },
    simulateProperties: async (materialStructure) => {
        return `SIMULATION_RESULT: Material [${materialStructure}] shows predicted thermal conductivity of 4000 W/mK and high tensile strength.`;
    },
    checkToxicity: async (materialStructure) => {
        return `TOXICITY_RESULT: Material [${materialStructure}] indicates low toxicity, safe for manufacturing.`;
    }
};

class MaterialDiscovererAgent {
    constructor(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
        this.thoughtLog = [];
        this.toolLog = [];
    }

    logTool(toolName, input, result) {
        this.toolLog.push({ tool: toolName, input, result });
        if (typeof document !== 'undefined') {
            const list = document.getElementById('tools-log');
            const li = document.createElement('li');
            li.textContent = `> ${toolName}("${input}")\n${result.substring(0, 50)}...`;
            list.appendChild(li);
            list.scrollTop = list.scrollHeight;
        }
    }

    logThought(thought) {
        this.thoughtLog.push(thought);
        if (typeof document !== 'undefined') {
            const div = document.getElementById('thought-log');
            div.textContent += `\n[THOUGHT] ${thought}\n`;
            div.scrollTop = div.scrollHeight;
        }
    }

    updateState(state, isDone = false) {
        if (typeof document !== 'undefined') {
            const stateEl = document.getElementById('agent-state');
            stateEl.textContent = state;
            if (isDone) {
                stateEl.className = 'state-done';
                document.getElementById('loader').classList.remove('active');
            } else {
                stateEl.className = 'state-thinking';
            }
        }
    }

    async run(targetProperties) {
        this.updateState('Analyzing goal...');
        this.logThought(`Goal received: Find material with properties: ${targetProperties}. Initiating ReAct loop.`);

        // Simulating Agentic Loop
        // Step 1: Search
        this.updateState('Using Tool: searchDatabase');
        await new Promise(r => setTimeout(r, 1000));
        let searchRes = await Tools.searchDatabase(targetProperties);
        this.logTool('searchDatabase', targetProperties, searchRes);
        this.logThought(`Database search returned carbon-based structures. I should design a novel composite based on these findings.`);

        // Step 2: Simulate
        this.updateState('Using Tool: simulateProperties');
        await new Promise(r => setTimeout(r, 1000));
        let struct = 'Graphene-Boron Nitride Hybrid Layer';
        let simRes = await Tools.simulateProperties(struct);
        this.logTool('simulateProperties', struct, simRes);
        this.logThought(`Simulation successful. Thermal conductivity meets requirements. Need to verify safety next.`);

        // Step 3: Toxicity check
        this.updateState('Using Tool: checkToxicity');
        await new Promise(r => setTimeout(r, 1000));
        let toxRes = await Tools.checkToxicity(struct);
        this.logTool('checkToxicity', struct, toxRes);
        this.logThought(`Toxicity check passed. Gathering data to generate final report.`);

        this.updateState('Synthesizing Report...');

        // Construct prompt for the LLM
        const prompt = `
            You are an expert Materials Science AI. You have been tasked with discovering a material with the following properties: "${targetProperties}".
            You performed the following steps:
            1. Searched database: ${searchRes}
            2. Simulated properties for ${struct}: ${simRes}
            3. Checked toxicity: ${toxRes}

            Write a concise, markdown-formatted final discovery report summarizing the new material design, its predicted properties, and manufacturing viability.
        `;

        let finalReport = "";
        try {
            // Use the shared llm-api.js fetchLLMResponse if available in browser, else fallback for node tests
            if (typeof fetchLLMResponse === 'function') {
                finalReport = await fetchLLMResponse(prompt, this.provider, this.apiKey);
            } else {
                finalReport = "## Discovery Report\n\n**Material:** " + struct + "\n\n**Properties:** High thermal conductivity, safe for manufacturing.";
            }
        } catch (error) {
            console.error("LLM Error:", error);
            finalReport = "## Discovery Report (Fallback)\n\nAn error occurred while contacting the LLM. \n\n**Proposed Material:** " + struct + "\n\n**Predicted Properties:** High thermal conductivity.\n\n**Safety:** Low toxicity.";
        }

        this.updateState('Task Complete', true);
        return finalReport;
    }
}

async function startDiscovery() {
    if (typeof document === 'undefined') return;

    const btn = document.getElementById('start-btn');
    const targetProperties = document.getElementById('target-properties').value;
    const provider = document.getElementById('provider').value;
    const apiKey = document.getElementById('api-key').value;

    btn.disabled = true;
    document.getElementById('agent-workspace').classList.remove('hidden');
    document.getElementById('results-panel').classList.add('hidden');
    document.getElementById('loader').classList.add('active');
    document.getElementById('tools-log').innerHTML = '';
    document.getElementById('thought-log').innerHTML = '';

    const agent = new MaterialDiscovererAgent(provider, apiKey);
    const reportMarkdown = await agent.run(targetProperties);

    // Render markdown safely
    const finalReportDiv = document.getElementById('final-report');
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
        finalReportDiv.innerHTML = DOMPurify.sanitize(marked.parse(reportMarkdown));
    } else {
        finalReportDiv.textContent = reportMarkdown;
    }

    document.getElementById('results-panel').classList.remove('hidden');
    btn.disabled = false;
}

if (typeof document !== 'undefined') {
    document.getElementById('start-btn').addEventListener('click', startDiscovery);
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MaterialDiscovererAgent,
        Tools
    };
}