function processSensorData(temp, ph, oxygen) {
    if (typeof temp !== 'number' || typeof ph !== 'number' || typeof oxygen !== 'number') {
        return { error: 'Invalid sensor data types' };
    }

    let actions = [];
    let isOptimal = true;

    // Fixed threshold rules
    if (temp > 38.0) {
        actions.push('Cooling system activated');
        isOptimal = false;
    } else if (temp < 36.5) {
        actions.push('Heating system activated');
        isOptimal = false;
    }

    if (ph > 7.4) {
        actions.push('Acid buffer injected');
        isOptimal = false;
    } else if (ph < 7.0) {
        actions.push('Base buffer injected');
        isOptimal = false;
    }

    if (oxygen < 40) {
        actions.push('Aeration rate increased');
        isOptimal = false;
    } else if (oxygen > 60) {
        actions.push('Aeration rate decreased');
        isOptimal = false;
    }

    if (isOptimal) {
        actions.push('All parameters within optimal range. No action taken.');
    }

    return { success: true, actions: actions, isOptimal: isOptimal };
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const tempInput = document.getElementById('temp-input');
        const phInput = document.getElementById('ph-input');
        const oxygenInput = document.getElementById('oxygen-input');
        const processBtn = document.getElementById('process-btn');
        const outputStatus = document.getElementById('output-status');
        const log = document.getElementById('log');

        function appendLog(msg) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            log.prepend(entry);
        }

        processBtn.addEventListener('click', () => {
            const temp = parseFloat(tempInput.value);
            const ph = parseFloat(phInput.value);
            const oxygen = parseFloat(oxygenInput.value);

            appendLog(`Processing reading: Temp: ${temp}, pH: ${ph}, DO2: ${oxygen}`);

            const result = processSensorData(temp, ph, oxygen);

            if (result.error) {
                outputStatus.textContent = `Error: ${result.error}`;
                outputStatus.style.backgroundColor = '#fce4e4';
                outputStatus.style.color = '#c0392b';
                appendLog(`Processing Failed: ${result.error}`);
            } else {
                if (result.isOptimal) {
                    outputStatus.textContent = `Status: Optimal`;
                    outputStatus.style.backgroundColor = '#d4edda';
                    outputStatus.style.color = '#155724';
                } else {
                    outputStatus.textContent = `Status: Adjustments Required`;
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
    module.exports = { processSensorData };
}
