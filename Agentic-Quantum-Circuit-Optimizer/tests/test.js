const assert = require('assert');
const { tools, resolveOptimizationEvent } = require('../script.js');

try {
    const topologyRes = tools.analyze_topology('500');
    assert.strictEqual(topologyRes, 'Topology analysis: High crosstalk detected on qubits 3 and 4.');

    const compressRes = tools.compress_gates();
    assert.strictEqual(compressRes, 'Gate compression successful. Reduced depth by 15%.');

    const resolveRes = resolveOptimizationEvent('500 gates');
    assert.strictEqual(resolveRes, 'Optimization completed: Depth reduced to 425 gates.');

    console.log('Agentic-Quantum-Circuit-Optimizer tests passed.');
} catch (error) {
    console.error('Agentic-Quantum-Circuit-Optimizer tests failed:', error);
    process.exit(1);
}
