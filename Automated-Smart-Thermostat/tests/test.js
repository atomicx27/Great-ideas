const assert = require('node:assert');
const { calculateIdealTemperature, adjustThermostat } = require('../script.js');

// Test calculateIdealTemperature
let result = calculateIdealTemperature(75, 70, true);
assert.strictEqual(result.action, 'cooling');
assert.strictEqual(result.setpoint, 70);

result = calculateIdealTemperature(65, 70, true);
assert.strictEqual(result.action, 'heating');
assert.strictEqual(result.setpoint, 70);

result = calculateIdealTemperature(70, 70, true);
assert.strictEqual(result.action, 'idle');

// Test energy saving (away mode)
result = calculateIdealTemperature(80, 70, false);
assert.strictEqual(result.action, 'idle');
assert.strictEqual(result.setpoint, 78);

result = calculateIdealTemperature(55, 70, false);
assert.strictEqual(result.action, 'idle');
assert.strictEqual(result.setpoint, 60);

// Test adjustThermostat
let response = adjustThermostat({ currentTemp: 75, targetTemp: 70, isHome: true });
assert.strictEqual(response.action, 'cooling');
assert.ok(response.message.includes('Cooling system ON'));

response = adjustThermostat({ currentTemp: 75, targetTemp: 70, isHome: false });
assert.strictEqual(response.action, 'idle');
assert.ok(response.message.includes('Energy Saving Mode'));

console.log('All Automated-Smart-Thermostat tests passed!');
