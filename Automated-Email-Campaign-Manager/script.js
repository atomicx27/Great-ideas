/**
 * Deterministically generates emails based on a template and a CSV contact list.
 * @param {string} csvText - The CSV contacts.
 * @param {string} template - The email template with placeholders.
 * @returns {Array} An array of objects containing the generated emails or errors.
 */
function generateEmails(csvText, template) {
    if (!csvText || !template) return [];

    const lines = csvText.trim().split('\n');
    const emails = [];

    for (const line of lines) {
        const parts = line.split(',').map(p => p.trim());

        if (parts.length >= 3) {
            const name = parts[0];
            const company = parts[1];
            const email = parts[2];

            let body = template.replace(/{Name}/g, name).replace(/{Company}/g, company);

            emails.push({
                success: true,
                to: email,
                body: body
            });
        } else {
            emails.push({
                success: false,
                error: `Invalid CSV line: ${line}`
            });
        }
    }

    return emails;
}

if (typeof document !== 'undefined') {
    document.getElementById('generate-btn').addEventListener('click', () => {
        const contacts = document.getElementById('contacts').value;
        const template = document.getElementById('template').value;
        const resultBox = document.getElementById('result');

        const results = generateEmails(contacts, template);
        resultBox.innerHTML = '';

        if (results.length === 0) {
            resultBox.innerHTML = 'No input provided.';
            return;
        }

        results.forEach(res => {
            const div = document.createElement('div');
            if (res.success) {
                div.className = 'email-item';
                div.innerHTML = `<strong>To:</strong> ${res.to}<br><br>${res.body}`;
            } else {
                div.className = 'email-item error-text';
                div.textContent = res.error;
            }
            resultBox.appendChild(div);
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateEmails };
}
