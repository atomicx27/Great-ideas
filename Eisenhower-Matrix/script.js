document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('new-task-text');
    const quadrantSelect = document.getElementById('task-quadrant');

    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const quadrantId = quadrantSelect.value;

        if (text !== '') {
            addTask(text, quadrantId);
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    function addTask(text, quadrantId) {
        const list = document.querySelector(`#${quadrantId} .task-list`);

        const li = document.createElement('li');
        li.className = 'task-item';

        const span = document.createElement('span');
        span.textContent = text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.title = 'Remove task';
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);

        list.appendChild(li);
    }
});
