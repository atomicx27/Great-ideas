// Pure logic function for linting
function runLinter(code) {
    const issues = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();

        if (trimmed.length === 0) return; // Skip empty lines

        // Rule 1: No 'var' declarations
        if (trimmed.startsWith('var ')) {
            issues.push(`Line ${lineNum}: Use 'let' or 'const' instead of 'var'.`);
        }

        // Rule 2: Missing semicolon at the end of a statement (basic check)
        // Ignoring lines ending with {, }, or starting with comments/function/let/const declarations
        if (!trimmed.endsWith(';') &&
            !trimmed.endsWith('{') &&
            !trimmed.endsWith('}') &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('function') &&
            !trimmed.startsWith('if') &&
            !trimmed.startsWith('for') &&
            trimmed.length > 0) {

            // Very naive check, but serves the purpose of deterministic automation demonstration
            if (trimmed.includes('=')) {
                 issues.push(`Line ${lineNum}: Missing semicolon.`);
            }
        }

        // Rule 3: Console.log usage
        if (trimmed.includes('console.log')) {
            issues.push(`Line ${lineNum}: Unexpected 'console.log' statement.`);
        }
    });

    return issues;
}

// Browser environment specific logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const runBtn = document.getElementById('run-linter-btn');
        const codeInput = document.getElementById('code-input');
        const resultsOutput = document.getElementById('results-output');
        const lintIssuesList = document.getElementById('lint-issues');

        runBtn.addEventListener('click', () => {
            const code = codeInput.value;
            const issues = runLinter(code);

            resultsOutput.classList.remove('hidden');
            lintIssuesList.innerHTML = '';

            if (issues.length === 0) {
                lintIssuesList.innerHTML = '<li class="lint-success">No issues found! Code looks clean.</li>';
            } else {
                issues.forEach(issue => {
                    const li = document.createElement('li');
                    li.className = 'lint-issue';
                    li.textContent = issue; // Safe DOM API
                    lintIssuesList.appendChild(li);
                });
            }
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runLinter };
}