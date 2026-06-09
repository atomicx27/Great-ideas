const assert = require('node:assert');
const { scheduleVideoUpload } = require('../script.js');

// Test 1: Invalid Input
assert.deepStrictEqual(scheduleVideoUpload({}, '12:00'), { error: 'Invalid video data provided' });

// Test 2: TikTok Scheduling
const tiktokResult = scheduleVideoUpload({ name: 'funny_dance.mp4', platform: 'tiktok' }, '2024-11-01');
assert.strictEqual(tiktokResult.status, 'Scheduled');
assert.strictEqual(tiktokResult.generatedMetadata.title, 'FUNNY DANCE');
assert.ok(tiktokResult.generatedMetadata.tags.includes('#fyp'));

// Test 3: YouTube Scheduling
const ytResult = scheduleVideoUpload({ name: 'tech_review.mp4', platform: 'youtube' }, '2024-11-01');
assert.ok(ytResult.generatedMetadata.tags.includes('#vlog'));

console.log('Automated-Video-Uploader tests passed!');