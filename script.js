document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.querySelector('.js-task-list');
  const taskTemplate = document.getElementById('task-template').content;
  const addTaskForm = document.getElementById('add-task-form');
  const themeToggleButton = document.querySelector('.js-theme-toggle');
  const filters = document.querySelectorAll('.filter-btn');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let filter = 'all';
  let currentSortMethod = 'date';
  let currentSortOrder = 'asc';
  let currentCategorySortOrder = 'asc';

  function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter((task) => {
      if (filter === 'all') return true;
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
    });

    filteredTasks.sort((a, b) => {
      if (currentSortMethod === 'date') {
        const dateA = new Date(a.dueDate + ' ' + a.dueTime);
        const dateB = new Date(b.dueDate + ' ' + b.dueTime);
        return currentSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (currentSortMethod === 'category') {
        return currentCategorySortOrder === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (currentSortMethod === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return currentSortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

    filteredTasks.forEach((task) => {
      const clone = taskTemplate.cloneNode(true);
      const taskItem = clone.querySelector('.task-item');
      const taskTitle = clone.querySelector('.task-title');
      const taskDueDate = clone.querySelector('.task-due-date');
      const taskPriority = clone.querySelector('.task-priority');
      const taskCheckbox = clone.querySelector('.js-complete-checkbox');
      const editButton = clone.querySelector('.js-edit-button');
      const deleteButton = clone.querySelector('.js-delete-button');

      taskItem.dataset.id = task.id;
      taskTitle.textContent = task.description;
      taskDueDate.textContent = `Due: ${task.dueDate} ${task.dueTime || ''}`;
      taskPriority.textContent = task.priority;
      taskItem.classList.add(`priority-${task.priority.toLowerCase()}`);

      taskCheckbox.checked = task.completed;
      if (task.completed) {
        taskItem.classList.add('completed');
      }

      taskCheckbox.addEventListener('change', () =>
        toggleTaskCompletion(task.id)
      );
      editButton.addEventListener('click', () => editTask(task.id));
      deleteButton.addEventListener('click', () => deleteTask(task.id));

      taskList.appendChild(clone);
    });
  }

  function toggleTaskCompletion(id) {
    const task = tasks.find((task) => task.id === id);
    task.completed = !task.completed;
    if (task.completed) {
      showSuccessNotification();
    }
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  }

  function editTask(id) {
    const task = tasks.find((task) => task.id === id);
    document.querySelector('.js-name-input').value = task.description;
    document.querySelector('.js-category-input').value = task.category;
    document.querySelector('.js-priority-input').value = task.priority;
    document.querySelector('.js-date-input').value = task.dueDate;
    document.querySelector('.js-time-input').value = task.dueTime;
    deleteTask(id);
  }

  function handleAddTask(e) {
    e.preventDefault();
    const description = document.querySelector('.js-name-input').value;
    const category = document.querySelector('.js-category-input').value;
    const priority = document.querySelector('.js-priority-input').value;
    const dueDate = document.querySelector('.js-date-input').value;
    const dueTime = document.querySelector('.js-time-input').value;

    const newTask = {
      id: Date.now(),
      description,
      category,
      priority,
      dueDate,
      dueTime,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    addTaskForm.reset();
    setDefaultDateTime();
  }

  function setDefaultDateTime() {
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);

    inputDateElement.value = date;
    inputDateElement.min = date;
    inputTimeElement.value = time;
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function showSuccessNotification() {
    const success = document.getElementById('js-success-notification');
    success.style.display = 'flex';
    setTimeout(() => {
      success.style.display = 'none';
    }, 4000);
  }

  function sortTasks(sortBy) {
    if (sortBy === currentSortMethod) {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortOrder = 'asc';
    }
    currentSortMethod = sortBy;
    renderTasks();
  }

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filter = btn.dataset.filter;
      renderTasks();
    });
  });

  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleButton.textContent = document.body.classList.contains(
      'dark-mode'
    )
      ? 'Switch to Light Mode'
      : 'Switch to Dark Mode';
  });

  addTaskForm.addEventListener('submit', handleAddTask);

  document
    .querySelector('.sort-button-category')
    .addEventListener('click', () => sortTasks('category'));
  document
    .querySelector('.sort-button-priority')
    .addEventListener('click', () => sortTasks('priority'));

  setDefaultDateTime();
  renderTasks();
});
