async function simulateAgent(name, minDelay, maxDelay, response) {
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await new Promise(r => setTimeout(r, delay));
    return response;
}

async function runExtractionAgent() {
    return simulateAgent('Extraction', 1500, 3000,
        "Micro-gravity drill array designed. Thermal limits stable. Estimated daily yield: 15 metric tons."
    );
}

async function runProcessingAgent() {
    return simulateAgent('Processing', 1800, 3500,
        "Centrifugal smelting module configured. Platinum group refinement efficiency projected at 92%. Slag ejection trajectory calculated."
    );
}

async function runLogisticsAgent() {
    return simulateAgent('Logistics', 1200, 2500,
        "Hohmann transfer window opens in 42 days. Payload return vessel requires 300 delta-v to intercept Earth orbit. Propellant reserves adequate."
    );
}

async function orchestrateMiningMission(uiCallbacks) {
    if (uiCallbacks && uiCallbacks.start) uiCallbacks.start();

    // Run agents in parallel
    const [extReport, procReport, logReport] = await Promise.all([
        runExtractionAgent().then(res => { if(uiCallbacks) uiCallbacks.ext(res); return res; }),
        runProcessingAgent().then(res => { if(uiCallbacks) uiCallbacks.proc(res); return res; }),
        runLogisticsAgent().then(res => { if(uiCallbacks) uiCallbacks.log(res); return res; })
    ]);

    // Master synthesis delay
    if(uiCallbacks) uiCallbacks.master("Synthesizing mission parameters into Master Blueprint...");
    await new Promise(r => setTimeout(r, 2000));

    const synthesis = `MISSION BLUEPRINT APPROVED:
1. DEPLOYMENT: Launch extraction array and centrifugal smelter ahead of the transfer window.
2. OPERATIONS: Cap daily extraction at 15 metric tons to match 92% refinement capacity and prevent thermal overload.
3. RETURN: Initiate return burn on day 42 utilizing precise 300 delta-v maneuver.
Profitability threshold achieved. Initiating launch countdown sequence.`;

    if(uiCallbacks) uiCallbacks.master(synthesis);
    if(uiCallbacks && uiCallbacks.done) uiCallbacks.done();

    return synthesis;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('orchestrate-btn');
        const spinner = document.getElementById('spinner');
        const extOut = document.getElementById('ext-output');
        const procOut = document.getElementById('proc-output');
        const logOut = document.getElementById('log-output');
        const masterOut = document.getElementById('master-output');

        btn.addEventListener('click', () => {
            orchestrateMiningMission({
                start: () => {
                    btn.disabled = true;
                    spinner.style.display = 'inline-block';
                    extOut.textContent = "Computing...";
                    procOut.textContent = "Computing...";
                    logOut.textContent = "Computing...";
                    masterOut.textContent = "Awaiting sub-agent parallel processing...";
                },
                ext: (res) => extOut.textContent = res,
                proc: (res) => procOut.textContent = res,
                log: (res) => logOut.textContent = res,
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
    module.exports = { orchestrateMiningMission };
}