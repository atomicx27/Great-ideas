/**
 * Automated Nanobot Dispenser
 */

const MAX_SAFE_DOSAGE = 500;

/**
 * Validates and dispenses nanobot dosage.
 * @param {number} dosage - The requested dosage in units
 * @returns {Object} - Status object { success: boolean, message: string }
 */
function dispenseNanobots(dosage) {
    if (dosage === undefined || dosage === null || isNaN(dosage)) {
        return { success: false, message: 'Error: Invalid dosage input.' };
    }

    if (dosage <= 0) {
        return { success: false, message: 'Error: Dosage must be greater than 0.' };
    }

    if (dosage > MAX_SAFE_DOSAGE) {
        return { success: false, message: `Error: Requested dosage (${dosage} units) exceeds maximum safe limit of ${MAX_SAFE_DOSAGE} units. Request denied.` };
    }

    return { success: true, message: `Success: Dispensing ${dosage} nanobot units.` };
}

// Browser environment bindings
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const dispenseBtn = document.getElementById('dispenseBtn');
        const dosageInput = document.getElementById('dosage');
        const statusOutput = document.getElementById('statusOutput');

        if (dispenseBtn) {
            dispenseBtn.addEventListener('click', () => {
                const dosage = parseFloat(dosageInput.value);

                const status = dispenseNanobots(dosage);

                statusOutput.textContent = status.message;
                statusOutput.className = 'status-box ' + (status.success ? 'success' : 'danger');
            });
        }
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { dispenseNanobots };
}
