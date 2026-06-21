// Sub-agents
async function runPowerAgent(logFn) {
    logFn("Activating... Analyzing life support grid.");
    await new Promise(r => setTimeout(r, 1500));
    logFn("Thawing 10,000 pods simultaneously exceeds reactor peak load by 40%.");
    return "Power Constraint: Max 2,500 pods can be thawed concurrently to prevent brownout.";
}

async function runMedicalAgent(logFn) {
    logFn("Activating... Reviewing med-bay capacity.");
    await new Promise(r => setTimeout(r, 1200));
    logFn("Rehab beds and IV fluids limited. Can process max 1,000 patients every 12 hours.");
    return "Medical Constraint: Cap revival throughput to 1,000 colonists per 12 hours.";
}

async function runLogisticsAgent(logFn) {
    logFn("Activating... Reviewing habitat rationing.");
    await new Promise(r => setTimeout(r, 1800));
    logFn("Food processing and water recycling ready for full population.");
    return "Logistics Constraint: Habitat life support nominal. Ready for influx.";
}

// Master Orchestrator
async function runMasterOrchestrator(directive, logs) {
    logs.master("Received Directive: " + directive);
    logs.master("Delegating tasks to Swarm...");

    logs.power("--- Starting task ---");
    logs.medical("--- Starting task ---");
    logs.logistics("--- Starting task ---");

    // Run agents in parallel
    const [powRes, medRes, logRes] = await Promise.all([
        runPowerAgent(logs.power),
        runMedicalAgent(logs.medical),
        runLogisticsAgent(logs.logistics)
    ]);

    logs.master("Received Power Report: " + powRes);
    logs.master("Received Medical Report: " + medRes);
    logs.master("Received Logistics Report: " + logRes);

    logs.master("Synthesizing Master Plan...");
    await new Promise(r => setTimeout(r, 2000));

    const finalPlan = `
1. Stagger revival into 10 batches of 1,000 colonists.
2. Thaw batch every 7.2 hours to stay well under 2,500 pod power limit.
3. Process 1,000 colonists per 12-hour med-bay window by accelerating basic checkups.
4. Route cleared colonists to habitat cafeteria immediately to clear med-bay queue.
Directive Accomplished. Safe mass-revival scheduled.
    `;
    logs.master("Master Synthesis Complete:\n" + finalPlan);
    return finalPlan;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('orchestrate-btn');
        const dirInput = document.getElementById('directive-input');

        const logEls = {
            power: document.getElementById('power-log'),
            medical: document.getElementById('medical-log'),
            logistics: document.getElementById('logistics-log'),
            master: document.getElementById('master-log')
        };

        const logs = {};
        for (let key in logEls) {
            logs[key] = (msg) => {
                const el = document.createElement('div');
                el.textContent = `> ${msg}`;
                logEls[key].appendChild(el);
                logEls[key].scrollTop = logEls[key].scrollHeight;
            };
        }

        btn.addEventListener('click', async () => {
            btn.disabled = true;
            for (let key in logEls) logEls[key].innerHTML = ''; // clear
            await runMasterOrchestrator(dirInput.value, logs);
            btn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { runMasterOrchestrator, runPowerAgent, runMedicalAgent, runLogisticsAgent };
}
