function getNextState(currentState, pedestrianWaiting) {
    if (pedestrianWaiting && currentState === 'green') {
        return 'yellow';
    }
    switch (currentState) {
        case 'green': return 'yellow';
        case 'yellow': return 'red';
        case 'red': return 'green';
        default: return 'red';
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        let state = 'red';
        let pedestrianWaiting = false;

        const lights = {
            red: document.getElementById('red'),
            yellow: document.getElementById('yellow'),
            green: document.getElementById('green')
        };
        const btn = document.getElementById('pedestrian-btn');
        const status = document.getElementById('status-message');

        function updateUI() {
            Object.values(lights).forEach(l => l.classList.remove('active'));
            lights[state].classList.add('active');
        }

        btn.addEventListener('click', () => {
            pedestrianWaiting = true;
            status.textContent = 'Status: Pedestrian Waiting...';
            btn.disabled = true;
        });

        setInterval(() => {
            state = getNextState(state, pedestrianWaiting);
            if (state === 'red' && pedestrianWaiting) {
                status.textContent = 'Status: Pedestrian Crossing';
                setTimeout(() => {
                    pedestrianWaiting = false;
                    status.textContent = 'Status: Normal Operation';
                    btn.disabled = false;
                }, 2000);
            }
            updateUI();
        }, 3000);

        updateUI();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getNextState };
}
