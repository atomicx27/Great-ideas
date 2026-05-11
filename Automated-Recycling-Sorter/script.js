// Deterministic Sorting Logic
function determineBin(sensorData) {
    // Metal detection takes priority
    if (sensorData.metallicReflection > 80) {
        return 'metal';
    }
    // Optical density sorting
    if (sensorData.opticalDensity > 70) {
        return 'plastic';
    } else if (sensorData.opticalDensity > 30 && sensorData.opticalDensity <= 70) {
        return 'paper';
    }
    // Default reject
    return 'reject';
}

// UI Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('run-conveyor');
        const stopBtn = document.getElementById('stop-conveyor');
        const sensorReadout = document.getElementById('sensor-readout');

        const binEls = {
            metal: { container: document.getElementById('bin-metal'), countEl: document.querySelector('#bin-metal .count'), count: 0 },
            plastic: { container: document.getElementById('bin-plastic'), countEl: document.querySelector('#bin-plastic .count'), count: 0 },
            paper: { container: document.getElementById('bin-paper'), countEl: document.querySelector('#bin-paper .count'), count: 0 },
            reject: { container: document.getElementById('bin-reject'), countEl: document.querySelector('#bin-reject .count'), count: 0 }
        };

        let interval;

        function clearActiveBins() {
            Object.values(binEls).forEach(bin => bin.container.classList.remove('active'));
        }

        function processItem() {
            clearActiveBins();

            // Simulate raw sensor reading
            const rawData = {
                metallicReflection: Math.floor(Math.random() * 100),
                opticalDensity: Math.floor(Math.random() * 100)
            };

            sensorReadout.textContent = `[Sensors] Metal: ${rawData.metallicReflection} | Optic: ${rawData.opticalDensity}`;

            const targetBin = determineBin(rawData);

            binEls[targetBin].count++;
            binEls[targetBin].countEl.textContent = binEls[targetBin].count;
            binEls[targetBin].container.classList.add('active');
        }

        startBtn.addEventListener('click', () => {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            sensorReadout.textContent = 'Conveyor running...';
            interval = setInterval(processItem, 1000);
        });

        stopBtn.addEventListener('click', () => {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            clearInterval(interval);
            sensorReadout.textContent = 'Conveyor stopped.';
            clearActiveBins();
        });
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { determineBin };
}