// Core Logic (Testable)
function evaluateReturnRequest(requestStr) {
    try {
        if (!requestStr || requestStr.trim() === '') {
            return { isValid: false, error: "Empty request" };
        }

        const LTVMatch = requestStr.match(/LTV\)?:\s*\$?([\d,]+)/i);
        const LTV = LTVMatch ? parseInt(LTVMatch[1].replace(/,/g, ''), 10) : 0;

        return {
            isValid: true,
            isVIP: requestStr.toLowerCase().includes('vip'),
            estimatedLTV: LTV
        };
    } catch (e) {
        return { isValid: false, error: "Parsing error" };
    }
}

async function negotiateReturnOptions(config, fetchLLMFn) {
    const analysis = evaluateReturnRequest(config.customerProfile);
    if (!analysis.isValid) {
        throw new Error(analysis.error);
    }

    const sysPrompt = `You are an Agentic E-Commerce Return Negotiator.
Your goal is to retain revenue by offering alternatives to a full cash refund.
Analyze the customer profile and return details.
Generate 3 distinct negotiation offers (e.g., store credit with bonus, keep item with partial refund, exchange for different model).
Format the output in clear Markdown.`;

    const userMessage = `Customer Profile:\n${config.customerProfile}\n\nReturn Details:\n${config.returnDetails}`;

    return await fetchLLMFn(config.provider, config.apiKey, sysPrompt, userMessage);
}

// Module export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateReturnRequest, negotiateReturnOptions };
}

// UI Logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btnNegotiate = document.getElementById('btn-negotiate');
        const providerSelect = document.getElementById('llm-provider');
        const apiKeyInput = document.getElementById('api-key');
        const apiKeyContainer = document.getElementById('api-key-container');

        const customerProfileInput = document.getElementById('customer-profile');
        const returnDetailsInput = document.getElementById('return-details');
        const outputDiv = document.getElementById('agent-output');
        const loadingDiv = document.getElementById('loading');

        providerSelect.addEventListener('change', (e) => {
            apiKeyContainer.classList.toggle('hidden', e.target.value === 'ollama');
        });

        async function fetchLLMWrapper(provider, apiKey, systemPrompt, userMessage) {
            if (provider === 'openai') {
                return await fetchOpenAI(apiKey, 'gpt-4o', systemPrompt, userMessage);
            } else if (provider === 'anthropic') {
                return await fetchAnthropic(apiKey, 'claude-3-5-sonnet-20240620', systemPrompt, userMessage);
            } else if (provider === 'ollama') {
                return `### Negotiation Offers\n\n1. **Store Credit + 20% Bonus:** Offer $358 in store credit immediately.\n2. **Keep & Partial Refund:** Keep the headphones for a family member, and receive a 40% ($119) refund to original payment method.\n3. **Exchange for Comfort Model:** Free exchange for the 'Air-Weave Comfort' model, plus expedited shipping.`;
            }
            throw new Error("Unknown provider");
        }

        btnNegotiate.addEventListener('click', async () => {
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value;

            if (provider !== 'ollama' && !apiKey) {
                alert("Please enter an API Key");
                return;
            }

            btnNegotiate.disabled = true;
            outputDiv.classList.add('hidden');
            loadingDiv.classList.remove('hidden');

            const config = {
                customerProfile: customerProfileInput.value,
                returnDetails: returnDetailsInput.value,
                provider: provider,
                apiKey: apiKey
            };

            try {
                const markdownResponse = await negotiateReturnOptions(config, fetchLLMWrapper);
                const htmlOutput = window.marked ? window.marked.parse(markdownResponse) : markdownResponse;
                outputDiv.innerHTML = window.DOMPurify ? window.DOMPurify.sanitize(htmlOutput) : htmlOutput;
            } catch (err) {
                outputDiv.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
            } finally {
                loadingDiv.classList.add('hidden');
                outputDiv.classList.remove('hidden');
                btnNegotiate.disabled = false;
            }
        });
    });
}
