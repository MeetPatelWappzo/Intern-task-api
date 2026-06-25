import { fetchWithAuth, getAccessToken, clearAccessToken } from './api.js';

// Auth Guard
if (!getAccessToken()) {
    window.location.href = 'login.html';
}

let allTasks = [];

// DOM Elements
const tasksGrid = document.getElementById('tasksGrid');
const createTaskForm = document.getElementById('createTaskForm');
const filterPriority = document.getElementById('filterPriority');
const logoutBtn = document.getElementById('logoutBtn');
const alertBox = document.getElementById('alertBox');

// Modal Elements
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close-modal');
const editTaskForm = document.getElementById('editTaskForm');

function showAlert(message, isError = true) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert ${isError ? 'alert-error' : 'alert-success'}`;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 3000);
}

// Fetch Tasks
async function fetchTasks() {
    try {
        const res = await fetchWithAuth('/api/tasks');
        if (res.status === 401) {
            clearAccessToken();
            window.location.href = 'login.html';
            return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch tasks');
        
        allTasks = data; // Assumes API returns array of tasks directly
        if (!Array.isArray(allTasks) && data.tasks) {
            allTasks = data.tasks;
        } else if (!Array.isArray(allTasks)) {
            allTasks = [];
        }
        
        renderTasks();
    } catch (err) {
        tasksGrid.innerHTML = `<p class="alert alert-error">Error: ${err.message}</p>`;
    }
}

// Render Tasks
function renderTasks() {
    const filterValue = filterPriority.value;
    const filteredTasks = filterValue === 'all' 
        ? allTasks 
        : allTasks.filter(t => t.priority === filterValue);

    if (filteredTasks.length === 0) {
        tasksGrid.innerHTML = '<p>No tasks found.</p>';
        return;
    }

    tasksGrid.innerHTML = filteredTasks.map(task => `
        <div class="task-card">
            <div class="task-header">
                <div class="task-title">${escapeHTML(task.title)}</div>
                <span class="task-badge priority-${task.priority}">${task.priority}</span>
            </div>
            <div class="task-desc">${escapeHTML(task.description || '')}</div>
            <div class="task-footer">
                <select class="status-select" data-id="${task.id}">
                    <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="btn-edit" data-id="${task.id}">Edit</button>
            </div>
        </div>
    `).join('');

    // Attach event listeners to new elements
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', handleStatusChange);
    });
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', openEditModal);
    });
}

// Handle Status Change
async function handleStatusChange(e) {
    const taskId = e.target.dataset.id;
    const newStatus = e.target.value;
    
    try {
        const res = await fetchWithAuth(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || data.error || 'Failed to update status');
        }
        // Update local state
        const task = allTasks.find(t => t.id === taskId);
        if(task) task.status = newStatus;
    } catch (err) {
        alert(err.message);
        // Re-render to revert select box on failure
        renderTasks();
    }
}

// Create Task
if (createTaskForm) {
    createTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createTaskForm);
        const body = {
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority')
        };

        try {
            const res = await fetchWithAuth('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Failed to create task');
            
            showAlert('Task created successfully!', false);
            createTaskForm.reset();
            
            const newTask = data.task || data; 
            allTasks.unshift(newTask);
            renderTasks();
        } catch (err) {
            showAlert(err.message);
        }
    });
}

// Edit Modal Logic
function openEditModal(e) {
    const taskId = e.target.dataset.id;
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTitle').value = task.title; // disabled field
    document.getElementById('editDescription').value = task.description || '';
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editStatus').value = task.status;
    
    editModal.style.display = 'flex';
}

if (closeModal) {
    closeModal.onclick = () => { editModal.style.display = 'none'; };
}
window.onclick = (e) => { if (e.target === editModal) editModal.style.display = 'none'; };

if (editTaskForm) {
    editTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskId = document.getElementById('editTaskId').value;
        const formData = new FormData(editTaskForm);
        const body = {
            description: formData.get('description'),
            priority: formData.get('priority')
        };
        const newStatus = formData.get('status');

        try {
            const res = await fetchWithAuth(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Failed to update task');
            
            const task = allTasks.find(t => t.id === taskId);
            if (task && newStatus !== task.status) {
                const statusRes = await fetchWithAuth(`/api/tasks/${taskId}/status`, {
                    method: 'PATCH',
                    body: JSON.stringify({ status: newStatus })
                });
                const statusData = await statusRes.json();
                if (!statusRes.ok) throw new Error(statusData.message || statusData.error || 'Failed to update status');
            }
            
            // Update local state
            if(task) {
                task.description = body.description;
                task.priority = body.priority;
                task.status = newStatus;
            }
            
            editModal.style.display = 'none';
            renderTasks();
        } catch (err) {
            alert(err.message);
        }
    });
}

// Filter
if (filterPriority) {
    filterPriority.addEventListener('change', renderTasks);
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        clearAccessToken();
        window.location.href = 'login.html';
    });
}

// Helper to prevent XSS
function escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}

// Init
fetchTasks();
