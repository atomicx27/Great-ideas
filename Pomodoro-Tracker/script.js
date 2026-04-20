document.addEventListener('DOMContentLoaded', () => {
    // Timer state
    let timerInterval;
    let timeRemaining = 25 * 60; // Default Pomodoro time
    let isRunning = false;
    let currentMode = 'pomodoro'; // 'pomodoro', 'short-break', 'long-break'

    // DOM Elements
    const timeDisplay = document.getElementById('time-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    const modeButtons = {
        'pomodoro': document.getElementById('mode-pomodoro'),
        'short-break': document.getElementById('mode-short-break'),
        'long-break': document.getElementById('mode-long-break')
    };

    const taskInput = document.getElementById('new-task-text');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Modes configuration (in seconds)
    const modes = {
        'pomodoro': 25 * 60,
        'short-break': 5 * 60,
        'long-break': 15 * 60
    };

    // Initialize display
    updateDisplay();

    // Timer Controls
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Mode Selection
    Object.keys(modeButtons).forEach(mode => {
        modeButtons[mode].addEventListener('click', () => switchMode(mode));
    });

    // Task Management
    addTaskBtn.addEventListener('click', () => {
        if (taskInput.value.trim() !== '') {
            addTask(taskInput.value.trim());
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Functions
    function updateDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.title = `${timeDisplay.textContent} - Pomodoro Tracker`;
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        timerInterval = setInterval(() => {
            timeRemaining--;
            updateDisplay();

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                // Optional: Play sound here
                alert('Timer finished!');
                resetTimer(); // Reset to default for current mode
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning) return;
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        timeRemaining = modes[currentMode];
        updateDisplay();
    }

    function switchMode(mode) {
        // Update styling
        Object.values(modeButtons).forEach(btn => btn.classList.remove('active'));
        modeButtons[mode].classList.add('active');

        document.body.className = '';
        if (mode === 'short-break') document.body.classList.add('break-mode');
        if (mode === 'long-break') document.body.classList.add('long-break-mode');

        // Update state
        currentMode = mode;
        resetTimer();
    }

    function addTask(text) {
        const li = document.createElement('li');
        li.className = 'task-item';

        const span = document.createElement('span');
        span.textContent = text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.title = 'Delete Task';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering active task selection
            li.remove();
        });

        li.addEventListener('click', () => {
            // Remove active class from all
            document.querySelectorAll('.task-item').forEach(item => item.classList.remove('active-task'));
            li.classList.add('active-task');
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }
});
