function determineDispatch(weight, distance) {
    if (weight <= 0 || distance <= 0) {
        return { droneClass: 'Invalid', status: 'Rejected', message: 'Weight and distance must be greater than 0.' };
    }

    if (weight <= 2.5 && distance <= 10) {
        return { droneClass: 'Lightweight Quadcopter', status: 'Approved', message: 'Assigned for short-range light delivery.' };
    } else if (weight <= 5.0 && distance <= 25) {
        return { droneClass: 'Medium Hexacopter', status: 'Approved', message: 'Assigned for medium-range delivery.' };
    } else if (weight <= 15.0 && distance <= 50) {
        return { droneClass: 'Heavy-Duty Octocopter', status: 'Approved', message: 'Assigned for long-range heavy delivery.' };
    } else {
        return { droneClass: 'None', status: 'Rejected', message: 'Exceeds current drone capabilities. Reroute to ground transport.' };
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('dispatch-form');
        const output = document.getElementById('routing-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('weight').value);
            const distance = parseFloat(document.getElementById('distance').value);

            const result = determineDispatch(weight, distance);

            output.innerHTML = `
                <p><strong>Drone Class:</strong> ${result.droneClass}</p>
                <p><strong>Status:</strong> <span style="color: ${result.status === 'Approved' ? 'green' : 'red'}; font-weight: bold;">${result.status}</span></p>
                <p><strong>Note:</strong> ${result.message}</p>
            `;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { determineDispatch };
}