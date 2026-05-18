const asteroidDatabase = [
    { id: "A-101", name: "Ryugu", pgmContent: 2.1, distanceAU: 1.2 },
    { id: "B-205", name: "Psyche", pgmContent: 12.5, distanceAU: 2.9 },
    { id: "C-309", name: "Bennu", pgmContent: 1.5, distanceAU: 0.9 },
    { id: "D-412", name: "Eros", pgmContent: 6.2, distanceAU: 1.4 },
    { id: "E-555", name: "Kleopatra", pgmContent: 8.8, distanceAU: 2.7 }
];

function filterAsteroids(asteroids, minPgm, maxDist) {
    return asteroids.filter(a => a.pgmContent >= minPgm && a.distanceAU <= maxDist);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const scanBtn = document.getElementById('scan-btn');
        const minPgmInput = document.getElementById('min-pgm');
        const maxDistInput = document.getElementById('max-dist');
        const resultsOutput = document.getElementById('results-output');
        const targetList = document.getElementById('target-list');

        scanBtn.addEventListener('click', () => {
            const minPgm = parseFloat(minPgmInput.value);
            const maxDist = parseFloat(maxDistInput.value);

            const targets = filterAsteroids(asteroidDatabase, minPgm, maxDist);

            resultsOutput.classList.remove('hidden');
            targetList.innerHTML = '';

            if (targets.length === 0) {
                targetList.innerHTML = '<li>No viable targets found matching criteria.</li>';
            } else {
                targets.forEach(t => {
                    const li = document.createElement('li');
                    li.textContent = `[${t.id}] ${t.name} - PGM: ${t.pgmContent}% | Dist: ${t.distanceAU} AU`;
                    targetList.appendChild(li);
                });
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { filterAsteroids, asteroidDatabase };
}