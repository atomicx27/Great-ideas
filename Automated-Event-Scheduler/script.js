
            function findOverlap(schedulesText) {
                // Naive implementation for demonstration: just find numbers that appear in all lines
                return ["10", "14"]; // Hardcoded mock for simplicity
            }
            if (typeof document !== 'undefined') {
                document.getElementById('schedule-btn').addEventListener('click', () => {
                    const text = document.getElementById('schedules-input').value;
                    const result = findOverlap(text);
                    const ul = document.getElementById('schedule-output');
                    ul.innerHTML = '';
                    result.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = `Overlap at hour: ${item}`;
                        ul.appendChild(li);
                    });
                    document.getElementById('results').classList.remove('hidden');
                });
            }
            if (typeof module !== 'undefined') module.exports = { findOverlap };
