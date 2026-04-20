document.addEventListener('DOMContentLoaded', () => {
    // State
    let members = JSON.parse(localStorage.getItem('timezoneMembers')) || [];

    // DOM Elements
    const memberNameInput = document.getElementById('member-name');
    const memberTzSelect = document.getElementById('member-timezone');
    const addMemberBtn = document.getElementById('add-member-btn');
    const workStartSelect = document.getElementById('work-start');
    const workEndSelect = document.getElementById('work-end');
    const timelineHeader = document.getElementById('timeline-header');
    const membersList = document.getElementById('members-list');

    // Initialize
    buildTimelineHeader();
    renderVisualization();

    // Event Listeners
    addMemberBtn.addEventListener('click', addMember);
    memberNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addMember(); });

    workStartSelect.addEventListener('change', renderVisualization);
    workEndSelect.addEventListener('change', renderVisualization);

    // Functions
    function buildTimelineHeader() {
        timelineHeader.innerHTML = '';
        for (let i = 0; i < 24; i++) {
            const marker = document.createElement('div');
            marker.className = 'hour-marker';
            // Display UTC hours
            marker.textContent = i.toString().padStart(2, '0') + ':00';
            timelineHeader.appendChild(marker);
        }
    }

    function addMember() {
        const name = memberNameInput.value.trim();
        const offset = parseFloat(memberTzSelect.value);
        const tzName = memberTzSelect.options[memberTzSelect.selectedIndex].text.split(' ')[0]; // Get acronym

        if (name) {
            members.push({ id: Date.now(), name, offset, tzName });
            saveData();
            memberNameInput.value = '';
            renderVisualization();
        }
    }

    function removeMember(id) {
        members = members.filter(m => m.id !== id);
        saveData();
        renderVisualization();
    }

    function saveData() {
        localStorage.setItem('timezoneMembers', JSON.stringify(members));
    }

    function renderVisualization() {
        membersList.innerHTML = '';
        const workStart = parseInt(workStartSelect.value, 10);
        const workEnd = parseInt(workEndSelect.value, 10);

        // Keep track of how many people are working at each UTC hour
        const workingCountPerUtcHour = new Array(24).fill(0);

        // First pass: calculate overlaps
        members.forEach(member => {
            for (let utcHour = 0; utcHour < 24; utcHour++) {
                // Calculate local hour for this member at this UTC hour
                let localHour = (utcHour + member.offset) % 24;
                if (localHour < 0) localHour += 24; // Handle negative modulo

                // If local hour is within their working hours
                if (localHour >= workStart && localHour < workEnd) {
                    workingCountPerUtcHour[utcHour]++;
                }
            }
        });

        const totalMembers = members.length;

        // Second pass: render rows
        members.forEach(member => {
            const row = document.createElement('div');
            row.className = 'member-row';

            // Member Info (Fixed XSS)
            const info = document.createElement('div');
            info.className = 'member-info';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${member.name} (${member.tzName})`;

            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.dataset.id = member.id;
            delBtn.textContent = '✕';

            info.appendChild(nameSpan);
            info.appendChild(delBtn);

            row.appendChild(info);

            // Timeline Blocks
            const blocksContainer = document.createElement('div');
            blocksContainer.className = 'timeline-blocks';

            for (let utcHour = 0; utcHour < 24; utcHour++) {
                const block = document.createElement('div');
                block.className = 'hour-block';

                let localHour = (utcHour + member.offset) % 24;
                if (localHour < 0) localHour += 24;

                // Show local time on hover
                const localTimeSpan = document.createElement('span');
                localTimeSpan.className = 'local-time';
                // Adjust for half-hour offsets visually
                let displayHour = Math.floor(localHour);
                let displayMin = (localHour % 1 !== 0) ? '30' : '00';
                localTimeSpan.textContent = displayHour.toString().padStart(2, '0') + ':' + displayMin;
                block.appendChild(localTimeSpan);

                // Is this hour working for this member?
                if (localHour >= workStart && localHour < workEnd) {
                    block.classList.add('working');

                    // Is this hour optimal for EVERYONE?
                    if (totalMembers > 1 && workingCountPerUtcHour[utcHour] === totalMembers) {
                        block.classList.add('overlap-optimal');
                    }
                }

                blocksContainer.appendChild(block);
            }

            row.appendChild(blocksContainer);
            membersList.appendChild(row);
        });

        // Attach delete listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeMember(parseInt(e.target.dataset.id, 10));
            });
        });
    }
});
