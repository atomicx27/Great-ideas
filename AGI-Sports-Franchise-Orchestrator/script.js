// AGI Sports Franchise Orchestrator - Multi-Agent System

class SubAgent {
    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.logData = [];
    }

    log(message) {
        this.logData.push(message);
        if (typeof document !== 'undefined') {
            const logContainer = document.getElementById(`log-${this.id}`);
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `> ${message}`;
            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }

    setLoading(isActive) {
        if (typeof document !== 'undefined') {
            const loader = document.querySelector(`.${this.id}-loader`);
            if (isActive) loader.classList.add('active');
            else loader.classList.remove('active');
        }
    }

    async executeTask(goal) {
        this.setLoading(true);
        this.log(`Analyzing goal from ${this.role} perspective...`);

        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

        let output = "";
        if (this.id === 'scouting') {
            this.log('Evaluating draft class and trade blocks...');
            await new Promise(r => setTimeout(r, 1000));
            this.log('Identified high-potential QB in round 2.');
            output = "[Scouting Director] Recommend trading back in Round 1 to acquire future picks, target QB in Round 2.";
        } else if (this.id === 'finance') {
            this.log('Analyzing salary cap projections over 3 years...');
            await new Promise(r => setTimeout(r, 1200));
            this.log('Current veteran contracts will exceed cap in year 2.');
            output = "[Cap Manager] Must release or trade Veteran WR1 and LT to free up $35M in cap space to meet 3-year projection.";
        } else if (this.id === 'development') {
            this.log('Assessing coaching staff and young roster core...');
            await new Promise(r => setTimeout(r, 1400));
            this.log('Current offensive scheme does not fit young roster.');
            output = "[Player Development] Recommend hiring new Offensive Coordinator specializing in West Coast scheme to develop rookie QB.";
        }

        this.setLoading(false);
        this.log('Report submitted to GM.');
        return output;
    }
}

class AGIGeneralManager {
    constructor(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
        this.agents = [
            new SubAgent('scouting', 'Scouting Director', 'Talent Acquisition'),
            new SubAgent('finance', 'Cap Manager', 'Financial Strategy'),
            new SubAgent('development', 'Player Development', 'Roster Growth')
        ];
    }

    updateStatus(message, isDone = false) {
        if (typeof document !== 'undefined') {
            const badge = document.getElementById('master-status');
            badge.textContent = message;
            if (isDone) badge.classList.add('done');
            else badge.classList.remove('done');
        }
    }

    async runSwarm(macroGoal) {
        this.updateStatus('Orchestrating Front Office...');

        const agentPromises = this.agents.map(agent => agent.executeTask(macroGoal));
        const agentResults = await Promise.all(agentPromises);

        this.updateStatus('Synthesizing Master Strategy...');

        const combinedContext = agentResults.join('\n\n');

        const prompt = `
            You are the AGI General Manager of a sports franchise.
            Macro Goal: "${macroGoal}"

            Your front office sub-agents have reported the following:
            ${combinedContext}

            Synthesize these findings into a cohesive, actionable 3-year Franchise Plan. Resolve any conflicts and format using Markdown.
        `;

        let finalReport = "";
        try {
            if (typeof fetchLLMResponse === 'function') {
                finalReport = await fetchLLMResponse(prompt, this.provider, this.apiKey, { temperature: 0.3 });
            } else {
                finalReport = `## 3-Year Franchise Plan\n\n**Objective:** ${macroGoal}\n\n**Strategy:** Trade Vet WR1 to clear cap space. Draft QB in Round 2. Hire new OC.\n\n*Note: Mocked response.*`;
            }
        } catch (error) {
            console.error("LLM Error:", error);
            finalReport = "## Executive Plan (Fallback)\n\nError contacting LLM.\n\n**Findings:**\n" + combinedContext;
        }

        this.updateStatus('Strategy Finalized', true);
        return finalReport;
    }
}

async function startFranchiseOrchestrator() {
    if (typeof document === 'undefined') return;

    const btn = document.getElementById('start-btn');
    const macroGoal = document.getElementById('macro-goal').value;
    const provider = document.getElementById('provider').value;
    const apiKey = document.getElementById('api-key').value;

    btn.disabled = true;
    document.getElementById('orchestrator-view').classList.remove('hidden');
    document.getElementById('results-panel').classList.add('hidden');

    ['scouting', 'finance', 'development'].forEach(id => {
        document.getElementById(`log-${id}`).innerHTML = '';
    });

    const gm = new AGIGeneralManager(provider, apiKey);
    const reportMarkdown = await gm.runSwarm(macroGoal);

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
    document.getElementById('start-btn').addEventListener('click', startFranchiseOrchestrator);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SubAgent, AGIGeneralManager };
}