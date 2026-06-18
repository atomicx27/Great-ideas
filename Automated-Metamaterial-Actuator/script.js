/**
 * Calculates the actuation sequence based on deterministic rules.
 * @param {string} materialType - The type of metamaterial (e.g., 'auxetic', 'chiral', 'origami').
 * @param {string} targetState - The desired target state (e.g., 'expanded', 'contracted', 'twisted').
 * @returns {string} The calculated actuation sequence.
 */
function calculateActuationSequence(materialType, targetState) {
    if (materialType === 'auxetic') {
        if (targetState === 'expanded') return 'Apply uniform outward tension';
        if (targetState === 'contracted') return 'Apply uniform inward compression';
        if (targetState === 'twisted') return 'Invalid target state for auxetic material';
    } else if (materialType === 'chiral') {
        if (targetState === 'expanded') return 'Apply counter-clockwise torque';
        if (targetState === 'contracted') return 'Apply clockwise torque';
        if (targetState === 'twisted') return 'Apply longitudinal force';
    } else if (materialType === 'origami') {
        if (targetState === 'expanded') return 'Unfold valley folds, then mountain folds';
        if (targetState === 'contracted') return 'Fold mountain folds, then valley folds';
        if (targetState === 'twisted') return 'Apply sheer force along crease pattern';
    }

    return 'Unknown material or state';
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const actuateBtn = document.getElementById('actuate-btn');
        const materialTypeSelect = document.getElementById('material-type');
        const targetStateSelect = document.getElementById('target-state');
        const statusText = document.getElementById('status-text');
        const resultsPanel = document.getElementById('results-panel');
        const sequenceOutput = document.getElementById('sequence-output');

        actuateBtn.addEventListener('click', () => {
            statusText.textContent = 'Status: Calculating...';
            actuateBtn.disabled = true;

            setTimeout(() => {
                const materialType = materialTypeSelect.value;
                const targetState = targetStateSelect.value;

                const sequence = calculateActuationSequence(materialType, targetState);

                sequenceOutput.textContent = sequence;
                resultsPanel.classList.remove('hidden');

                statusText.textContent = 'Status: Sequence Calculated';
                actuateBtn.disabled = false;
            }, 500); // Simulate processing time
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateActuationSequence };
}