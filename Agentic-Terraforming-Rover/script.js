// Simulated Tools and Environment
const environment = {
    sector: 0,
    seeded: [],
    grid: [
        { sector: 0, soilDeficiency: "None" },
        { sector: 1, soilDeficiency: "Nitrogen" },
        { sector: 2, soilDeficiency: "Phosphorus" },
        { sector: 3, soilDeficiency: "Potassium" },
        { sector: 4, soilDeficiency: "Nitrogen" }
    ]
};

const tools = {
    moveRover: () => {
        environment.sector++;
        return `Moved to Sector ${environment.sector}.`;
    },
    analyzeSoil: () => {
        const data = environment.grid.find(g => g.sector === environment.sector);
        return data ? `Analysis complete: Soil deficient in ${data.soilDeficiency}.` : "Analysis complete: Edge of operations zone.";
    },
    seedSoil: () => {
        const data = environment.grid.find(g => g.sector === environment.sector);
        if (data && data.soilDeficiency !== "None") {
            environment.seeded.push(data.soilDeficiency);
            return `Successfully seeded soil with ${data.soilDeficiency} compounds.`;
        }
        return "Seeding failed: Soil does not require these nutrients.";
    }
};

// Agent Logic
async function runRoverMission(targetNutrient, uiCallback) {
    let step = 0;
    const maxSteps = 15;
    environment.sector = 0;
    environment.seeded = [];

    while (step < maxSteps) {
        step++;
        if (environment.seeded.includes(targetNutrient)) {
            uiCallback('thought', `Mission Accomplished. Seeded target nutrient: ${targetNutrient}.`);
            break;
        }

        uiCallback('thought', `Current location: Sector ${environment.sector}. Searching for ${targetNutrient} deficient soil.`);

        uiCallback('action', `Calling tool: analyzeSoil()`);
        const analysis = tools.analyzeSoil();
        uiCallback('observation', analysis);

        if (analysis.includes(targetNutrient)) {
            uiCallback('thought', `Target deficiency found. Initiating seeding sequence.`);
            uiCallback('action', `Calling tool: seedSoil()`);
            const seedRes = tools.seedSoil();
            uiCallback('observation', seedRes);
        } else {
            uiCallback('thought', `Soil not deficient in target nutrient. Moving to next sector.`);
            uiCallback('action', `Calling tool: moveRover()`);
            const moveRes = tools.moveRover();
            uiCallback('observation', moveRes);
        }
    }

    if(step >= maxSteps && !environment.seeded.includes(targetNutrient)) {
        uiCallback('thought', 'Mission aborted: Reached edge of operating area without finding suitable soil.');
    }
}

// UI Integration
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const launchBtn = document.getElementById('launch-btn');
        const targetNutrientSelect = document.getElementById('target-nutrient');
        const thoughtLog = document.getElementById('thought-log');
        const currentLoc = document.getElementById('current-loc');
        const seededStatus = document.getElementById('seeded-status');

        function appendLog(type, text) {
            const div = document.createElement('div');
            div.className = `log-entry log-${type}`;
            const prefix = type === 'thought' ? '🤖 Think: ' : type === 'action' ? '⚙️ Act: ' : '📡 Observe: ';
            div.innerText = prefix + text;
            thoughtLog.appendChild(div);
            thoughtLog.scrollTop = thoughtLog.scrollHeight;

            currentLoc.innerText = environment.sector;
            seededStatus.innerText = environment.seeded.length > 0 ? environment.seeded.join(', ') : 'None';
        }

        launchBtn.addEventListener('click', async () => {
            const targetNutrient = targetNutrientSelect.value;

            launchBtn.disabled = true;
            thoughtLog.innerHTML = '';

            const uiCallback = async (type, text) => {
                appendLog(type, text);
                await new Promise(r => setTimeout(r, 600)); // artificial delay
            };

            // Wrap agent loop to allow await simulation in UI
             async function runSimulated() {
                 let step = 0;
                 environment.sector = 0; environment.seeded = [];
                 while (step < 15) {
                     step++;
                     if (environment.seeded.includes(targetNutrient)) {
                         await uiCallback('thought', `Mission Accomplished. Seeded ${targetNutrient}.`);
                         break;
                     }
                     await uiCallback('thought', `Current location: Sector ${environment.sector}. Searching for ${targetNutrient} deficient soil.`);

                     await uiCallback('action', `Calling tool: analyzeSoil()`);
                     const analysis = tools.analyzeSoil();
                     await uiCallback('observation', analysis);

                     if (analysis.includes(targetNutrient)) {
                         await uiCallback('thought', `Target deficiency found. Seeding.`);
                         await uiCallback('action', `Calling tool: seedSoil()`);
                         const drillRes = tools.seedSoil();
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
