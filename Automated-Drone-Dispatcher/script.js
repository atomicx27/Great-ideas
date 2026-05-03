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
    module.exports = { assignDrone };
}