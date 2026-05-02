// Pure logic function for monitoring
function checkTelemetry(drones) {
    return drones.map(drone => {
        let status = 'Normal';
        let alertMessage = '';

        if (drone.battery < 20) {
            status = 'Alert';
            alertMessage += 'Low Battery! ';
        }

        if (drone.signal < 30) {
            status = 'Alert';
            alertMessage += 'Weak Signal! ';
        }

        if (drone.temperature > 85) {
            status = 'Alert';
            alertMessage += 'High Temp! ';
        }

        return {
            droneId: drone.id,
            battery: drone.battery,
            signal: drone.signal,
            temperature: drone.temperature,
            status: status,
            alertMessage: alertMessage.trim()
        };
    });
}

function generateResultsHTML(results) {
    let rows = results.map(r => `
        <tr>
            <td>${r.droneId}</td>
            <td>${r.battery}%</td>
            <td>${r.signal}%</td>
            <td>${r.temperature}°C</td>
            <td class="${r.status.toLowerCase()}">${r.status} ${r.alertMessage ? '(' + r.alertMessage + ')' : ''}</td>
        </tr>
    `).join('');

    return `
        <h3>Telemetry Results</h3>
        <table class="results-table">
            <tr>
                <th>Drone ID</th>
                <th>Battery</th>
                <th>Signal</th>
                <th>Temperature</th>
                <th>Status</th>
            </tr>
            ${rows}
        </table>
    `;
}

// Browser environment specific logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const monitorBtn = document.getElementById('monitor-drones-btn');
        const resultsOutput = document.getElementById('results-output');

        const mockDrones = [
            { id: 'D-001', battery: 85, signal: 90, temperature: 45 },
            { id: 'D-002', battery: 15, signal: 85, temperature: 50 }, // Alert: Low Battery
            { id: 'D-003', battery: 90, signal: 20, temperature: 40 }, // Alert: Weak Signal
            { id: 'D-004', battery: 80, signal: 95, temperature: 90 }, // Alert: High Temp
            { id: 'D-005', battery: 10, signal: 10, temperature: 95 }  // Alert: Multiple
        ];

        monitorBtn.addEventListener('click', () => {
            resultsOutput.innerHTML = '<p>Checking telemetry...</p>';

            setTimeout(() => {
                const results = checkTelemetry(mockDrones);
                resultsOutput.innerHTML = generateResultsHTML(results);
            }, 500); // Simulate processing time
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkTelemetry, generateResultsHTML };
}