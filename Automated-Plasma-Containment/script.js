function monitorPlasma(temperature, density, stability) {
    if (typeof temperature !== 'number' || typeof density !== 'number' || typeof stability !== 'number') {
        return { error: 'Invalid sensor data types' };
    }

    let actions = [];
    let isStable = true;

    if (temperature > 160) {
        actions.push('Cryogenic cooling flux increased');
        isStable = false;
    } else if (temperature < 140) {
        actions.push('Neutral beam injection increased');
        isStable = false;
    }

    if (density > 1.5) {
        actions.push('Fuel pellet injection halted');
        isStable = false;
    } else if (density < 0.8) {
        actions.push('Fuel pellet injection triggered');
        isStable = false;
    }

    if (stability < 85) {
        actions.push('Toroidal magnetic field coils repowered');
        isStable = false;
    }

    if (stability < 60) {
        actions.push('CRITICAL: Emergency plasma quench initiated');
        isStable = false;
    }

    if (isStable) {
        actions.push('Plasma containment optimal. Holding steady state.');
    }

    return { success: true, actions: actions, isStable: isStable };
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const tempInput = document.getElementById('temp-input');
        const densityInput = document.getElementById('density-input');
        const stabilityInput = document.getElementById('stability-input');
        const monitorBtn = document.getElementById('monitor-btn');
        const outputStatus = document.getElementById('output-status');
        const log = document.getElementById('log');

        function appendLog(msg) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            log.prepend(entry);
        }

        monitorBtn.addEventListener('click', () => {
            const temp = parseFloat(tempInput.value);
            const density = parseFloat(densityInput.value);
            const stability = parseFloat(stabilityInput.value);

            appendLog(`Monitoring: Temp: ${temp}M K, Density: ${density}, Stability: ${stability}`);

            const result = monitorPlasma(temp, density, stability);

            if (result.error) {
                outputStatus.textContent = `Error: ${result.error}`;
                outputStatus.style.backgroundColor = '#fce4e4';
                outputStatus.style.color = '#c0392b';
                appendLog(`Monitoring Failed: ${result.error}`);
            } else {
                if (result.isStable) {
                    outputStatus.textContent = `Status: Stable`;
                    outputStatus.style.backgroundColor = '#d4edda';
                    outputStatus.style.color = '#155724';
                } else if (stability < 60) {
                    outputStatus.textContent = `Status: CRITICAL`;
                    outputStatus.style.backgroundColor = '#fce4e4';
                    outputStatus.style.color = '#c0392b';
                } else {
                    outputStatus.textContent = `Status: Adjustments Made`;
                    outputStatus.style.backgroundColor = '#fff3cd';
                    outputStatus.style.color = '#856404';
                }

                result.actions.forEach(action => {
                    appendLog(`Action: ${action}`);
                });
            }
        });
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { monitorPlasma };
}
