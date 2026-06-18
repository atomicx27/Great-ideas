function scheduleVideoUpload(videoData, time) {
    if (!videoData || !videoData.name || !videoData.platform) {
        return { error: 'Invalid video data provided' };
    }

    // Deterministic metadata generation based on platform rules
    let metadata = {
        title: videoData.name.replace(/_/g, ' ').replace('.mp4', '').toUpperCase(),
        tags: ['#video'],
        description: `Uploaded for ${videoData.platform}`
    };

    if (videoData.platform === 'tiktok') {
        metadata.tags.push('#fyp', '#foryou');
        metadata.title = metadata.title.substring(0, 50); // Character limit simulation
    } else if (videoData.platform === 'youtube') {
        metadata.tags.push('#vlog', '#subscribe');
    }

    return {
        status: 'Scheduled',
        videoId: `vid_${Date.now()}`,
        platform: videoData.platform,
        scheduledTime: time,
        generatedMetadata: metadata
    };
}

if (typeof document !== 'undefined') {
    document.getElementById('scheduleBtn').addEventListener('click', () => {
        const name = document.getElementById('videoName').value.trim();
        const platform = document.getElementById('platform').value;
        const time = document.getElementById('uploadTime').value.trim();
        const outputEl = document.getElementById('queueOutput');

        if (!name || !time) {
            outputEl.textContent = 'Please provide both video name and time.';
            return;
        }

        const result = scheduleVideoUpload({ name, platform }, time);
        outputEl.textContent = JSON.stringify(result, null, 2);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scheduleVideoUpload };
}