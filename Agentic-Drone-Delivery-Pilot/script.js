function navigateWaypoint(currentPosition, waypoint, weather, obstacles) {
    let logs = [];
    logs.push({ type: 'action', text: `Initiating transit to Waypoint ${waypoint}. Current pos: ${currentPosition}` });

    if (weather === 'heavy_rain') {
        logs.push({ type: 'observation', text: 'Sensors detect heavy rain and reduced visibility.' });
        logs.push({ type: 'decision', text: 'Decreasing airspeed and activating anti-collision strobes.' });
    }

    if (obstacles.includes('crane')) {
        logs.push({ type: 'warning', text: 'LIDAR detects uncharted construction crane in flight path!' });
        logs.push({ type: 'decision', text: 'Calculating evasive maneuver. Ascending +50m and banking left.' });
        currentPosition = `Evasive_Altitude_${waypoint}`;
    } else {
        currentPosition = waypoint;
    }

    logs.push({ type: 'action', text: `Arrived at ${currentPosition}.` });
    return { finalPosition: currentPosition, logs: logs };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-mission-btn');
        const statusDiv = document.getElementById('mission-status');
        const logContainer = document.getElementById('agent-log');

        function appendLog(type, text) {
            const div = document.createElement('div');
            div.className = `log-entry log-${type}`;
            div.textContent = `> [${type.toUpperCase()}] ${text}`;
            logContainer.appendChild(div);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        startBtn.addEventListener('click', async () => {
            startBtn.disabled = true;
            logContainer.innerHTML = '';
            statusDiv.textContent = 'Status: Mission In Progress';

            const missionPlan = [
                { waypoint: 'WP-Alpha', weather: 'clear', obstacles: [] },
                { waypoint: 'WP-Beta', weather: 'heavy_rain', obstacles: [] },
                { waypoint: 'WP-Gamma', weather: 'clear', obstacles: ['crane'] },
                { waypoint: 'Destination-Dropoff', weather: 'clear', obstacles: [] }
            ];

            let currentPos = 'Base-Station';

            for (let step of missionPlan) {
                await new Promise(r => setTimeout(r, 1000)); // Simulate travel time

                const result = navigateWaypoint(currentPos, step.waypoint, step.weather, step.obstacles);
                currentPos = result.finalPosition;

                result.logs.forEach((log, index) => {
                    setTimeout(() => appendLog(log.type, log.text), index * 400);
                });

                await new Promise(r => setTimeout(r, result.logs.length * 400 + 500));
            }

            statusDiv.textContent = 'Status: Package Delivered. Returning to Base.';
            statusDiv.style.backgroundColor = '#2ecc71';
            statusDiv.style.color = 'white';
            startBtn.disabled = false;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { navigateWaypoint };
}