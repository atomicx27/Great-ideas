function allocateBuildingMaterials(volume, crew) {
    if (volume < 10) {
        return { success: false, message: 'Error: Minimum volume is 10 cubic meters.' };
    }
    if (crew < 1 || crew > 50) {
        return { success: false, message: 'Error: Crew size must be between 1 and 50.' };
    }

    // Material allocations
    const regolithConcrete = volume * 2.5; // kg
    const aluminumFrames = volume * 0.8; // kg
    const glassComposite = crew * 50; // kg

    return {
        success: true,
        materials: {
            regolithConcrete: regolithConcrete.toFixed(2),
            aluminumFrames: aluminumFrames.toFixed(2),
            glassComposite: glassComposite.toFixed(2)
        },
        message: 'Materials allocated successfully.'
    };
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
        const form = document.getElementById('build-form');
        const output = document.getElementById('output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const volume = parseFloat(document.getElementById('volume').value);
            const crew = parseInt(document.getElementById('crew').value, 10);

            const result = allocateBuildingMaterials(volume, crew);

            output.innerHTML = '';

            if (result.success) {
                output.innerHTML = `
                    <p class="success">${result.message}</p>
                    <ul>
                        <li><strong>Regolith Concrete:</strong> ${result.materials.regolithConcrete} kg</li>
                        <li><strong>Aluminum Frames:</strong> ${result.materials.aluminumFrames} kg</li>
                        <li><strong>Glass Composite:</strong> ${result.materials.glassComposite} kg</li>
                    </ul>
                `;
                showToast("Allocation Complete");
            } else {
                output.innerHTML = `<p class="error">${result.message}</p>`;
                showToast("Allocation Error");
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { allocateBuildingMaterials };
}
