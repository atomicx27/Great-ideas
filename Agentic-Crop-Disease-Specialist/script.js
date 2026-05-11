const tools = {
    search_pathogen_database: (symptoms) => {
        if (symptoms.includes('powdery')) return "Match found: Powdery Mildew (Fungal).";
        return "No direct match found in primary database.";
    },
    check_weather_forecast: () => "Forecast: High humidity, 85%, rain expected tomorrow."
};

function formulateTreatmentPlan(pathogen, weather) {
    if (pathogen.includes('Powdery Mildew') && weather.includes('rain')) {
        return "Treatment: Apply systemic fungicide immediately. Delay foliar feeding due to impending rain.";
    }
    return "Treatment: Standard observation. Ensure adequate spacing for airflow.";
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const diagBtn = document.getElementById('diagnose-btn');
        const outputLog = document.getElementById('output-log');
        const symptomInput = document.getElementById('symptom-input');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            outputLog.appendChild(p);
            outputLog.scrollTop = outputLog.scrollHeight;
        }

        diagBtn.addEventListener('click', () => {
            const symptoms = symptomInput.value;
            outputLog.innerHTML = '';
            diagBtn.disabled = true;

            appendLog(`Farmer Report Received: "${symptoms}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: Symptoms suggest a fungal infection. I need to query the pathogen DB and check local weather for treatment viability.', 'log-thought');
            }, 1000);

            let pathogenResult = '';
            setTimeout(() => {
                appendLog('Executing Tool: search_pathogen_database()', 'log-action');
                pathogenResult = tools.search_pathogen_database(symptoms);
                appendLog(`Observation: ${pathogenResult}`, 'log-info');
            }, 2500);

            let weatherResult = '';
            setTimeout(() => {
                appendLog('Executing Tool: check_weather_forecast()', 'log-action');
                weatherResult = tools.check_weather_forecast();
                appendLog(`Observation: ${weatherResult}`, 'log-info');
            }, 4000);

            setTimeout(() => {
                appendLog('Thinking: Synthesizing diagnosis and environmental constraints into a treatment plan.', 'log-thought');
                const plan = formulateTreatmentPlan(pathogenResult, weatherResult);
                appendLog(`Final Recommendation: ${plan}`, 'log-success');
                diagBtn.disabled = false;
            }, 5500);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tools, formulateTreatmentPlan };
}
