// Automated Pitch Tracker

// Strike zone definition (coordinates in feet)
const ZONE = { xMin: -0.83, xMax: 0.83, yMin: 1.5, yMax: 3.5 };

function generatePitches(count) {
    const pitches = [];
    for (let i = 0; i < count; i++) {
        pitches.push({
            id: i + 1,
            speed: (Math.random() * 20 + 80).toFixed(1), // 80-100 mph
            x: (Math.random() * 3 - 1.5).toFixed(2),     // -1.5 to 1.5 feet
            y: (Math.random() * 4 + 0.5).toFixed(2)      // 0.5 to 4.5 feet
        });
    }
    return pitches;
}

function evaluatePitch(pitch) {
    const x = parseFloat(pitch.x);
    const y = parseFloat(pitch.y);

    if (x >= ZONE.xMin && x <= ZONE.xMax && y >= ZONE.yMin && y <= ZONE.yMax) {
        return 'Strike';
    } else {
        return 'Ball';
    }
}

async function runTracker() {
    if (typeof document === 'undefined') return;

    const btn = document.getElementById('track-btn');
    const statusText = document.getElementById('status-text');
    btn.disabled = true;
    statusText.textContent = 'Status: Tracking...';

    const pitches = generatePitches(10);
    const tbody = document.querySelector('#pitch-log tbody');
    tbody.innerHTML = '';

    let strikes = 0;
    let balls = 0;

    for (const pitch of pitches) {
        await new Promise(r => setTimeout(r, 200)); // UI delay

        const call = evaluatePitch(pitch);
        if (call === 'Strike') strikes++;
        else balls++;

        const row = document.createElement('tr');
        const callClass = call === 'Strike' ? 'strike' : 'ball';
        row.innerHTML = `
            <td>${pitch.id}</td>
            <td>${pitch.speed}</td>
            <td>${pitch.x}</td>
            <td>${pitch.y}</td>
            <td class="${callClass}">${call}</td>
        `;
        tbody.appendChild(row);

        document.getElementById('total-count').textContent = pitch.id;
        document.getElementById('strike-count').textContent = strikes;
        document.getElementById('ball-count').textContent = balls;
    }

    document.getElementById('results-panel').classList.remove('hidden');
    statusText.textContent = 'Status: Complete';
    btn.disabled = false;
}

if (typeof document !== 'undefined') {
    document.getElementById('track-btn').addEventListener('click', runTracker);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generatePitches, evaluatePitch, ZONE };
}