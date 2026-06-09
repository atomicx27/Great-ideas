function parseSleepData(rawSensorData) {
    if (!Array.isArray(rawSensorData) || rawSensorData.length === 0) {
        return { error: 'Invalid or empty sensor data' };
    }

    let totalStages = rawSensorData.length;
    let counts = { deep: 0, light: 0, rem: 0, awake: 0 };

    for (let stage of rawSensorData) {
        if (counts.hasOwnProperty(stage)) {
            counts[stage]++;
        }
    }

    let score = 100;
    score -= (counts.awake * 10); // Penalty for waking up
    if (counts.deep < totalStages * 0.2) score -= 15; // Penalty for lack of deep sleep

    score = Math.max(0, Math.min(100, score));

    return {
        summary: counts,
        score: score,
        quality: score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Poor'
    };
}

// Browser environment wire-up
if (typeof document !== 'undefined') {
    document.getElementById('processBtn').addEventListener('click', () => {
        const input = document.getElementById('sensorData').value;
        const outputEl = document.getElementById('output');
        try {
            // Replace single quotes with double quotes for valid JSON parsing if needed
            const formattedInput = input.replace(/'/g, '"');
            const data = JSON.parse(formattedInput);
            const result = parseSleepData(data);
            outputEl.textContent = JSON.stringify(result, null, 2);
        } catch (e) {
            outputEl.textContent = 'Error parsing input. Ensure it is a valid JSON array of strings.';
        }
    });
}

// Export for Node.js tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseSleepData };
}