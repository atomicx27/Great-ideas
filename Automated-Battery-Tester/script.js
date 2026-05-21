function generateBatteryBatch(size) {
    const batch = [];
    for (let i = 0; i < size; i++) {
        // Generate capacity between 4000 and 5000 mAh
        const capacity = Math.floor(Math.random() * 1000) + 4000;
        batch.push({
            id: `BAT-${1000 + i}`,
            capacity: capacity
        });
    }
    return batch;
}

function processBattery(battery, minCapacity) {
    if (battery.capacity >= minCapacity) {
        return { action: 'PASS', class: 'action-keep' };
    } else {
        return { action: 'FAIL', class: 'action-drop' };
    }
}

function updateUI(log, stats) {
    if (typeof document === 'undefined') return;

    const tbody = document.querySelector('#test-log tbody');
    tbody.innerHTML = '';

    log.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.id}</td>
            <td>${entry.capacity}</td>
            <td class="${entry.result.class}">${entry.result.action}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('total-count').textContent = stats.total;
    document.getElementById('passed-count').textContent = stats.passed;
    document.getElementById('failed-count').textContent = stats.failed;
    document.getElementById('results-panel').classList.remove('hidden');
    document.getElementById('status-text').textContent = 'Status: Batch Complete';
    document.getElementById('status-text').style.color = 'var(--accent-green)';
}

async function runTestBatch() {
    if (typeof document === 'undefined') return;

    const testBtn = document.getElementById('test-btn');
    const statusText = document.getElementById('status-text');
    const minCapacity = parseInt(document.getElementById('min-capacity').value, 10);

    testBtn.disabled = true;
    statusText.textContent = 'Status: Processing Batch...';
    statusText.style.color = 'var(--accent-orange)';

    const batchSize = 20;
    const batteries = generateBatteryBatch(batchSize);
    const log = [];
    let stats = { total: batchSize, passed: 0, failed: 0 };

    for (const battery of batteries) {
        // Artificial delay for UI animation effect
        await new Promise(r => setTimeout(r, 50));

        const result = processBattery(battery, minCapacity);
        if (result.action === 'PASS') stats.passed++;
        if (result.action === 'FAIL') stats.failed++;

        log.push({
            id: battery.id,
            capacity: battery.capacity,
            result: result
        });
    }

    updateUI(log, stats);
    testBtn.disabled = false;
}

if (typeof document !== 'undefined') {
    document.getElementById('test-btn').addEventListener('click', runTestBatch);
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateBatteryBatch,
        processBattery
    };
}