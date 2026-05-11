function calculateDistance(satA, satB) {
    const dx = satA.x - satB.x;
    const dy = satA.y - satB.y;
    const dz = satA.z - satB.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

function checkCollisionRisk(distance) {
    if (distance < 5.0) {
        return { status: 'Critical Collision Risk', class: 'critical' };
    }
    if (distance < 20.0) {
        return { status: 'Warning: Close Proximity', class: 'warning' };
    }
    return { status: 'Clear: Safe Distance', class: 'clear' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('traffic-form');
        const outputCard = document.getElementById('output-card');
        const alertOutput = document.getElementById('alert-output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const satA = {
                x: parseFloat(document.getElementById('a-x').value),
                y: parseFloat(document.getElementById('a-y').value),
                z: parseFloat(document.getElementById('a-z').value)
            };
            const satB = {
                x: parseFloat(document.getElementById('b-x').value),
                y: parseFloat(document.getElementById('b-y').value),
                z: parseFloat(document.getElementById('b-z').value)
            };

            const distance = calculateDistance(satA, satB);
            const result = checkCollisionRisk(distance);

            alertOutput.innerHTML = `<div class="alert-level ${result.class}">${result.status} (Dist: ${distance.toFixed(2)} km)</div>`;
            outputCard.style.display = 'block';
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateDistance, checkCollisionRisk };
}
