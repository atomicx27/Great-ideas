function checkContainmentStatus(magneticField, temperature) {
    if (magneticField < 0.5) {
        return { status: 'CRITICAL', message: 'Magnetic field collapse imminent. Containment failure likely.' };
    }
    if (temperature > 10.0) {
        return { status: 'WARNING', message: 'Temperature exceeding safe operational limits. Cooling system required.' };
    }
    return { status: 'SAFE', message: 'Containment parameters nominal.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('check-btn');
        const magInput = document.getElementById('magnetic-input');
        const tempInput = document.getElementById('temperature-input');
        const display = document.getElementById('results-display');
        const statusText = document.getElementById('status-text');

        btn.addEventListener('click', () => {
            const mag = parseFloat(magInput.value);
            const temp = parseFloat(tempInput.value);

            const result = checkContainmentStatus(mag, temp);

            let html = `<p>Magnetic Field: ${mag} T</p>`;
            html += `<p>Temperature: ${temp} K</p>`;

            if (result.status === 'CRITICAL') {
                html += `<p class="threat-high">ALERT: ${result.message}</p>`;
                statusText.textContent = 'Status: Containment Breach Risk';
                statusText.style.color = 'var(--danger-color)';
            } else if (result.status === 'WARNING') {
                html += `<p style="color: #ffaa00">WARNING: ${result.message}</p>`;
                statusText.textContent = 'Status: Warning';
                statusText.style.color = '#ffaa00';
            } else {
                html += `<p class="threat-low">${result.message}</p>`;
                statusText.textContent = 'Status: Nominal';
                statusText.style.color = 'var(--safe-color)';
            }

            display.innerHTML = html;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkContainmentStatus };
}
