const test = require('node:test');
const assert = require('node:assert');
const { planCollectionRoute, tools } = require('../script.js');

test('Agentic Waste Collection Bot Logic', async (t) => {

    await t.test('Agent filters bins and orders by traffic', async () => {
        let logs = [];
        const logger = (msg, type) => logs.push({msg, type});

        const route = await planCollectionRoute(tools, logger);

        // Target bins based on mock data (>75%): Downtown (95), Industrial (85), Mall (100)
        assert.strictEqual(route.length, 3, 'Route should only contain bins needing collection');

        // Traffic logic: Mall has heavy delay, others are clear. Mall should be last.
        assert.ok(route.includes('Downtown Plaza'));
        assert.ok(route.includes('Industrial Estate'));
        assert.strictEqual(route[route.length - 1], 'Shopping Mall', 'Location with heavy traffic should be scheduled last');

        // Verify tool calls
        assert.ok(logs.some(l => l.msg.includes('checkBinSensors')), 'Agent should call bin sensor tool');
        assert.ok(logs.some(l => l.msg.includes('queryTrafficAPI')), 'Agent should call traffic API tool');
    });

});