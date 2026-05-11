// Pure logic function for processing audio chunks
function processAudioStream(chunks, silenceThreshold) {
    let processedChunks = [];
    let silenceRemoved = 0;

    chunks.forEach(chunk => {
        if (chunk.volume > silenceThreshold) {
            // "Normalize" by boosting slightly
            processedChunks.push({
                time: chunk.time,
                volume: Math.min(chunk.volume * 1.2, 100) // Max volume 100
            });
        } else {
            silenceRemoved++;
        }
    });

    return {
        processedData: processedChunks,
        stats: {
            originalLength: chunks.length,
            newLength: processedChunks.length,
            silenceRemoved: silenceRemoved
        }
    };
}

// Browser environment specific logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const processBtn = document.getElementById('process-audio-btn');
        const resultsOutput = document.getElementById('results-output');

        // Simulate an audio stream (array of volume levels over time)
        const mockAudioChunks = [
            { time: '0:01', volume: 60 },
            { time: '0:02', volume: 5 },  // Silence
            { time: '0:03', volume: 2 },  // Silence
            { time: '0:04', volume: 75 },
            { time: '0:05', volume: 80 },
            { time: '0:06', volume: 8 }   // Silence
        ];

        const threshold = 10;

        processBtn.addEventListener('click', () => {
            resultsOutput.innerHTML = '<p>Processing audio stream...</p>';

            setTimeout(() => {
                const result = processAudioStream(mockAudioChunks, threshold);

                resultsOutput.innerHTML = `
                    <h4>Processing Complete</h4>
                    <p>Original chunks: ${result.stats.originalLength}</p>
                    <p>Processed chunks: ${result.stats.newLength}</p>
                    <p>Silence chunks removed: ${result.stats.silenceRemoved}</p>
                    <p><em>Audio normalized and ready for export.</em></p>
                `;
            }, 800); // Simulate processing time
        });
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { processAudioStream };
}