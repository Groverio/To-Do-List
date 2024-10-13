document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.querySelector('.js-task-list');
    const taskTemplate = document.getElementById('task-template').content;
    const addTaskForm = document.getElementById('add-task-form');
    const themeToggleButton = document.querySelector('.js-theme-toggle');
    const filters = document.querySelectorAll('.filter-btn');
    
    let tasks = [];
    let filter = 'all';

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        });

        filteredTasks.forEach(task => {
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

            taskCheckbox.addEventListener('click', () => toggleTaskCompletion(task.id));
            editButton.addEventListener('click', () => editTask(task.id));
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(clone);
        });
    }

    function toggleTaskCompletion(id) {
        const task = tasks.find(task => task.id === id);
        task.completed = !task.completed;
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }

    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        document.querySelector('.js-name-input').value = task.description;
        document.querySelector('.js-priority-input').value = task.priority;
        document.querySelector('.js-date-input').value = task.dueDate;
        document.querySelector('.js-time-input').value = task.dueTime;
        deleteTask(id); 
    }

    function handleAddTask(e) {
        e.preventDefault();
        const description = document.querySelector('.js-name-input').value;
        const priority = document.querySelector('.js-priority-input').value;
        const dueDate = document.querySelector('.js-date-input').value;
        const dueTime = document.querySelector('.js-time-input').value;

        const newTask = {
            id: Date.now(),
            description,
            priority,
            dueDate,
            dueTime,
            completed: false
        };

        tasks.push(newTask);
        renderTasks();
        addTaskForm.reset(); 

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filter = btn.dataset.filter;
            renderTasks();
        });
let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let todoListhtml = '';
console.log(todoList);
let currentSortMethod = 'date'; 
let currentSortOrder = 'asc'; 
let currentCategorySortOrder = 'asc'; 

let isEditing = false;
let editIndex = null;

let filterMethod = 'all';

document.querySelector('.js-name-input').addEventListener('input', (e) => {
  let input = e.target.value;
  if (input.length === 120) {
    alert('max character limits exceeded');
  }
});

function addTodo() {
  const inputNameElement = document.querySelector('.js-name-input');
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');
  const inputCategoryElement = document.querySelector('.js-category-input');
  const inputPriorityElement = document.querySelector('.js-priority-input');

  let name = inputNameElement.value;
  let date = inputDateElement.value;
  let time = inputTimeElement.value;
  let category = inputCategoryElement.value;
  let priority = inputPriorityElement.value;

  if (!name || !date || !time || !category || !priority) {
    alert(
      'Please fill in all fields: task, date, time, category, and priority.'
    );
    return;
  }

  if (isEditing) {
    todoList[editIndex] = {
      name,
      date,
      time,
      category,
      priority,
      completed: false,
    }; 
    isEditing = false; 
    editIndex = null;

    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = 'Add';
  } else {
    todoList.push({ name, date, time, category, priority, completed: false }); // Ensure completed is set
  }

  localStorage.setItem('todoList', JSON.stringify(todoList));

  inputNameElement.value = '';
  inputDateElement.value = '';
  inputTimeElement.value = '';
  inputCategoryElement.value = '';
  inputPriorityElement.value = '';
  setDefaultDateTime();

  updateTodoList();
}

function deleteTodo(index) {
  todoList.splice(index, 1);
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
}

function editTodo(index) {
  let inputNameElement = document.querySelector('.js-name-input');
  let inputDateElement = document.querySelector('.js-date-input');
  let inputTimeElement = document.querySelector('.js-time-input');
  let inputCategoryElement = document.querySelector('.js-category-input');
  let inputPriorityElement = document.querySelector('.js-priority-input');

  inputNameElement.value = todoList[index].name;
  inputDateElement.value = todoList[index].date;
  inputTimeElement.value = todoList[index].time;
  inputCategoryElement.value = todoList[index].category;
  inputPriorityElement.value = todoList[index].priority;

  isEditing = true;
  editIndex = index;

  const addButton = document.querySelector('.js-add-button');
  addButton.innerHTML = 'Update';
}

function updateTodoList() {
  let filteredTodos = todoList;
  if (filterMethod === 'pending') {
    filteredTodos = todoList.filter((todo) => !todo.completed);
  } else if (filterMethod === 'completed') {
    filteredTodos = todoList.filter((todo) => todo.completed);
  }

  filteredTodos.sort((a, b) => {
    if (currentSortMethod === 'date') {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA - dateB;
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

  const addElement = document.querySelector('.js-add-html');
  todoListhtml = '';

  for (let i = 0; i < filteredTodos.length; i++) {
    const todo = filteredTodos[i];
    todoListhtml += `
      <div class="small-container ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" class="js-complete-checkbox" data-index="${i}" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todoList.indexOf(todo)})">
        <div class="task-info">
          <span class="task-name">${todo.name}</span>
          <span class="category-tag">${todo.category}</span>
          <span class="priority-tag priority-${todo.priority}">${todo.priority}</span>
        </div>
      </div>
      <div class="small-container">${todo.date}</div>
      <div class="small-container">${todo.time}</div>
      <button class="js-delete-button" data-index="${i}">
        <i class="fa-solid fa-trash"></i>
      </button>
      <button class="js-edit-button" data-index="${i}">
        <i class="fa-solid fa-pen"></i>
      </button>`;
  }

  if (todoList.length === 0) {
    addElement.style.display = 'none'; 
  } else {
    addElement.style.display = 'grid'; 
    addElement.innerHTML = todoListhtml;
  }

  document.querySelectorAll('.js-delete-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index');
      deleteTodo(index);
    });

    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            themeToggleButton.textContent = 'Switch back to Light Mode';
        } else {
            themeToggleButton.textContent = 'Switch to Dark Mode';
        }
    });

    addTaskForm.addEventListener('submit', handleAddTask);

    renderTasks();
  document.querySelectorAll('.js-edit-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index');
      editTodo(index);
    });
  });
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

function sortTodos(sortBy) {
  if (sortBy === 'priority') {
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  } else if (sortBy === 'category') {
    currentCategorySortOrder =
      currentCategorySortOrder === 'asc' ? 'desc' : 'asc';
  }
  currentSortMethod = sortBy;
  updateTodoList();
}

function filterTodos() {
  const filterElement = document.querySelector('.js-filter-input');
  filterMethod = filterElement.value;
  updateTodoList();
}

function successNotification() {
  const success = document.getElementById('js-success-notification');
  success.style.display = 'flex';
  setTimeout(() => {
    success.style.display = 'none';
  }, 4000);
}

function toggleComplete(index) {
  todoList[index].completed = !todoList[index].completed;
  if (todoList[index].completed) {
    successNotification();
  }
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
}

document.addEventListener('DOMContentLoaded', () => {
  updateTodoList();
  setDefaultDateTime();

  const inputNameElement = document.querySelector('.js-name-input');
  inputNameElement.focus();

  document.querySelector('.js-add-button').addEventListener('click', addTodo);

  document
    .querySelector('.sort-button-category')
    .addEventListener('click', () => sortTodos('category'));
  document
    .querySelector('.sort-button-priority')
    .addEventListener('click', () => sortTodos('priority'));

  document
    .querySelector('.js-filter-input')
    .addEventListener('change', filterTodos);
});
