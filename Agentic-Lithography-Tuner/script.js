const simulatedTools = {
    useInterferometer: () => {
        const errors = ['Astigmatism', 'Coma', 'Spherical Aberration', 'Perfect Alignment'];
        const error = errors[Math.floor(Math.random() * errors.length)];
        return `Interferometer scan indicates: ${error}.`;
    },
    useDoseControl: () => {
        const doses = ['Underexposed', 'Overexposed', 'Optimal Exposure'];
        const dose = doses[Math.floor(Math.random() * doses.length)];
        return `Test exposure indicates: ${dose}.`;
    }
};

async function simulateReActLithographyTuning(logFn) {
    logFn("Agent objective: Optimize EUV lithography parameters.");

    logFn("Agent deciding initial approach...");
    await new Promise(r => setTimeout(r, 1000));

    logFn("Agent invoking tool: useInterferometer()");
    const interferoResult = simulatedTools.useInterferometer();
    logFn(`Tool result: ${interferoResult}`);

    await new Promise(r => setTimeout(r, 1000));

    let decision = "";

    if (interferoResult.includes('Perfect Alignment')) {
        logFn("Alignment is optimal. Agent invoking tool: useDoseControl() to check exposure...");
        await new Promise(r => setTimeout(r, 1200));

        const doseResult = simulatedTools.useDoseControl();
        logFn(`Tool result: ${doseResult}`);

        await new Promise(r => setTimeout(r, 800));

        if (doseResult.includes('Optimal Exposure')) {
            decision = "System fully optimized. Locking parameters for production run.";
        } else {
            decision = `Exposure is ${doseResult.split(':')[1].trim()}. Adjusting EUV source power and initiating new test wafer.`;
        }
    } else {
        decision = `Optical error detected (${interferoResult.split(':')[1].trim()}). Applying Zernike polynomial corrections to adaptive optics.`;
    }

    logFn(`Agent Synthesis: ${decision}`);
    return decision;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('tune-btn');
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
            appendLog("--- New Tuning Cycle Initiated ---");
            await simulateReActLithographyTuning(appendLog);
            startBtn.disabled = false;
        });

        clearBtn.addEventListener('click', () => {
            logBox.innerHTML = '';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { simulateReActLithographyTuning, simulatedTools };
}
