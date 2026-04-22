const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Context Switcher Dashboard', () => {
    beforeEach(() => {
        // Setup document body
        document.documentElement.innerHTML = html.toString();

        // Clear localStorage
        localStorage.clear();

        // Reset modules and re-evaluate script.js
        jest.resetModules();
        require('../script.js');

        // Trigger DOMContentLoaded
        const event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        window.document.dispatchEvent(event);
    });

    afterEach(() => {
        // Clean up mock timers
        jest.useRealTimers();
    });

    describe('addWorkspace', () => {
        it('should add a workspace when name is provided', () => {
            // Setup mock date for consistent id generation
            const mockDate = 1234567890;
            jest.spyOn(Date, 'now').mockReturnValue(mockDate);

            const input = document.getElementById('new-workspace-name');
            const addBtn = document.getElementById('add-workspace-btn');

            // Provide valid input
            input.value = 'My New Workspace';

            // Trigger click
            addBtn.click();

            // Assert local storage
            const savedData = JSON.parse(localStorage.getItem('contextSwitchWorkspaces'));
            expect(savedData).toBeDefined();
            const expectedId = 'ws_' + mockDate;
            expect(savedData[expectedId]).toBeDefined();
            expect(savedData[expectedId].name).toBe('My New Workspace');

            // Assert input cleared
            expect(input.value).toBe('');

            // Assert DOM updated (workspace list)
            const workspaceList = document.getElementById('workspace-list');
            const listItems = workspaceList.querySelectorAll('li');
            expect(listItems.length).toBe(1);
            expect(listItems[0].dataset.id).toBe(expectedId);
            expect(listItems[0].querySelector('span').textContent).toBe('My New Workspace');

            Date.now.mockRestore();
        });

        it('should add a workspace on Enter keypress', () => {
             // Setup mock date for consistent id generation
             const mockDate = 9876543210;
             jest.spyOn(Date, 'now').mockReturnValue(mockDate);

             const input = document.getElementById('new-workspace-name');

             // Provide valid input
             input.value = 'Another Workspace';

             // Trigger Enter keypress
             const event = new KeyboardEvent('keypress', { key: 'Enter' });
             input.dispatchEvent(event);

             // Assert local storage
             const savedData = JSON.parse(localStorage.getItem('contextSwitchWorkspaces'));
             expect(savedData).toBeDefined();
             const expectedId = 'ws_' + mockDate;
             expect(savedData[expectedId]).toBeDefined();
             expect(savedData[expectedId].name).toBe('Another Workspace');

             Date.now.mockRestore();
        });

        it('should not add a workspace when name is empty', () => {
            const input = document.getElementById('new-workspace-name');
            const addBtn = document.getElementById('add-workspace-btn');

            input.value = '';
            addBtn.click();

            const savedData = JSON.parse(localStorage.getItem('contextSwitchWorkspaces'));
            expect(savedData).toBeNull();

            const workspaceList = document.getElementById('workspace-list');
            expect(workspaceList.children.length).toBe(0);
        });

        it('should not add a workspace when name is only whitespace', () => {
            const input = document.getElementById('new-workspace-name');
            const addBtn = document.getElementById('add-workspace-btn');

            input.value = '    ';
            addBtn.click();

            const savedData = JSON.parse(localStorage.getItem('contextSwitchWorkspaces'));
            expect(savedData).toBeNull();

            const workspaceList = document.getElementById('workspace-list');
            expect(workspaceList.children.length).toBe(0);
        });
    });
});
