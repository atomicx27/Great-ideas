const test = require('node:test');
const assert = require('node:assert');
const { tools, generateActionPlan } = require('../script.js');

test('Agentic-Grid-Load-Balancer logic', (t) => {
    const load = tools.check_grid_load();
    assert.strictEqual(load.status, 'Critical');

    const battery = tools.draw_from_battery(500);
    assert.ok(battery.includes('500MW'));

    const curtail = tools.curtail_demand('industrial');
    assert.ok(curtail.includes('industrial'));

    const criticalPlan = generateActionPlan('Sudden heatwave hitting the city', true);
    assert.ok(criticalPlan.includes('Grid stabilized'));

    const normalPlan = generateActionPlan('Normal operations', false);
    assert.ok(normalPlan.includes('Continue normal monitoring'));
});