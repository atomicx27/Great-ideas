const test = require('node:test');
const assert = require('node:assert');
const { filterAsteroids, asteroidDatabase } = require('../script.js');

test('Automated-Asteroid-Spectrometer logic', (t) => {
    // Test min PGM = 5, max dist = 2.0
    // Should return D-412 (Eros: PGM 6.2, Dist 1.4)
    // Psyche is > 2.0, Ryugu/Bennu < 5 PGM
    const results1 = filterAsteroids(asteroidDatabase, 5, 2.0);
    assert.strictEqual(results1.length, 1);
    assert.strictEqual(results1[0].name, 'Eros');

    // Test min PGM = 8, max dist = 3.0
    // Should return Psyche and Kleopatra
    const results2 = filterAsteroids(asteroidDatabase, 8, 3.0);
    assert.strictEqual(results2.length, 2);
    assert.ok(results2.find(a => a.name === 'Psyche'));
    assert.ok(results2.find(a => a.name === 'Kleopatra'));
});