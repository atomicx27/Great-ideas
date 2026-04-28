// Deterministic validation logic
function inspectProduct(temperature, size) {
    const minTemp = 60.0;
    const maxTemp = 80.0;
    const minSize = 9.5;
    const maxSize = 10.5;

    let reasons = [];

    if (temperature < minTemp || temperature > maxTemp) {
        reasons.push(`Temperature (${temperature}°C) out of bounds`);
    }
    if (size < minSize || size > maxSize) {
        reasons.push(`Size (${size}mm) out of bounds`);
    }

    if (reasons.length > 0) {
        return { passed: false, message: "DEFECTIVE: " + reasons.join(", ") };
    }

    return { passed: true, message: "PASSED: Product meets all quality standards." };
}

// Browser UI Logic
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
        const form = document.getElementById('qc-form');
        const output = document.getElementById('qc-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const temp = parseFloat(document.getElementById('temperature').value);
            const size = parseFloat(document.getElementById('size').value);

            const result = inspectProduct(temp, size);

            output.innerHTML = ''; // Clear previous
            const p = document.createElement('p');
            p.textContent = result.message;
            p.className = result.passed ? 'pass' : 'fail';
            output.appendChild(p);

            showToast(result.passed ? "Scan complete: PASSED" : "Scan complete: FAILED");
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { inspectProduct };
}
