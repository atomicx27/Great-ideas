// Simulated Tools and Environment
const environment = {
    sector: 0,
    cargo: [],
    grid: [
        { sector: 0, composition: "Dust" },
        { sector: 1, composition: "Silicate" },
        { sector: 2, composition: "Iron" },
        { sector: 3, composition: "Platinum" },
        { sector: 4, composition: "Ice" }
    ]
};

const tools = {
    moveRover: () => {
        environment.sector++;
        return `Moved to Sector ${environment.sector}.`;
    },
    analyzeSample: () => {
        const data = environment.grid.find(g => g.sector === environment.sector);
        return data ? `Analysis complete: High concentration of ${data.composition}.` : "Analysis complete: Barren rock.";
    },
    drillSample: () => {
        const data = environment.grid.find(g => g.sector === environment.sector);
        if (data && data.composition !== "Dust" && data.composition !== "Silicate") {
            environment.cargo.push(data.composition);
            return `Successfully extracted 1 ton of ${data.composition}.`;
        }
        return "Extraction failed: Material not valuable.";
    }
};

// Agent Logic
async function runRoverMission(targetOre, uiCallback) {
    let step = 0;
    const maxSteps = 15;
    environment.sector = 0;
    environment.cargo = [];

    while (step < maxSteps) {
        step++;
        if (environment.cargo.includes(targetOre)) {
            uiCallback('thought', `Mission Accomplished. Extracted target ore: ${targetOre}.`);
            break;
        }

        uiCallback('thought', `Current location: Sector ${environment.sector}. Searching for ${targetOre}.`);

        uiCallback('action', `Calling tool: analyzeSample()`);
        const analysis = tools.analyzeSample();
        uiCallback('observation', analysis);

        if (analysis.includes(targetOre)) {
            uiCallback('thought', `Target ore found in current sector. Initiating drilling sequence.`);
            uiCallback('action', `Calling tool: drillSample()`);
            const drillRes = tools.drillSample();
            uiCallback('observation', drillRes);
        } else {
            uiCallback('thought', `Target ore not found here. Moving to next sector.`);
            uiCallback('action', `Calling tool: moveRover()`);
            const moveRes = tools.moveRover();
            uiCallback('observation', moveRes);
        }
    }

    if(step >= maxSteps && !environment.cargo.includes(targetOre)) {
        uiCallback('thought', 'Mission aborted: Reached edge of operating area without finding ore.');
    }
}

// UI Integration
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const launchBtn = document.getElementById('launch-btn');
        const targetOreSelect = document.getElementById('target-ore');
        const thoughtLog = document.getElementById('thought-log');
        const currentLoc = document.getElementById('current-loc');
        const cargoStatus = document.getElementById('cargo-status');

        function appendLog(type, text) {
            const div = document.createElement('div');
            div.className = `log-entry log-${type}`;
            const prefix = type === 'thought' ? '🤖 Think: ' : type === 'action' ? '⚙️ Act: ' : '📡 Observe: ';
            div.innerText = prefix + text;
            thoughtLog.appendChild(div);
            thoughtLog.scrollTop = thoughtLog.scrollHeight;

            currentLoc.innerText = environment.sector;
            cargoStatus.innerText = environment.cargo.length > 0 ? environment.cargo.join(', ') : 'Empty';
        }

        launchBtn.addEventListener('click', async () => {
            const targetOre = targetOreSelect.value;

            launchBtn.disabled = true;
            thoughtLog.innerHTML = '';

            const uiCallback = async (type, text) => {
                appendLog(type, text);
                await new Promise(r => setTimeout(r, 600)); // artificial delay
            };

            // Wrap agent loop to allow await simulation in UI
             async function runSimulated() {
                 let step = 0;
                 environment.sector = 0; environment.cargo = [];
                 while (step < 15) {
                     step++;
                     if (environment.cargo.includes(targetOre)) {
                         await uiCallback('thought', `Mission Accomplished. Extracted ${targetOre}.`);
                         break;
                     }
                     await uiCallback('thought', `Current location: Sector ${environment.sector}. Searching for ${targetOre}.`);

                     await uiCallback('action', `Calling tool: analyzeSample()`);
                     const analysis = tools.analyzeSample();
                     await uiCallback('observation', analysis);

                     if (analysis.includes(targetOre)) {
                         await uiCallback('thought', `Target found. Drilling.`);
                         await uiCallback('action', `Calling tool: drillSample()`);
                         const drillRes = tools.drillSample();
                         await uiCallback('observation', drillRes);
                     } else {
                         await uiCallback('thought', `Moving to next sector.`);
                         await uiCallback('action', `Calling tool: moveRover()`);
                         const moveRes = tools.moveRover();
                         await uiCallback('observation', moveRes);
                     }
                 }
                 launchBtn.disabled = false;
            }
            runSimulated();
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { runRoverMission, tools, environment };
}
