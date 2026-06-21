const simulatedTools = {
    checkWeather: () => {
        const conds = ['Clear skies', 'High stratospheric winds', 'Approaching orbital debris', 'Micro-meteoroid shower'];
        const cond = conds[Math.floor(Math.random() * conds.length)];
        return `Atmospheric sensors report: ${cond}.`;
    },
    checkTetherStrain: () => {
        const strain = Math.floor(Math.random() * 100);
        if (strain > 85) return 'Tether tension critical. High stress detected ahead.';
        if (strain > 50) return 'Tether tension elevated. Moderate stress.';
        return 'Tether tension nominal. Safe for standard velocity.';
    }
};

async function runAscentStep(logFn) {
    logFn("Agent objective: Safely navigate climber to GEO station.");

    // Simulate thinking
    logFn("Agent querying environmental sensors...");
    await new Promise(r => setTimeout(r, 1000));

    logFn("Agent invoking tool: checkWeather()");
    const weatherResult = simulatedTools.checkWeather();
    logFn(`Tool result: ${weatherResult}`);

    await new Promise(r => setTimeout(r, 1000));

    logFn("Agent invoking tool: checkTetherStrain()");
    const strainResult = simulatedTools.checkTetherStrain();
    logFn(`Tool result: ${strainResult}`);

    await new Promise(r => setTimeout(r, 1200));

    let decision = "";

    if (weatherResult.includes('winds') || weatherResult.includes('debris') || weatherResult.includes('shower')) {
        if (strainResult.includes('critical')) {
            decision = "High risk environment AND critical tether strain. Initiating emergency halt and locking grip mechanisms.";
        } else {
            decision = "Suboptimal environmental conditions. Reducing climber ascent velocity by 40% to mitigate vibration.";
        }
    } else {
        if (strainResult.includes('critical')) {
            decision = "Clear environment but critical strain ahead. Halting ascent to await tether tension rebalancing.";
        } else {
            decision = "Conditions nominal. Maintaining maximum safe ascent velocity.";
        }
    }

    logFn(`Agent Synthesis: ${decision}`);
    return decision;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const pilotBtn = document.getElementById('pilot-btn');
        const clearBtn = document.getElementById('clear-btn');
        const logBox = document.getElementById('agent-log');

        function appendLog(msg) {
            const el = document.createElement('div');
            el.textContent = `> ${msg}`;
            logBox.appendChild(el);
            logBox.scrollTop = logBox.scrollHeight;
        }

        pilotBtn.addEventListener('click', async () => {
            pilotBtn.disabled = true;
            appendLog("--- Ascent Sequence Engaged ---");
            await runAscentStep(appendLog);
            pilotBtn.disabled = false;
        });

        clearBtn.addEventListener('click', () => {
            logBox.innerHTML = '';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAscentStep, simulatedTools };
}
