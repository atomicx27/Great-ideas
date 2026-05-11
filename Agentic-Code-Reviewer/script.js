document.addEventListener('DOMContentLoaded', () => {
    const providerSelect = document.getElementById('provider-select');
    const apiKeyGroup = document.getElementById('api-key-group');
    const modelGroup = document.getElementById('model-group');
    const runBtn = document.getElementById('run-agent-btn');
    const outputLog = document.getElementById('output-log');
    const codeInput = document.getElementById('code-input');
    const finalReviewContainer = document.getElementById('final-review');

    // UI Logic for Provider Selection
    providerSelect.addEventListener('change', (e) => {
        if (e.target.value === 'ollama') {
            apiKeyGroup.style.display = 'none';
            modelGroup.style.display = 'block';
        } else {
            apiKeyGroup.style.display = 'block';
            modelGroup.style.display = 'none';
        }
    });

    function appendLog(message, type = 'log-info') {
        const p = document.createElement('p');
        p.className = type;
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`; // Secure DOM update
        outputLog.appendChild(p);
        outputLog.scrollTop = outputLog.scrollHeight;
    }

    // Simulated Agent Tool
    const tools = {
        analyzeCodeSyntax: async (code) => {
            appendLog(`Executing Tool: analyzeCodeSyntax()`, 'log-action');
            return new Promise(resolve => setTimeout(() => {
                resolve("Syntax OK. Contains fetch API without error handling. Uses old 'let' string concatenation instead of template literals.");
            }, 1500));
        },
        generateReviewReport: async (code, analysis) => {
            appendLog(`Executing Tool: generateReviewReport()`, 'log-action');
            return new Promise(resolve => setTimeout(() => {
                const report = `### Code Review Summary

Your code is functional, but there are a few areas for improvement regarding modern JavaScript practices and error handling.

**1. Template Literals**
Instead of using string concatenation (\`+\`), use template literals for better readability.

**2. Error Handling**
The \`fetch\` API does not reject on HTTP error statuses. You should check \`res.ok\`. Furthermore, there is no \`.catch()\` block for network errors.

**3. Async/Await (Optional but recommended)**
Consider refactoring to use \`async/await\` for cleaner asynchronous flow.

#### Suggested Refactor:
\`\`\`javascript
async function fetchUserData(id) {
    try {
        const url = \`https://api.example.com/users/\${id}\`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(\`HTTP error! status: \${res.status}\`);
        }

        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}
\`\`\`
`;
                resolve(report);
            }, 2000));
        }
    };

    // Agent Simulation Logic
    runBtn.addEventListener('click', async () => {
        const provider = providerSelect.value;
        const code = codeInput.value;

        outputLog.innerHTML = '';
        finalReviewContainer.innerHTML = '';
        finalReviewContainer.classList.add('hidden');

        appendLog(`Starting Code Review Agent. Provider: ${provider.toUpperCase()}`, 'log-info');
        runBtn.disabled = true;

        try {
            appendLog(`Thinking: First, I need to parse the code and analyze its syntax and patterns.`, 'log-thought');
            const analysis = await tools.analyzeCodeSyntax(code);
            appendLog(`Observation: Analysis complete. ${analysis}`, 'log-info');

            appendLog(`Thinking: Now I will synthesize this analysis into a comprehensive markdown review for the developer.`, 'log-thought');
            const reportMarkdown = await tools.generateReviewReport(code, analysis);
            appendLog(`Observation: Review report generated.`, 'log-success');

            appendLog('Thinking: Task complete. Displaying the review.', 'log-thought');

            // Securely render Markdown to HTML using DOMPurify
            const rawHtml = marked.parse(reportMarkdown);
            const cleanHtml = DOMPurify.sanitize(rawHtml);
            finalReviewContainer.innerHTML = cleanHtml;
            finalReviewContainer.classList.remove('hidden');

            appendLog('Agent Finished.', 'log-success');

        } catch (error) {
            appendLog(`Error during agent execution: ${error}`, 'log-error');
        } finally {
            runBtn.disabled = false;
        }
    });
});