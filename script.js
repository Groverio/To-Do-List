let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
const taskListElement = document.querySelector('.js-task-list');
const addTaskForm = document.getElementById('add-task-form');
const taskTemplate = document.getElementById('task-template');

document.addEventListener('DOMContentLoaded', initializeApp);
addTaskForm.addEventListener('submit', handleAddTask);
document.querySelector('.js-theme-toggle').addEventListener('click', toggleTheme);
document.querySelector('.task-filters').addEventListener('click', handleFilterClick);

function initializeApp() {
    renderTasks();
    setDefaultDateTime();
    document.getElementById('task-description').focus();
}

function handleAddTask(event) {
    event.preventDefault();
    const taskData = getTaskDataFromForm();
    if (validateTaskData(taskData)) {
        addTask(taskData);
        resetForm();
        renderTasks();
    }
}

function getTaskDataFromForm() {
    return {
        name: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        date: document.getElementById('task-date').value,
        time: document.getElementById('task-time').value,
        completed: false
    };
}

function validateTaskData(taskData) {
    if (!taskData.name || !taskData.priority || !taskData.date) {
        showNotification('Please fill in all required fields.', 'error');
        return false;
    }
    return true;
}

function addTask(taskData) {
    todoList.push(taskData);
    saveTodoList();
    showNotification('Task added successfully!', 'success');
}

function renderTasks() {
    sortTasks();
    taskListElement.innerHTML = '';
    const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;

    todoList.forEach((task, index) => {
        if (shouldRenderTask(task, currentFilter)) {
            const taskElement = createTaskElement(task, index);
            taskListElement.appendChild(taskElement);
        }
    });
}

function shouldRenderTask(task, filter) {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
}

function createTaskElement(task, index) {
    const taskElement = document.importNode(taskTemplate.content, true).querySelector('.task-item');
    taskElement.dataset.id = index;
    taskElement.classList.toggle('completed', task.completed);
    taskElement.classList.add(getPriorityClass(task.priority));

    taskElement.querySelector('.task-title').textContent = task.name;
    taskElement.querySelector('.task-due-date').textContent = `Due: ${task.date} ${task.time || ''}`;
    taskElement.querySelector('.task-priority').textContent = task.priority;

    addTaskEventListeners(taskElement, index);
    return taskElement;
}

function addTaskEventListeners(taskElement, index) {
    taskElement.querySelector('.js-complete-button').addEventListener('click', () => toggleTaskComplete(index));
    taskElement.querySelector('.js-edit-button').addEventListener('click', () => editTask(index));
    taskElement.querySelector('.js-delete-button').addEventListener('click', () => deleteTask(index));
}

function toggleTaskComplete(index) {
    todoList[index].completed = !todoList[index].completed;
    saveTodoList();
    renderTasks();
    showNotification('Task status updated!', 'success');
}

function editTask(index) {
    const task = todoList[index];
    document.getElementById('task-description').value = task.name;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-time').value = task.time || '';

    todoList.splice(index, 1);
    saveTodoList();
    renderTasks();
    document.getElementById('task-description').focus();
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        todoList.splice(index, 1);
        saveTodoList();
        renderTasks();
        showNotification('Task deleted successfully!', 'success');
    }
}

function handleFilterClick(event) {
    if (event.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        renderTasks();
    }
}

function sortTasks() {
    todoList.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + (a.time || ''));
        const dateB = new Date(b.date + ' ' + (b.time || ''));
        return dateA - dateB;
    });
}

function getPriorityClass(priority) {
    const priorityMap = {
        'High': 'priority-high',
        'Medium': 'priority-medium',
        'Low': 'priority-low'
    };
    return priorityMap[priority] || '';
}

function setDefaultDateTime() {
    const now = new Date();
    document.getElementById('task-date').valueAsDate = now;
    document.getElementById('task-time').value = now.toTimeString().slice(0, 5);
}

function resetForm() {
    addTaskForm.reset();
    setDefaultDateTime();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggle = document.querySelector('.js-theme-toggle');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = `<i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i> <span>Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode</span>`;
    localStorage.setItem('darkMode', isDarkMode);
}

function saveTodoList() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

function showNotification(message, type) {
    // Implementation of notification system (could use a library or custom solution)
    alert(message); // Placeholder for now
}

// Initialize theme based on user's preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}