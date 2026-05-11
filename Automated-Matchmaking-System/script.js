function generateMatches(queue, maxMmrDiff = 100) {
    let sortedQueue = [...queue].sort((a, b) => a - b);
    let matches = [];
    let remaining = [];

    while (sortedQueue.length >= 2) {
        let p1 = sortedQueue[0];
        let p2 = sortedQueue[1];

        if (Math.abs(p1 - p2) <= maxMmrDiff) {
            matches.push([p1, p2]);
            sortedQueue.splice(0, 2);
        } else {
            remaining.push(sortedQueue.shift());
        }
    }

    remaining = remaining.concat(sortedQueue);
    return { matches, remaining };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        let playerQueue = [1200, 1250, 1800, 1820, 2500]; // initial mock data

        const mmrInput = document.getElementById('player-mmr');
        const queueBtn = document.getElementById('queue-btn');
        const matchBtn = document.getElementById('match-btn');
        const queueList = document.getElementById('player-queue');
        const matchList = document.getElementById('match-list');

        function renderQueue() {
            queueList.innerHTML = '';
            playerQueue.forEach(mmr => {
                const li = document.createElement('li');
                li.textContent = `Player MMR: ${mmr}`;
                queueList.appendChild(li);
            });
        }

        queueBtn.addEventListener('click', () => {
            const mmr = parseInt(mmrInput.value, 10);
            if (!isNaN(mmr)) {
                playerQueue.push(mmr);
                renderQueue();
            }
        });

        matchBtn.addEventListener('click', () => {
            const result = generateMatches(playerQueue);
            playerQueue = result.remaining;

            renderQueue();

            result.matches.forEach(match => {
                const li = document.createElement('li');
                li.textContent = `Match: ${match[0]} vs ${match[1]}`;
                matchList.appendChild(li);
            });
        });

        renderQueue();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateMatches };
}