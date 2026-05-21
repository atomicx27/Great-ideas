// AGI Materials Science Swarm - Multi-Agent Orchestration

class SubAgent {
    constructor(id, name, expertise) {
        this.id = id;
        this.name = name;
        this.expertise = expertise;
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
        this.log(`Analyzing goal from ${this.expertise} perspective...`);

        // Simulating complex parallel processing
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

        let output = "";
        if (this.id === 'quantum') {
            this.log('Simulating electron pairing mechanisms...');
            await new Promise(r => setTimeout(r, 1000));
            this.log('Identified stable hydride-based lattice structure.');
            output = "[Quantum Chemist] Proposed Yttrium-Barium-Copper-Hydride lattice with enhanced electron-phonon coupling.";
        } else if (this.id === 'thermodynamics') {
            this.log('Calculating phase stability...');
            await new Promise(r => setTimeout(r, 1200));
            this.log('Thermal fluctuations suggest instability above 250K without extreme pressure.');
            output = "[Thermodynamics] Structural integrity requires maintaining 1.5 Mbar pressure to prevent phase degradation at room temperature.";
        } else if (this.id === 'manufacturing') {
            this.log('Evaluating synthesis pathways...');
            await new Promise(r => setTimeout(r, 1400));
            this.log('Current diamond anvil cell methods are not scalable.');
            output = "[Manufacturing] Recommends pulsed laser deposition (PLD) combined with epitaxial strain to achieve required pressure conditions at scale.";
        }

        this.setLoading(false);
        this.log('Task complete. Transmitting to Orchestrator.');
        return output;
    }
}

class AGIMasterOrchestrator {
    constructor(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
        this.agents = [
            new SubAgent('quantum', 'Quantum Chemist', 'Atomic Structure'),
            new SubAgent('thermodynamics', 'Thermodynamics Simulator', 'Phase Stability'),
            new SubAgent('manufacturing', 'Manufacturing Engineer', 'Scalability')
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
        this.updateStatus('Orchestrating Sub-Agents...');

        // Execute all agents in parallel
        const agentPromises = this.agents.map(agent => agent.executeTask(macroGoal));
        const agentResults = await Promise.all(agentPromises);

        this.updateStatus('Synthesizing Master Report...');

        // Combine results
        const combinedContext = agentResults.join('\n\n');

        // Construct prompt for LLM synthesis
        const prompt = `
            You are an AGI Master Orchestrator for Materials Science.
            Macro Goal: "${macroGoal}"

            Your sub-agents have reported the following parallel findings:
            ${combinedContext}

            Synthesize these findings into a cohesive Executive Summary. Resolve the conflicting constraints (e.g., pressure vs. scalability) into a unified, actionable R&D roadmap. Format using Markdown.
        `;

        let finalReport = "";
        try {
            if (typeof fetchLLMResponse === 'function') {
                finalReport = await fetchLLMResponse(prompt, this.provider, this.apiKey, { temperature: 0.3 });
            } else {
                finalReport = "## Executive Synthesis\n\n**Goal:** " + macroGoal + "\n\n**Findings:** Synthesized YBCO-Hydride using PLD with epitaxial strain to bypass diamond anvil constraints.\n\n*Note: Mocked response.*";
            }
        } catch (error) {
            console.error("LLM Error:", error);
            finalReport = "## Executive Synthesis (Fallback)\n\nError contacting LLM.\n\n**Findings:**\n" + combinedContext;
        }

        this.updateStatus('Synthesis Complete', true);
        return finalReport;
    }
}

async function startSwarm() {
    if (typeof document === 'undefined') return;

    const btn = document.getElementById('start-btn');
    const macroGoal = document.getElementById('macro-goal').value;
    const provider = document.getElementById('provider').value;
    const apiKey = document.getElementById('api-key').value;

    btn.disabled = true;
    document.getElementById('orchestrator-view').classList.remove('hidden');
    document.getElementById('results-panel').classList.add('hidden');

    // Clear previous logs
    ['quantum', 'thermodynamics', 'manufacturing'].forEach(id => {
        document.getElementById(`log-${id}`).innerHTML = '';
    });

    const orchestrator = new AGIMasterOrchestrator(provider, apiKey);
    const reportMarkdown = await orchestrator.runSwarm(macroGoal);

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
    document.getElementById('start-btn').addEventListener('click', startSwarm);
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SubAgent,
        AGIMasterOrchestrator
    };
}