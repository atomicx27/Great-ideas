// Core Logic (Testable)
function calculateIdealTemperature(currentTemp, targetTemp, isHome) {
    if (!isHome) {
        // Energy saving mode when away
        return { action: 'idle', setpoint: currentTemp > 78 ? 78 : (currentTemp < 60 ? 60 : currentTemp) };
    }

    if (currentTemp > targetTemp + 1) {
        return { action: 'cooling', setpoint: targetTemp };
    } else if (currentTemp < targetTemp - 1) {
        return { action: 'heating', setpoint: targetTemp };
    } else {
        return { action: 'idle', setpoint: targetTemp };
    }
}

function adjustThermostat(settings) {
    const ideal = calculateIdealTemperature(settings.currentTemp, settings.targetTemp, settings.isHome);

    let message = '';
    if (ideal.action === 'cooling') {
        message = `Cooling system ON. Target: ${ideal.setpoint}°F`;
    } else if (ideal.action === 'heating') {
        message = `Heating system ON. Target: ${ideal.setpoint}°F`;
    } else {
        message = `System IDLE. ${!settings.isHome ? '(Energy Saving Mode)' : ''}`;
    }

    return {
        action: ideal.action,
        message: message,
        newTemp: settings.currentTemp // In a real system, this would change over time
    };
}

// Module export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateIdealTemperature, adjustThermostat };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        let state = {
            currentTemp: 72,
            targetTemp: 70,
            isHome: true
        };

        const currentTempDisplay = document.getElementById('current-temp-display');
        const targetTempDisplay = document.getElementById('target-temp-display');
        const systemStatus = document.getElementById('system-status');
        const thermostatDisplay = document.querySelector('.thermostat-display');
        const logList = document.getElementById('system-log');

        const btnUp = document.getElementById('btn-temp-up');
        const btnDown = document.getElementById('btn-temp-down');
        const btnHome = document.getElementById('btn-toggle-home');
        const btnApply = document.getElementById('btn-apply');

        function addLog(msg) {
            const li = document.createElement('li');
            const time = new Date().toLocaleTimeString();
            li.innerHTML = `<span class="log-time">[${time}]</span> ${msg}`;
            logList.prepend(li);
        }

        function updateUI() {
            currentTempDisplay.textContent = `${state.currentTemp}°F`;
            targetTempDisplay.textContent = `${state.targetTemp}°F`;

            if (state.isHome) {
                btnHome.textContent = 'User is Home';
                btnHome.classList.add('is-home');
            } else {
                btnHome.textContent = 'User is Away';
                btnHome.classList.remove('is-home');
            }
        }

        btnUp.addEventListener('click', () => {
            state.targetTemp++;
            updateUI();
        });

        btnDown.addEventListener('click', () => {
            state.targetTemp--;
            updateUI();
        });

        btnHome.addEventListener('click', () => {
            state.isHome = !state.isHome;
            updateUI();
        });

        btnApply.addEventListener('click', () => {
            const result = adjustThermostat(state);

            systemStatus.textContent = `System: ${result.action.charAt(0).toUpperCase() + result.action.slice(1)}`;

            thermostatDisplay.classList.remove('heating', 'cooling', 'idle');
            thermostatDisplay.classList.add(result.action);

            addLog(result.message);

            // Simulate temp change
            if (result.action === 'heating') state.currentTemp++;
            if (result.action === 'cooling') state.currentTemp--;
            updateUI();
        });

        updateUI();
        addLog("System initialized.");
    });
}
