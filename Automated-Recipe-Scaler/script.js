
            function scaleRecipe(recipeText, base, target) {
                const ratio = target / base;
                const lines = recipeText.split('\n');
                return lines.map(line => {
                    const match = line.match(/^([\d.]+)\s+(.*)$/);
                    if (match) {
                        const amount = parseFloat(match[1]) * ratio;
                        return `${amount} ${match[2]}`;
                    }
                    return line;
                });
            }
            if (typeof document !== 'undefined') {
                document.getElementById('scale-btn').addEventListener('click', () => {
                    const base = parseFloat(document.getElementById('base-servings').value);
                    const target = parseFloat(document.getElementById('target-servings').value);
                    const text = document.getElementById('recipe-input').value;
                    const result = scaleRecipe(text, base, target);
                    const ul = document.getElementById('scaled-recipe');
                    ul.innerHTML = '';
                    result.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        ul.appendChild(li);
                    });
                    document.getElementById('results').classList.remove('hidden');
                });
            }
            if (typeof module !== 'undefined') module.exports = { scaleRecipe };
