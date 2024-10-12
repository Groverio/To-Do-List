let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
const taskListElement = document.querySelector('.js-task-list');
const addTaskForm = document.getElementById('add-task-form');
const taskTemplate = document.getElementById('task-template');

document.addEventListener('DOMContentLoaded', initializeApp);
addTaskForm.addEventListener('submit', handleAddTask);
document
  .querySelector('.js-theme-toggle')
  .addEventListener('click', toggleTheme);
document
  .querySelector('.task-filters')
  .addEventListener('click', handleFilterClick);

function initializeApp() {
  renderTasks();
  setDefaultDateTime();
  document.getElementById('task-description').focus();
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    updateThemeToggleButton();
  }
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
    completed: false,
  };
}

function validateTaskData(taskData) {
  if (!taskData.name || !taskData.priority || !taskData.date) {
    alert('Please fill in all required fields.');
    return false;
  }
  return true;
}

function addTask(taskData) {
  todoList.push(taskData);
  saveTodoList();
  alert('Task added successfully!');
}

function renderTasks() {
  sortTasks();
  taskListElement.innerHTML = '';
  const currentFilter =
    document.querySelector('.filter-btn.active').dataset.filter;

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
  const taskElement = document
    .importNode(taskTemplate.content, true)
    .querySelector('.task-item');
  taskElement.dataset.id = index;
  taskElement.classList.toggle('completed', task.completed);
  taskElement.classList.add(getPriorityClass(task.priority));

  taskElement.querySelector('.task-title').textContent = task.name;
  taskElement.querySelector('.task-due-date').textContent =
    `Due: ${task.date} ${task.time || ''}`;
  taskElement.querySelector('.task-priority').textContent = task.priority;

  addTaskEventListeners(taskElement, index);
  return taskElement;
}

function addTaskEventListeners(taskElement, index) {
  const checkbox = taskElement.querySelector('.js-complete-checkbox');
  checkbox.checked = todoList[index].completed;
  checkbox.addEventListener('change', () => toggleTaskComplete(index));

  taskElement
    .querySelector('.js-edit-button')
    .addEventListener('click', () => editTask(index));
  taskElement
    .querySelector('.js-delete-button')
    .addEventListener('click', () => deleteTask(index));
}

function toggleTaskComplete(index) {
  todoList[index].completed = !todoList[index].completed;
  saveTodoList();
  renderTasks();
}

function editTask(index) {
  const task = todoList[index];
  document.getElementById('task-description').value = task.name;
  document.getElementById('task-priority').value = task.priority;
  document.getElementById('task-date').value = task.date;
  document.getElementById('task-time').value = task.time || '';

  // Remove the old task
  todoList.splice(index, 1);
  saveTodoList();
  renderTasks();
}

function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    todoList.splice(index, 1);
    saveTodoList();
    renderTasks();
  }
}

function saveTodoList() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function setDefaultDateTime() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('task-date').value = today;
}

function sortTasks() {
  todoList.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getPriorityClass(priority) {
  if (priority === 'High') return 'priority-high';
  if (priority === 'Medium') return 'priority-medium';
  if (priority === 'Low') return 'priority-low';
  return '';
}

function handleFilterClick(event) {
  if (event.target.classList.contains('filter-btn')) {
    document
      .querySelectorAll('.filter-btn')
      .forEach((btn) => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTasks();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const darkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', darkMode);
  updateThemeToggleButton();
}

function updateThemeToggleButton() {
  const themeToggleButton = document.querySelector('.js-theme-toggle');
  if (document.body.classList.contains('dark-mode')) {
    themeToggleButton.innerHTML =
      '<i class="fas fa-sun"></i> <span>Switch to Light Mode</span>';
  } else {
    themeToggleButton.innerHTML =
      '<i class="fas fa-moon"></i> <span>Switch to Dark Mode</span>';
  }
}

function resetForm() {
  addTaskForm.reset();
  setDefaultDateTime();
  document.getElementById('task-description').focus();
}
