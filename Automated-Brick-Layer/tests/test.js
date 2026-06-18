const assert = require('node:assert');
const test = require('node:test');
const { calculateBrickCoordinates } = require('../script.js');

test('Automated Brick Layer - calculateBrickCoordinates', async (t) => {
    await t.test('Calculates coordinates for a basic wall', () => {
        const wallDimensions = { wallWidth: 500, wallHeight: 200 };
        const brickSize = { brickWidth: 200, brickHeight: 50, mortarJoint: 10 };

        // Effective width: 210, height: 60
        // numRows = floor(200 / 60) = 3
        // numCols = floor(500 / 210) = 2
        // Row 0: offset 0. x=0, 210. Both fit (200, 410 <= 500)
        // Row 1: offset 105. x=105, 315. Both fit (305, 515! -> second one does not fit)
        // Row 2: offset 0. x=0, 210. Both fit

        const coords = calculateBrickCoordinates(wallDimensions, brickSize);
        assert.strictEqual(coords.length, 5); // 2 + 1 + 2

        // Check row 1 (the single brick)
        const row1Brick = coords.find(c => c.y === 60);
        assert.strictEqual(row1Brick.x, 105);
    });

    await t.test('Handles small walls where no bricks fit', () => {
        const wallDimensions = { wallWidth: 100, wallHeight: 40 };
        const brickSize = { brickWidth: 200, brickHeight: 50, mortarJoint: 10 };

        const coords = calculateBrickCoordinates(wallDimensions, brickSize);
        assert.strictEqual(coords.length, 0);
    });
});