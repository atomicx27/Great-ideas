async function simulateAgent(name, minDelay, maxDelay, response) {
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await new Promise(r => setTimeout(r, delay));
    return response;
}

async function runDroneAgent() {
    return simulateAgent('Drone', 1000, 2500,
        "Mapped 500 sq miles. High density plastic detected at grid 4A. Typhoon eye currently 200 miles East, moving West."
    );
}

async function runSkimmerAgent() {
    return simulateAgent('Skimmer', 1500, 3000,
        "Fleet Alpha and Beta fully charged. Ready for deployment. Estimated collection capacity: 50 tons before required offload."
    );
}

async function runLogisticsAgent() {
    return simulateAgent('Logistics', 1200, 2800,
        "Wave heights exceeding 5m predicted in 4 hours. Mother ship 'Oceanic' positioned outside storm path for emergency docking."
    );
}

async function orchestrateCleanup(uiCallbacks) {
    if (uiCallbacks && uiCallbacks.start) uiCallbacks.start();

    // Run agents in parallel
    const [droneReport, skimmerReport, logisticsReport] = await Promise.all([
        runDroneAgent().then(res => { if(uiCallbacks) uiCallbacks.drone(res); return res; }),
        runSkimmerAgent().then(res => { if(uiCallbacks) uiCallbacks.skimmer(res); return res; }),
        runLogisticsAgent().then(res => { if(uiCallbacks) uiCallbacks.logistics(res); return res; })
    ]);

    // Master synthesis delay
    if(uiCallbacks) uiCallbacks.master("Synthesizing sub-agent reports...");
    await new Promise(r => setTimeout(r, 1500));

    const synthesis = `EXECUTION PLAN:\n1. Deploy Skimmer Fleet Alpha to grid 4A immediately to intercept high-density patch.\n2. Initiate hard recall of all fleets in 3 hours due to predicted 5m wave heights.\n3. Route Skimmer Fleet Beta to mother ship 'Oceanic' for premature offload to ensure empty bins post-typhoon.`;

    if(uiCallbacks) uiCallbacks.master(synthesis);
    if(uiCallbacks && uiCallbacks.done) uiCallbacks.done();

    return synthesis;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('orchestrate-btn');
        const spinner = document.getElementById('spinner');
        const droneOut = document.getElementById('drone-output');
        const skimmerOut = document.getElementById('skimmer-output');
        const logOut = document.getElementById('logistics-output');
        const masterOut = document.getElementById('master-output');

        btn.addEventListener('click', () => {
            orchestrateCleanup({
                start: () => {
                    btn.disabled = true;
                    spinner.style.display = 'inline-block';
                    droneOut.textContent = "Processing...";
                    skimmerOut.textContent = "Processing...";
                    logOut.textContent = "Processing...";
                    masterOut.textContent = "Awaiting sub-agent reports...";
                },
                drone: (res) => droneOut.textContent = res,
                skimmer: (res) => skimmerOut.textContent = res,
                logistics: (res) => logOut.textContent = res,
                master: (res) => masterOut.textContent = res,
                done: () => {
                    btn.disabled = false;
                    spinner.style.display = 'none';
                }
            });
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orchestrateCleanup };
}