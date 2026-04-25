const { test } = require('node:test');
const assert = require('node:assert');
const { formulateTreatmentPlan, tools } = require('../script');

test('Agentic-Crop-Disease-Specialist - formulateTreatmentPlan', (t) => {
    assert.match(formulateTreatmentPlan('Powdery Mildew', 'rain'), /systemic fungicide/);
    assert.match(formulateTreatmentPlan('Unknown', 'sunny'), /Standard observation/);
});

test('Agentic-Crop-Disease-Specialist - tools', (t) => {
    assert.match(tools.search_pathogen_database('white powdery spots'), /Powdery Mildew/);
    assert.match(tools.search_pathogen_database('yellow leaves'), /No direct match/);
});
