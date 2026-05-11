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
function assignDrone(weight, distance) {
    if (weight > 10) {
        return { success: false, message: "Error: Package exceeds maximum weight capacity of 10kg." };
    }
    if (distance > 50) {
        return { success: false, message: "Error: Delivery distance exceeds maximum range of 50km." };
    }

    let droneModel = "";

    if (weight <= 2 && distance <= 10) {
        droneModel = "Light-Scout-D1";
    } else if (weight <= 5 && distance <= 25) {
        droneModel = "Standard-Carrier-D2";
    } else {
        droneModel = "Heavy-Lifter-D3";
    }

    return { success: true, message: `Assigned Drone: ${droneModel}` };
}

if (typeof document !== 'undefined') {
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('dispatch-form');
        const output = document.getElementById('output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const weight = parseFloat(document.getElementById('weight').value);
            const distance = parseFloat(document.getElementById('distance').value);

            const result = assignDrone(weight, distance);

            output.innerHTML = '';
            const p = document.createElement('p');
            p.textContent = result.message;
            p.className = result.success ? 'success' : 'error';
            output.appendChild(p);

            showToast(result.success ? "Dispatch Assigned" : "Dispatch Failed");
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { determineDispatch };
    module.exports = { assignDrone };
}