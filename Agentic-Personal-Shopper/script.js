const mockTools = {
    searchInventory: (style) => {
        const inventory = {
            'casual': ['Jeans', 'T-Shirt', 'Sneakers'],
            'formal': ['Suit', 'Tie', 'Dress Shoes'],
            'sporty': ['Track Pants', 'Athletic Top', 'Running Shoes']
        };
        return inventory[style.toLowerCase()] || ['Unknown style items'];
    },
    checkAvailability: (items) => {
        return items.map(item => `${item} (In Stock)`);
    }
};

function determineOutfit(style) {
    const items = mockTools.searchInventory(style);
    if (items.includes('Unknown style items')) {
        return "I couldn't find matching items for that style in the inventory.";
    }
    const availableItems = mockTools.checkAvailability(items);
    return `Recommended outfit: ${availableItems.join(', ')}.`;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const shopBtn = document.getElementById('shop-btn');
        const styleInput = document.getElementById('style-input');
        const logArea = document.getElementById('log-area');

        function appendLog(message, type = 'log-info') {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = `> ${message}`;
            logArea.appendChild(p);
            logArea.scrollTop = logArea.scrollHeight;
        }

        shopBtn.addEventListener('click', () => {
            const style = styleInput.value;
            logArea.innerHTML = '';
            shopBtn.disabled = true;

            appendLog(`User requested style: "${style}"`, 'log-info');

            setTimeout(() => {
                appendLog('Thinking: I need to query the inventory for items matching this style.', 'log-thought');
            }, 800);

            setTimeout(() => {
                appendLog(`Executing tool: searchInventory('${style}')`, 'log-action');
                const items = mockTools.searchInventory(style);
                appendLog(`Observation: Found items [${items.join(', ')}]`, 'log-info');
            }, 1800);

            setTimeout(() => {
                appendLog('Thinking: I need to verify these items are in stock.', 'log-thought');
            }, 2800);

            setTimeout(() => {
                appendLog('Executing tool: checkAvailability()', 'log-action');
                appendLog('Observation: All items confirmed in stock.', 'log-info');
            }, 3800);

            setTimeout(() => {
                appendLog('Thinking: Synthesizing final recommendation.', 'log-thought');
                const plan = determineOutfit(style);
                appendLog(`Final Response: ${plan}`, 'log-success');
                shopBtn.disabled = false;
            }, 4800);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockTools, determineOutfit };
}
