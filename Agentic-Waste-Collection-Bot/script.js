// Simulated Tools
const tools = {
    checkBinSensors: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { location: "Downtown Plaza", fillLevel: 95 },
                    { location: "Northside Park", fillLevel: 20 },
                    { location: "Industrial Estate", fillLevel: 85 },
                    { location: "Residential Suburb A", fillLevel: 40 },
                    { location: "Shopping Mall", fillLevel: 100 }
                ]);
            }, 800);
        });
    },
    queryTrafficAPI: (locations) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const trafficData = {};
                locations.forEach(loc => {
                    // Simulate heavy traffic near the mall
                    trafficData[loc] = loc === "Shopping Mall" ? "Heavy Delay" : "Clear";
                });
                resolve(trafficData);
            }, 800);
        });
    }
};

// Agent Logic
async function planCollectionRoute(simTools, onLog) {
    onLog(`[Thought] Goal: Generate optimal waste collection route. First, I need to check which bins actually need emptying (>75% full).`, 'thought');

    onLog(`[Tool Call] Executing checkBinSensors()...`, 'tool-call');
    const bins = await simTools.checkBinSensors();
    onLog(`[Tool Result] Retrieved data for ${bins.length} bins.`, 'tool-result');

    const targetBins = bins.filter(b => b.fillLevel > 75).map(b => b.location);
    onLog(`[Thought] Bins requiring service: ${targetBins.join(', ')}. Next, I need to check traffic conditions for these locations to sequence them.`, 'thought');

    onLog(`[Tool Call] Executing queryTrafficAPI([${targetBins.join(', ')}])...`, 'tool-call');
    const traffic = await simTools.queryTrafficAPI(targetBins);
    onLog(`[Tool Result] Traffic data retrieved.`, 'tool-result');

    onLog(`[Thought] Synthesizing data. I will prioritize 'Clear' traffic locations first to maintain schedule, then handle 'Heavy Delay' locations later.`, 'thought');

    // Route calculation logic
    const clearLocations = targetBins.filter(loc => traffic[loc] === 'Clear');
    const delayedLocations = targetBins.filter(loc => traffic[loc] !== 'Clear');

    const finalRoute = [...clearLocations, ...delayedLocations];

    onLog(`[Thought] Final route calculation complete. Outputting plan.`, 'thought');

    return finalRoute;
}

// UI Interaction
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('plan-route-btn');
        const logPanel = document.getElementById('agent-log');
        const routeList = document.getElementById('route-list');

        function appendLog(message, type) {
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.textContent = message;
            logPanel.appendChild(entry);
            logPanel.scrollTop = logPanel.scrollHeight;
        }

        btn.addEventListener('click', async () => {
            btn.disabled = true;
            logPanel.innerHTML = '';
            routeList.innerHTML = '<li class="route-point placeholder">Planning...</li>';

            try {
                const route = await planCollectionRoute(tools, appendLog);

                routeList.innerHTML = '';
                route.forEach(point => {
                    const li = document.createElement('li');
                    li.className = 'route-point';
                    li.textContent = point;
                    routeList.appendChild(li);
                });
            } catch (err) {
                appendLog(`[Error] Planning failed: ${err.message}`, 'tool-call');
                routeList.innerHTML = '<li class="route-point placeholder" style="color:red;">Error generating route.</li>';
            } finally {
                btn.disabled = false;
            }
        });
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { planCollectionRoute, tools };
}