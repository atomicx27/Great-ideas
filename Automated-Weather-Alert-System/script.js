function determineAlertLevel(wind, rain) {
    if (wind >= 74 || rain >= 5.0) {
        return { level: 'Hurricane / Flash Flood Warning', class: 'warning' };
    }

    if (wind >= 58 || rain >= 3.0) {
        return { level: 'Severe Storm Watch', class: 'watch' };
    }

    if (wind >= 39 || rain >= 1.0) {
        return { level: 'Wind / Rain Advisory', class: 'advisory' };
    }

    return { level: 'All Clear', class: 'clear' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('weather-form');
        const outputCard = document.getElementById('output-card');
        const alertOutput = document.getElementById('alert-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const wind = parseFloat(document.getElementById('wind').value);
            const rain = parseFloat(document.getElementById('rain').value);

            const result = determineAlertLevel(wind, rain);

            alertOutput.innerHTML = `<div class="alert-level ${result.class}">${result.level}</div>`;
            outputCard.style.display = 'block';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { determineAlertLevel };
}