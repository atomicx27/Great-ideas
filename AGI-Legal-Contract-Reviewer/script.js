document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-review-btn');
    const contractText = document.getElementById('contract-text');
    const dashboard = document.getElementById('swarm-dashboard');
    const orchestratorStatus = document.getElementById('orchestrator-status');
    const finalReport = document.getElementById('final-report');
    const reportContent = document.getElementById('report-content');

    const agents = {
        liability: {
            log: document.getElementById('log-liability'),
            indicator: document.querySelector('#agent-liability .status-indicator')
        },
        compliance: {
            log: document.getElementById('log-compliance'),
            indicator: document.querySelector('#agent-compliance .status-indicator')
        },
        finance: {
            log: document.getElementById('log-finance'),
            indicator: document.querySelector('#agent-finance .status-indicator')
        }
    };

    function updateAgent(agentKey, status, message) {
        const agent = agents[agentKey];

        // Use DOMPurify for XSS protection
        const safeMessage = DOMPurify.sanitize(message);
        agent.log.innerHTML = `${safeMessage}<br><br>${agent.log.innerHTML}`;

        agent.indicator.className = 'status-indicator';
        if (status) agent.indicator.classList.add(status);
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    async function runAgentSimulation(agentKey, tasks) {
        updateAgent(agentKey, 'working', 'Initializing context...');
        await sleep(1000 + Math.random() * 1000);

        for (const task of tasks) {
            updateAgent(agentKey, 'working', task);
            await sleep(1500 + Math.random() * 2000);
        }

        updateAgent(agentKey, 'done', 'Review complete. Sending findings to Master Orchestrator.');
    }

    startBtn.addEventListener('click', async () => {
        if (!contractText.value.trim()) {
            alert('Please paste a contract to review.');
            return;
        }

        startBtn.disabled = true;
        dashboard.classList.remove('hidden');
        finalReport.classList.add('hidden');

        // Reset logs
        Object.keys(agents).forEach(key => {
            agents[key].log.innerHTML = '';
            agents[key].indicator.className = 'status-indicator';
        });

        // Orchestrator Phase 1
        orchestratorStatus.textContent = 'Analyzing document structure and delegating sections to specialized agents...';
        await sleep(2000);
        orchestratorStatus.textContent = 'Swarm deployed. Parallel review in progress.';

        // Agent Execution (Parallel)
        const liabilityTasks = [
            "Scanning for indemnification clauses...",
            "Flagging unusual limitation of liability limits...",
            "Checking force majeure definitions..."
        ];

        const complianceTasks = [
            "Verifying GDPR data processing addendum...",
            "Checking jurisdiction and governing law...",
            "Reviewing confidentiality terms (NDA compliance)..."
        ];

        const financeTasks = [
            "Extracting payment terms and Net-X conditions...",
            "Analyzing penalty clauses for late delivery...",
            "Reviewing auto-renewal and price escalation terms..."
        ];

        await Promise.all([
            runAgentSimulation('liability', liabilityTasks),
            runAgentSimulation('compliance', complianceTasks),
            runAgentSimulation('finance', financeTasks)
        ]);

        // Orchestrator Phase 2
        orchestratorStatus.textContent = 'All agents finished. Synthesizing conflicting opinions and generating Executive Summary...';
        await sleep(3000);

        orchestratorStatus.textContent = 'Review Complete. Final report generated.';

        // Generate Final Report
        reportContent.innerHTML = `
            <h4>Critical Risks Identified:</h4>
            <ul>
                <li><strong>Liability:</strong> Indemnification clause is uncapped. <em>(High Risk)</em></li>
                <li><strong>Compliance:</strong> Governing law set to foreign jurisdiction (Singapore) instead of standard Delaware.</li>
                <li><strong>Finance:</strong> Payment terms are Net-90, violating our standard Net-30 policy.</li>
            </ul>
            <h4>Recommended Actions:</h4>
            <ul>
                <li>Redline Section 4.2 to cap liability at contract value.</li>
                <li>Negotiate governing law back to Delaware.</li>
                <li>Push back on payment terms or implement late fees.</li>
            </ul>
        `;

        finalReport.classList.remove('hidden');
        startBtn.disabled = false;
    });
});