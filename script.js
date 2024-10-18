let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let todoListhtml = '';
let currentSortMethod = 'date'; // Default sort method
let currentSortOrder = 'asc'; // Default sort order for priority
let currentCategorySortOrder = 'asc'; // Default sort order for category

let isEditing = false;
let editIndex = null;

let filterMethod = 'all';

// Add icon - for add action
const addIcon = document.createElement('i');
addIcon.classList.add('fa-solid', 'fa-add');

// Check icon - for update action
const checkIcon = document.createElement('i');
checkIcon.classList.add('fa-solid', 'fa-check');

// Display the remaining characters count out of 120
document.querySelector('.js-name-input').addEventListener('input', (e) => {
  let input = e.target.value;
  if (input.length >= 120) {
    alert('Max character limit of 120 exceeded');
  }
});

let dateCheck = false;
let timeCheck = false;

document.querySelector('.js-date-input').addEventListener('click', (e) => {
  if (!dateCheck) {
    e.target.showPicker();
    dateCheck = true;
  } else {
    dateCheck = false;
  }
});

document.querySelector('.js-time-input').addEventListener('click', (e) => {
  if (!timeCheck) {
    e.target.showPicker();
    timeCheck = true;
  } else {
    timeCheck = false;
  }
});

function clearInputs() {
  document.querySelector('.js-name-input').value = '';
  document.querySelector('.js-date-input').value = '';
  document.querySelector('.js-time-input').value = '';
  document.querySelector('.js-category-input').value = '';
  document.querySelector('.js-priority-input').value = '';
  setDefaultDateTime();
}

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

  // Validation checks
  if (!name || !date || !time || !category || !priority) {
    alert('Please fill in all fields: task, date, time, category, and priority.');
    return;
  }

  if (isEditing) {
    // Update the existing todo
    todoList[editIndex] = { name, date, time, category, priority, completed: false };
    isEditing = false;
    editIndex = null;

    document.querySelector('.js-add-button').innerHTML = '';
    document.querySelector('.js-add-button').appendChild(addIcon);
    document.querySelector('.js-cancel-button').style.display = 'none';
  } else {
    todoList.push({ name, date, time, category, priority, completed: false });
  }

  localStorage.setItem('todoList', JSON.stringify(todoList));
  clearInputs();
  updateTodoList();
}

function deleteTodo(index) {
  todoList.splice(index, 1);
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
}

function editTodo(index) {
  const todo = todoList[index];

  document.querySelector('.js-name-input').value = todo.name;
  document.querySelector('.js-date-input').value = todo.date;
  document.querySelector('.js-time-input').value = todo.time;
  document.querySelector('.js-category-input').value = todo.category;
  document.querySelector('.js-priority-input').value = todo.priority;

  isEditing = true;
  editIndex = index;

  document.querySelector('.js-cancel-button').style.display = 'block';
  document.querySelector('.js-add-button').innerHTML = '';
  document.querySelector('.js-add-button').appendChild(checkIcon);
}

function cancelEditTodo() {
  isEditing = false;
  editIndex = null;

  clearInputs();
  document.querySelector('.js-cancel-button').style.display = 'none';
  document.querySelector('.js-add-button').innerHTML = '';
  document.querySelector('.js-add-button').appendChild(addIcon);
}

function updateTodoList() {
  let filteredTodos = todoList;

  if (filterMethod === 'pending') {
    filteredTodos = todoList.filter(todo => !todo.completed);
  } else if (filterMethod === 'completed') {
    filteredTodos = todoList.filter(todo => todo.completed);
  }

  filteredTodos.sort((a, b) => {
    if (currentSortMethod === 'date') {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA - dateB;
    } else if (currentSortMethod === 'category') {
      return currentCategorySortOrder === 'asc' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
    } else if (currentSortMethod === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return currentSortOrder === 'asc' ? priorityOrder[a.priority] - priorityOrder[b.priority] : priorityOrder[b.priority] - priorityOrder[a.priority];
    }
  });

  const addElement = document.querySelector('.js-add-html');
  todoListhtml = '';

  filteredTodos.forEach((todo, i) => {
    todoListhtml += `
      <div class="small-container ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" class="js-complete-checkbox" data-index="${i}" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${i})">
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
  });

  if (todoList.length === 0) {
    addElement.style.display = 'none';
  } else {
    addElement.style.display = 'grid';
    addElement.innerHTML = todoListhtml;
  }

  document.querySelectorAll('.js-delete-button').forEach(button => {
    button.addEventListener('click', event => {
      const index = event.currentTarget.getAttribute('data-index');
      deleteTodo(index);
    });
  });

  document.querySelectorAll('.js-edit-button').forEach(button => {
    button.addEventListener('click', event => {
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
  inputTimeElement.min = time;
}

function toggleComplete(index) {
  todoList[index].completed = !todoList[index].completed;
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
}

document.addEventListener('DOMContentLoaded', () => {
  updateTodoList();
  setDefaultDateTime();

  document.querySelector('.js-cancel-button').style.display = 'none';

  document.querySelector('.js-add-button').addEventListener('click', addTodo);
  document.querySelector('.js-cancel-button').addEventListener('click', cancelEditTodo);

  document.querySelector('.sort-button-category').addEventListener('click', () => sortTodos('category'));
  document.querySelector('.sort-button-priority').addEventListener('click', () => sortTodos('priority'));

  document.querySelector('.js-filter-input').addEventListener('change', filterTodos);
});
