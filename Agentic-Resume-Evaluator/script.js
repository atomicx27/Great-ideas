/**
 * Simulated Agentic Loop for Resume Evaluation.
 */
async function runAgenticEvaluation(config, jobDesc, resume, logger) {
    logger("Agent initialized. Goal: Evaluate resume against job description.");

    // Step 1: Initial Parsing
    logger("Action: Calling LLM to parse key requirements and candidate skills.");
    const parsePrompt = `
    Job Description:
    ${jobDesc}

    Resume:
    ${resume}

    Extract a list of required skills from the Job Description, and a list of skills the candidate possesses based on the Resume. Format as JSON.
    {"required": ["skill1"], "candidate": ["skill1"]}
    `;

    let parsedDataStr = "";
    try {
        if (config.provider === 'openai') {
            parsedDataStr = await fetchOpenAI(config.key, config.model, "You are an expert HR system. Respond only with valid JSON.", parsePrompt);
        } else if (config.provider === 'anthropic') {
            parsedDataStr = await fetchAnthropic(config.key, config.model, "You are an expert HR system. Respond only with valid JSON.", parsePrompt);
        } else {
            parsedDataStr = await fetchOllama(config.key, config.model, "You are an expert HR system. Respond only with valid JSON.", parsePrompt);
        }
    } catch (e) {
        logger(`Error parsing: ${e.message}`);
        throw e;
    }

    logger("Observation: Received parsed skills list.");

    // Step 2: Gap Analysis (Simulated tool)
    logger("Action: Performing Gap Analysis...");
    let parsedData = {};
    try {
        parsedData = JSON.parse(parsedDataStr);
    } catch(e) {
        parsedData = { required: [], candidate: [] };
    }

    const missing = (parsedData.required || []).filter(req =>
        !(parsedData.candidate || []).some(cand => cand.toLowerCase().includes(req.toLowerCase()))
    );

    logger(`Observation: Found missing skills: ${missing.join(', ') || 'None'}`);

    // Step 3: Final Evaluation
    logger("Action: Calling LLM to synthesize final recommendation.");
    const evalPrompt = `
    Job Description: ${jobDesc}
    Resume: ${resume}
    Missing Skills Identified: ${missing.join(', ')}

    Provide a comprehensive evaluation of the candidate. Include:
    1. Overall Fit (Score out of 100)
    2. Strengths
    3. Weaknesses (addressing missing skills)
    4. Final Recommendation (Interview or Reject)
    `;

    let finalEval = "";
    try {
         if (config.provider === 'openai') {
            finalEval = await fetchOpenAI(config.key, config.model, "You are a Senior Technical Recruiter.", evalPrompt);
        } else if (config.provider === 'anthropic') {
            finalEval = await fetchAnthropic(config.key, config.model, "You are a Senior Technical Recruiter.", evalPrompt);
        } else {
            finalEval = await fetchOllama(config.key, config.model, "You are a Senior Technical Recruiter.", evalPrompt);
        }
    } catch (e) {
        logger(`Error evaluating: ${e.message}`);
        throw e;
    }

    logger("Goal Accomplished: Evaluation Complete.");
    return finalEval;
}

if (typeof document !== 'undefined') {
    document.getElementById('evaluate-btn').addEventListener('click', async () => {
        const provider = document.getElementById('provider').value;
        const key = document.getElementById('apiKey').value;
        const model = document.getElementById('model').value;
        const jobDesc = document.getElementById('jobDesc').value;
        const resume = document.getElementById('resume').value;
        const logBox = document.getElementById('agent-log');
        const resultBox = document.getElementById('result');

        logBox.innerHTML = '';
        resultBox.innerHTML = 'Evaluating...';

        const logger = (msg) => {
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logBox.appendChild(div);
            logBox.scrollTop = logBox.scrollHeight;
        };

        try {
            const result = await runAgenticEvaluation({ provider, key, model }, jobDesc, resume, logger);
            resultBox.innerHTML = DOMPurify.sanitize(marked.parse(result));
        } catch (e) {
            resultBox.innerHTML = `<span style="color:red">Error: ${e.message}</span>`;
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAgenticEvaluation };
}
