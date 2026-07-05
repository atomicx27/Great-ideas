function mapWormholeTopology(exoticMatterDensity) {
    if (exoticMatterDensity <= -5.0) {
        return { isWormhole: true, stability: 'STABLE', message: 'Stable Einstein-Rosen bridge mapped.' };
    } else if (exoticMatterDensity <= -1.0) {
        return { isWormhole: true, stability: 'UNSTABLE', message: 'Unstable micro-wormhole detected.' };
    }
    return { isWormhole: false, stability: 'NONE', message: 'Normal space. No wormhole geometry.' };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('map-btn');
        const densityInput = document.getElementById('exotic-matter');
        const display = document.getElementById('results-display');

        btn.addEventListener('click', () => {
            const density = parseFloat(densityInput.value);

            if (isNaN(density)) {
                display.textContent = 'Error: Invalid density.';
                return;
            }

            const result = mapWormholeTopology(density);

            display.innerHTML = `<strong>Result:</strong> ${result.message}<br><strong>Stability:</strong> ${result.stability}`;
            display.className = 'status-display fade-in';

            if (result.stability === 'STABLE') {
                display.classList.add('alert-low');
            } else if (result.stability === 'UNSTABLE') {
                display.classList.add('alert-medium');
            } else {
                display.classList.add('alert-high');
            }
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { mapWormholeTopology };
}
