function calculateAugmentation(baseSize, transformations) {
    if (baseSize <= 0) return { error: "Dataset size must be greater than zero." };
    if (transformations.length === 0) return { error: "Select at least one transformation." };

    // Deterministic rule: each selected transformation doubles the current dataset size sequentially
    let currentSize = baseSize;
    let log = [];

    transformations.forEach(t => {
        const added = currentSize;
        currentSize += added;
        log.push(`Applied ${t}: +${added} images.`);
    });

    return {
        baseSize: baseSize,
        finalSize: currentSize,
        multiplier: currentSize / baseSize,
        log: log
    };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('augment-form');
        const output = document.getElementById('output');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const size = parseInt(document.getElementById('dataset-size').value, 10);

            let selectedTransforms = [];
            if (document.getElementById('rot90').checked) selectedTransforms.push("90° Rotation");
            if (document.getElementById('grayscale').checked) selectedTransforms.push("Grayscale");
            if (document.getElementById('crop').checked) selectedTransforms.push("Center Crop");

            const result = calculateAugmentation(size, selectedTransforms);

            if (result.error) {
                output.innerHTML = `<p style="color: red;">${result.error}</p>`;
                return;
            }

            let detailsHtml = result.log.map(msg => `<li>${msg}</li>`).join('');

            output.innerHTML = `
                <p class="summary">Augmentation Complete: ${result.finalSize} total images (${result.multiplier}x multiplier)</p>
                <ul class="details">
                    <li>Base dataset: ${result.baseSize} images</li>
                    ${detailsHtml}
                </ul>
            `;
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateAugmentation };
}