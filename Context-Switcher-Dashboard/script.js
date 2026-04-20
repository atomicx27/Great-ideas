document.addEventListener('DOMContentLoaded', () => {
    // State
    let workspaces = JSON.parse(localStorage.getItem('contextSwitchWorkspaces')) || {};
    let currentWorkspaceId = null;

    // DOM Elements
    const workspaceList = document.getElementById('workspace-list');
    const newWsInput = document.getElementById('new-workspace-name');
    const addWsBtn = document.getElementById('add-workspace-btn');

    const emptyState = document.getElementById('empty-state');
    const dashboardContent = document.getElementById('dashboard-content');
    const currentWsTitle = document.getElementById('current-workspace-title');

    const newLinkName = document.getElementById('new-link-name');
    const newLinkUrl = document.getElementById('new-link-url');
    const addLinkBtn = document.getElementById('add-link-btn');
    const linksList = document.getElementById('links-list');

    const newTaskText = document.getElementById('new-task-text');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks-list');

    const scratchpad = document.getElementById('scratchpad');

    // Initialize
    renderWorkspaces();

    // --- Event Listeners ---

    // Workspace Management
    addWsBtn.addEventListener('click', addWorkspace);
    newWsInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') addWorkspace(); });

    // Link Management
    addLinkBtn.addEventListener('click', addLink);

    // Task Management
    addTaskBtn.addEventListener('click', addTask);
    newTaskText.addEventListener('keypress', (e) => { if(e.key === 'Enter') addTask(); });

    // Scratchpad Auto-save
    scratchpad.addEventListener('input', (e) => {
        if(currentWorkspaceId && workspaces[currentWorkspaceId]) {
            workspaces[currentWorkspaceId].notes = e.target.value;
            saveData();
        }
    });

    // --- Functions ---

    function saveData() {
        localStorage.setItem('contextSwitchWorkspaces', JSON.stringify(workspaces));
    }

    function renderWorkspaces() {
        workspaceList.innerHTML = '';
        for (const id in workspaces) {
            const li = document.createElement('li');
            li.dataset.id = id;
            if (id === currentWorkspaceId) {
                li.classList.add('active');
            }

            const nameSpan = document.createElement('span');
            nameSpan.textContent = workspaces[id].name;
            nameSpan.addEventListener('click', () => selectWorkspace(id));

            const delBtn = document.createElement('button');
            delBtn.textContent = '✕';
            delBtn.className = 'delete-ws-btn';
            delBtn.title = 'Delete Workspace';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(confirm(`Delete workspace "${workspaces[id].name}"?`)) {
                    delete workspaces[id];
                    if(currentWorkspaceId === id) {
                        currentWorkspaceId = null;
                        updateDashboardView();
                    }
                    saveData();
                    renderWorkspaces();
                }
            });

            li.appendChild(nameSpan);
            li.appendChild(delBtn);
            workspaceList.appendChild(li);
        }
    }

    function addWorkspace() {
        const name = newWsInput.value.trim();
        if (name) {
            const id = 'ws_' + Date.now();
            workspaces[id] = {
                name: name,
                links: [],
                tasks: [],
                notes: ''
            };
            saveData();
            newWsInput.value = '';
            selectWorkspace(id);
            renderWorkspaces();
        }
    }

    function selectWorkspace(id) {
        currentWorkspaceId = id;
        renderWorkspaces(); // updates active class
        updateDashboardView();
    }

    function updateDashboardView() {
        if (!currentWorkspaceId || !workspaces[currentWorkspaceId]) {
            emptyState.classList.remove('hidden');
            dashboardContent.classList.add('hidden');
            currentWsTitle.textContent = 'Select a Workspace';
            return;
        }

        const ws = workspaces[currentWorkspaceId];
        emptyState.classList.add('hidden');
        dashboardContent.classList.remove('hidden');
        currentWsTitle.textContent = ws.name;

        // Render Links
        linksList.innerHTML = '';
        ws.links.forEach((link, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.textContent = link.name;

            const delBtn = document.createElement('button');
            delBtn.textContent = '✕';
            delBtn.className = 'delete-btn';
            delBtn.addEventListener('click', () => {
                ws.links.splice(index, 1);
                saveData();
                updateDashboardView();
            });

            li.appendChild(a);
            li.appendChild(delBtn);
            linksList.appendChild(li);
        });

        // Render Tasks
        tasksList.innerHTML = '';
        ws.tasks.forEach((task, index) => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = task;

            const delBtn = document.createElement('button');
            delBtn.textContent = '✕';
            delBtn.className = 'delete-btn';
            delBtn.addEventListener('click', () => {
                ws.tasks.splice(index, 1);
                saveData();
                updateDashboardView();
            });

            li.appendChild(span);
            li.appendChild(delBtn);
            tasksList.appendChild(li);
        });

        // Render Notes
        scratchpad.value = ws.notes || '';
    }

    function addLink() {
        if(!currentWorkspaceId) return;
        const name = newLinkName.value.trim();
        let url = newLinkUrl.value.trim();

        if (name && url) {
            if(!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            workspaces[currentWorkspaceId].links.push({ name, url });
            saveData();
            newLinkName.value = '';
            newLinkUrl.value = '';
            updateDashboardView();
        }
    }

    function addTask() {
        if(!currentWorkspaceId) return;
        const text = newTaskText.value.trim();
        if (text) {
            workspaces[currentWorkspaceId].tasks.push(text);
            saveData();
            newTaskText.value = '';
            updateDashboardView();
        }
    }
});
