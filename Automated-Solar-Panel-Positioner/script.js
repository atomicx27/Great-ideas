function calculatePanelAngle(hour, weather) {
    if (weather === 'stormy') {
        return { angle: 0, status: 'Stowed flat to prevent wind damage' };
    }

    if (weather === 'cloudy') {
        return { angle: 0, status: 'Flat to capture diffuse light' };
    }

    // Sunny conditions: track the sun
    if (hour < 6 || hour > 18) {
        return { angle: 0, status: 'Night mode (flat)' };
    }

    // Rough approximation: 15 degrees per hour, 90 degrees at 12:00
    // At 6:00 -> 0 degrees
    // At 12:00 -> 90 degrees
    // At 18:00 -> 180 degrees
    const angle = (hour - 6) * 15;
    return { angle: angle, status: 'Tracking sun' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('positioner-form');
        const outputCard = document.getElementById('output-card');
        const positionOutput = document.getElementById('position-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const hour = parseInt(document.getElementById('hour').value);
            const weather = document.getElementById('weather').value;

            const result = calculatePanelAngle(hour, weather);

            positionOutput.innerHTML = `
                <div class="angle">${result.angle}°</div>
                <div class="status">${result.status}</div>
            `;
            outputCard.style.display = 'block';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculatePanelAngle };
}