// Sub-agents
async function runWeatherAgent(logFn) {
    logFn("Activating... Analyzing coronal mass ejection telemetry.");
    await new Promise(r => setTimeout(r, 1500));
    logFn("Solar storm predicted to hit upper tether in 4 hours. Ionospheric drag expected to increase by 18%.");
    return "Weather Risk: High in 4 hours. Recommend lowering altitude of vulnerable climbers.";
}

async function runMaintenanceAgent(logFn) {
    logFn("Activating... Reviewing segment strain history.");
    await new Promise(r => setTimeout(r, 1200));
    logFn("Segment 405 showing signs of micro-fractures. Cannot handle storm stress plus heavy cargo.");
    return "Maintenance Constraint: Segment 405 vulnerable. Payload capacity must be reduced if storm hits.";
}

async function runCargoAgent(logFn) {
    logFn("Activating... Reviewing manifest priority.");
    await new Promise(r => setTimeout(r, 1800));
    logFn("Time-sensitive medical supplies on Climber Alpha. Mining equipment on Climber Beta.");
    return "Cargo Priority: Expedite medical supplies. Mining equipment can be delayed.";
}

// Master Orchestrator
async function runMasterOrchestrator(directive, logs) {
    logs.master("Received Directive: " + directive);
    logs.master("Delegating tasks to Swarm...");

    logs.weather("--- Starting task ---");
    logs.maintenance("--- Starting task ---");
    logs.cargo("--- Starting task ---");

    // Run agents in parallel
    const [weatherRes, maintRes, cargoRes] = await Promise.all([
        runWeatherAgent(logs.weather),
        runMaintenanceAgent(logs.maintenance),
        runCargoAgent(logs.cargo)
    ]);

    logs.master("Received Weather Report: " + weatherRes);
    logs.master("Received Maintenance Report: " + maintRes);
    logs.master("Received Cargo Report: " + cargoRes);

    logs.master("Synthesizing Master Plan...");
    await new Promise(r => setTimeout(r, 2000));

    const finalPlan = `
1. Accelerate Climber Alpha (Medical) past Segment 405 before storm hits in 4 hrs.
2. Halt Climber Beta (Mining) at lower station to prevent overloading Segment 405 during solar storm drag.
3. Deploy repair drones to Segment 405 once storm passes.
Directive Accomplished. Global Tether stabilized.
    `;
    logs.master("Master Synthesis Complete:\n" + finalPlan);
    return finalPlan;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('orchestrate-btn');
        const dirInput = document.getElementById('directive-input');

        const logEls = {
            weather: document.getElementById('weather-log'),
            maintenance: document.getElementById('maintenance-log'),
            cargo: document.getElementById('cargo-log'),
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
    module.exports = { runMasterOrchestrator, runWeatherAgent, runMaintenanceAgent, runCargoAgent };
}
