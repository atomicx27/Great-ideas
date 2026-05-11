document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-item-form');
    const tableBody = document.getElementById('inventory-body');

    let inventory = [
        { id: 1, name: 'Printer Paper (Ream)', quantity: 25, threshold: 10 },
        { id: 2, name: 'Staplers', quantity: 5, threshold: 10 },
        { id: 3, name: 'Dry Erase Markers', quantity: 40, threshold: 20 }
    ];
    let nextId = 4;

    function renderTable() {
        tableBody.innerHTML = ''; // Clear existing rows
        inventory.forEach(item => {
            const isLow = item.quantity <= item.threshold;
            const statusText = isLow ? 'Low Stock' : 'In Stock';
            const statusClass = isLow ? 'status-low' : 'status-ok';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.threshold}</td>
                <td class="${statusClass}">${statusText}</td>
                <td class="action-buttons">
                    <button class="btn-decrease" data-id="${item.id}">-1</button>
                    <button class="btn-increase" data-id="${item.id}">+1</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.btn-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(parseInt(e.target.dataset.id), -1));
        });
        document.querySelectorAll('.btn-increase').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(parseInt(e.target.dataset.id), 1));
        });
    }

    function updateQuantity(id, change) {
        const item = inventory.find(i => i.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity < 0) item.quantity = 0; // Prevent negative stock
            renderTable();
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('item-name').value;
        const quantity = parseInt(document.getElementById('item-quantity').value);
        const threshold = parseInt(document.getElementById('item-threshold').value);

        if (name && !isNaN(quantity) && !isNaN(threshold)) {
            inventory.push({
                id: nextId++,
                name: name,
                quantity: quantity,
                threshold: threshold
            });
            renderTable();
            form.reset();
        }
    });

    // Initial render
    renderTable();
});