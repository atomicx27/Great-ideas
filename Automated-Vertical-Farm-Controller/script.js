function checkMoistureLevel(level) {
    if (level < 30) {
        return { action: 'Watering Initiated', duration: '5 mins' };
    } else if (level > 80) {
        return { action: 'Watering Disabled', duration: '0 mins', note: 'High moisture detected' };
    }
    return { action: 'Standby', duration: '0 mins' };
}

function adjustLighting(lux) {
    if (lux < 10000) {
        return { action: 'Increase LED Intensity', level: '+20%' };
    } else if (lux > 15000) {
        return { action: 'Decrease LED Intensity', level: '-10%' };
    }
    return { action: 'Optimal Lighting', level: '0%' };
}

function dispenseNutrients(hoursSinceLast) {
    if (hoursSinceLast >= 24) {
        return { action: 'Dispense Nutrient Mix A', amount: '50ml' };
    }
    return { action: 'Standby', amount: '0ml' };
}

function logAction(msg) {
    if (typeof document !== 'undefined') {
        const logDiv = document.getElementById('systemLog');
        if (!logDiv) return;
        const p = document.createElement('p');
        const time = new Date().toLocaleTimeString();
        p.textContent = `[${time}] ${msg}`;
        logDiv.appendChild(p);
        logDiv.scrollTop = logDiv.scrollHeight;
    }
}

function triggerUpdate(type) {
    if (type === 'moisture') {
        const val = Math.floor(Math.random() * 100);
        document.getElementById('moistureVal').textContent = val;
        const res = checkMoistureLevel(val);
        logAction(`Moisture: ${val}% -> ${res.action} (${res.duration})`);
    } else if (type === 'light') {
        const val = Math.floor(Math.random() * 20000) + 5000;
        document.getElementById('lightVal').textContent = val;
        const res = adjustLighting(val);
        logAction(`Light: ${val} lux -> ${res.action} (${res.level})`);
    } else if (type === 'timer') {
        const val = Math.floor(Math.random() * 30);
        document.getElementById('timerVal').textContent = `${val.toString().padStart(2, '0')}:00`;
        const res = dispenseNutrients(val);
        logAction(`Nutrient Timer: ${val} hrs -> ${res.action} (${res.amount})`);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkMoistureLevel, adjustLighting, dispenseNutrients };
}
