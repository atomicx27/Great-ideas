function calculateBrickCoordinates(wallDimensions, brickSize) {
    const { wallWidth, wallHeight } = wallDimensions;
    const { brickWidth, brickHeight, mortarJoint } = brickSize;

    const coordinates = [];

    const effectiveBrickWidth = brickWidth + mortarJoint;
    const effectiveBrickHeight = brickHeight + mortarJoint;

    const numRows = Math.floor(wallHeight / effectiveBrickHeight);
    const numCols = Math.floor(wallWidth / effectiveBrickWidth);

    let brickId = 1;

    for (let row = 0; row < numRows; row++) {
        // Stretcher bond pattern: offset alternate rows by half a brick
        const offset = (row % 2 !== 0) ? (effectiveBrickWidth / 2) : 0;

        for (let col = 0; col < numCols; col++) {
            const x = (col * effectiveBrickWidth) + offset;
            const y = row * effectiveBrickHeight;
            const z = 0; // Assuming 1D wall thickness for simplicity

            // Only add if it fits within the wall bounds
            if (x + brickWidth <= wallWidth) {
                coordinates.push({ id: brickId++, x, y, z });
            }
        }
    }

    return coordinates;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const calculateBtn = document.getElementById('calculate-btn');
        const wallWidthInput = document.getElementById('wall-width');
        const wallHeightInput = document.getElementById('wall-height');
        const brickWidthInput = document.getElementById('brick-width');
        const brickHeightInput = document.getElementById('brick-height');
        const mortarJointInput = document.getElementById('mortar-joint');

        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const totalBricksEl = document.getElementById('total-bricks');
        const coordinateLog = document.querySelector('#coordinate-log tbody');

        calculateBtn.addEventListener('click', () => {
            calculateBtn.disabled = true;
            statusText.innerText = "Status: Generating coordinates...";
            resultsPanel.classList.add('hidden');
            coordinateLog.innerHTML = '';

            const wallDimensions = {
                wallWidth: parseFloat(wallWidthInput.value),
                wallHeight: parseFloat(wallHeightInput.value)
            };

            const brickSize = {
                brickWidth: parseFloat(brickWidthInput.value),
                brickHeight: parseFloat(brickHeightInput.value),
                mortarJoint: parseFloat(mortarJointInput.value)
            };

            setTimeout(() => {
                const coords = calculateBrickCoordinates(wallDimensions, brickSize);

                totalBricksEl.innerText = coords.length;

                // Display first 10 for performance
                const displayCoords = coords.slice(0, 10);

                displayCoords.forEach(c => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${c.id}</td>
                        <td>${c.x}</td>
                        <td>${c.y}</td>
                        <td>${c.z}</td>
                    `;
                    coordinateLog.appendChild(row);
                });

                statusText.innerText = "Status: Generation Complete";
                resultsPanel.classList.remove('hidden');
                calculateBtn.disabled = false;
            }, 500);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { calculateBrickCoordinates };
}