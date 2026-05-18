const simulatedTools = {
    useSpectrometer: () => {
        const traces = ['Iron/Nickel', 'Carbonaceous', 'Platinum Group', 'Silicate'];
        const trace = traces[Math.floor(Math.random() * traces.length)];
        return `Spectroscopic analysis indicates high concentrations of ${trace}.`;
    },
    useCoreDrill: () => {
        const purity = Math.floor(Math.random() * 100);
        if (purity > 80) return 'Core sample yields extreme purity. Highly lucrative target.';
        if (purity > 40) return 'Core sample yields moderate purity. Standard target.';
        return 'Core sample mostly slag and ice. Low value target.';
    }
};

async function runProspectorStep(logFn) {
    logFn("Agent objective: Assess current asteroid for rare-earth mining viability.");

    // Simulate thinking
    logFn("Agent deciding initial approach...");
    await new Promise(r => setTimeout(r, 1200));

    logFn("Agent invoking tool: useSpectrometer()");
    const spectroResult = simulatedTools.useSpectrometer();
    logFn(`Tool result: ${spectroResult}`);

    await new Promise(r => setTimeout(r, 1200));

    let decision = "";

    if (spectroResult.includes('Platinum Group')) {
        logFn("High-value surface trace detected. Agent invoking tool: useCoreDrill() for deep analysis...");
        await new Promise(r => setTimeout(r, 1500));

        const drillResult = simulatedTools.useCoreDrill();
        logFn(`Tool result: ${drillResult}`);

        await new Promise(r => setTimeout(r, 1000));

        if (drillResult.includes('extreme') || drillResult.includes('moderate')) {
            decision = "Target viable. Planting claiming beacon and broadcasting coordinates to Mining Fleet.";
        } else {
            decision = "Surface trace was superficial. Target not viable for industrial extraction. Moving to next asteroid.";
        }
    } else {
        decision = "Surface composition not optimal for primary objective. Conserving drill battery. Moving to next asteroid.";
    }

    logFn(`Agent Synthesis: ${decision}`);
    return decision;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('prospect-btn');
        const clearBtn = document.getElementById('clear-btn');
        const logBox = document.getElementById('agent-log');

        function appendLog(msg) {
            const el = document.createElement('div');
            el.textContent = `> ${msg}`;
            logBox.appendChild(el);
            logBox.scrollTop = logBox.scrollHeight;
        }

        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            appendLog("--- New Target Acquired ---");
            await runProspectorStep(appendLog);
            startBtn.disabled = false;
        });

        clearBtn.addEventListener('click', () => {
            logBox.innerHTML = '';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runProspectorStep, simulatedTools };
}