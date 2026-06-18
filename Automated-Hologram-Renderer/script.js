/**
 * Deterministically maps 3D coordinates to a 2D projection plane.
 * @param {Array<Object>} points - Array of {x, y, z} objects.
 * @param {string} plane - 'xy', 'xz', or 'yz'
 * @returns {Array<Object>} Projected 2D coordinates.
 */
function renderPointCloud(points, plane) {
    if (!Array.isArray(points)) throw new Error("Input must be an array of points.");

    return points.map(p => {
        if (typeof p.x !== 'number' || typeof p.y !== 'number' || typeof p.z !== 'number') {
            throw new Error("Invalid point format. Must contain x, y, and z numbers.");
        }

        switch(plane) {
            case 'xy': return { u: p.x, v: p.y };
            case 'xz': return { u: p.x, v: p.z };
            case 'yz': return { u: p.y, v: p.z };
            default: throw new Error("Invalid projection plane.");
        }
    });
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const renderBtn = document.getElementById('render-btn');
        const matrixInput = document.getElementById('data-matrix');
        const planeSelect = document.getElementById('projection-plane');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const projectionOutput = document.getElementById('projection-output');

        renderBtn.addEventListener('click', () => {
            statusText.textContent = 'Status: Rendering...';
            renderBtn.disabled = true;

            setTimeout(() => {
                try {
                    const rawData = JSON.parse(matrixInput.value);
                    const plane = planeSelect.value;
                    const result = renderPointCloud(rawData, plane);

                    projectionOutput.textContent = JSON.stringify(result, null, 2);
                    resultsPanel.classList.remove('hidden');
                    statusText.textContent = 'Status: Render Complete';
                } catch (error) {
                    projectionOutput.textContent = `Error: ${error.message}`;
                    resultsPanel.classList.remove('hidden');
                    statusText.textContent = 'Status: Render Failed';
                } finally {
                    renderBtn.disabled = false;
                }
            }, 300); // Simulate processing delay
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderPointCloud };
}