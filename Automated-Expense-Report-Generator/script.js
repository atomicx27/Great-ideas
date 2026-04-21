document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const processBtn = document.getElementById('process-btn');
    const resultsSection = document.getElementById('results-section');
    const expenseList = document.getElementById('expense-list');
    const totalAmountEl = document.getElementById('total-amount');
    const totalItemsEl = document.getElementById('total-items');

    // Simulated OCR and Rule-based categorization data
    const mockReceiptsData = [
        { vendor: "Uber", amount: 45.50, date: "2023-10-24" },
        { vendor: "Starbucks", amount: 8.75, date: "2023-10-24" },
        { vendor: "Delta Airlines", amount: 450.00, date: "2023-10-25" },
        { vendor: "Marriott Hotels", amount: 320.00, date: "2023-10-26" },
        { vendor: "Office Depot", amount: 124.99, date: "2023-10-27" }
    ];

    // Automation Rules Engine (Deterministic, No AI)
    function categorizeExpense(vendor) {
        const lowerVendor = vendor.toLowerCase();
        if (lowerVendor.includes('uber') || lowerVendor.includes('lyft') || lowerVendor.includes('airlines')) {
            return "Transportation";
        }
        if (lowerVendor.includes('starbucks') || lowerVendor.includes('restaurant')) {
            return "Meals & Entertainment";
        }
        if (lowerVendor.includes('hotel') || lowerVendor.includes('marriott')) {
            return "Lodging";
        }
        if (lowerVendor.includes('office')) {
            return "Supplies";
        }
        return "Other";
    }

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processBtn.classList.remove('hidden');
        }
    });

    processBtn.addEventListener('click', () => {
        // Simulate processing delay
        processBtn.innerText = "Processing via OCR...";
        processBtn.disabled = true;

        setTimeout(() => {
            renderResults();
            resultsSection.classList.remove('hidden');
            processBtn.classList.add('hidden');
            processBtn.innerText = "Process Receipts";
            processBtn.disabled = false;
        }, 1500);
    });

    function renderResults() {
        expenseList.innerHTML = '';
        let total = 0;

        mockReceiptsData.forEach(receipt => {
            const category = categorizeExpense(receipt.vendor);
            total += receipt.amount;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${receipt.date}</td>
                <td>${receipt.vendor}</td>
                <td><span class="badge" style="background: #334155;">${category}</span></td>
                <td>$${receipt.amount.toFixed(2)}</td>
                <td><span class="status-badge">Categorized</span></td>
            `;
            expenseList.appendChild(row);
        });

        totalAmountEl.innerText = `$${total.toFixed(2)}`;
        totalItemsEl.innerText = mockReceiptsData.length;
    }
});