function routeQuantumPackets(bandwidth, priority) {
    if (bandwidth <= 0) {
        return { success: false, path: 'None', message: 'Error: Bandwidth must be greater than 0.' };
    }
    if (priority < 1 || priority > 10) {
        return { success: false, path: 'None', message: 'Error: Priority must be between 1 and 10.' };
    }

    if (bandwidth <= 100 && priority <= 3) {
        return { success: true, path: 'Low-Capacity-Link-A', message: 'Routed via low-capacity link.' };
    } else if (bandwidth <= 500 && priority <= 7) {
        return { success: true, path: 'Medium-Capacity-Link-B', message: 'Routed via medium-capacity link.' };
    } else if (bandwidth > 500 && priority > 7) {
        return { success: true, path: 'High-Capacity-Link-C', message: 'Routed via high-capacity quantum trunk.' };
    } else {
        return { success: true, path: 'Default-Link-D', message: 'Routed via default link.' };
    }
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
        const form = document.getElementById('routing-form');
        const output = document.getElementById('output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const bandwidth = parseInt(document.getElementById('bandwidth').value, 10);
            const priority = parseInt(document.getElementById('priority').value, 10);

            const result = routeQuantumPackets(bandwidth, priority);

            output.innerHTML = '';
            const p = document.createElement('p');
            p.textContent = `Path: ${result.path} - ${result.message}`;
            p.className = result.success ? 'success' : 'error';
            output.appendChild(p);

            showToast(result.success ? "Routing Successful" : "Routing Failed");
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { routeQuantumPackets };
}
