let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let currentSortMethod = 'date';
let currentSortOrder = 'asc';
let currentCategorySortOrder = 'asc';
let isEditing = false;
let editIndex = null;
let filterMethod = 'all';

const addIcon = document.createElement('i');
addIcon.classList.add('fa-solid', 'fa-add');

const checkIcon = document.createElement('i');
checkIcon.classList.add('fa-solid', 'fa-check');

// Character limit warning
document.querySelector('.js-name-input').addEventListener('input', (e) => {
  if (e.target.value.length === 120) {
    alert('Max character limit of 120 exceeded.');
  }
});

let dateCheck = false;
let timeCheck = false;

// Date input picker
document.querySelector('.js-date-input').addEventListener('click', (e) => {
  if (!dateCheck) {
    e.target.showPicker();
    dateCheck = true;
  }
});

document.querySelector('.js-date-input').addEventListener('blur', () => {
  dateCheck = false;
});

// Time input picker
document.querySelector('.js-time-input').addEventListener('click', (e) => {
  if (!timeCheck) {
    e.target.showPicker();
    timeCheck = true;
  }
});

document.querySelector('.js-time-input').addEventListener('blur', () => {
  timeCheck = false;
});

function clearInputs() {
  document.querySelector('.js-name-input').value = '';
  document.querySelector('.js-date-input').value = '';
  document.querySelector('.js-time-input').value = '';
  document.querySelector('.js-category-input').value = '';
  document.querySelector('.js-priority-input').value = 'medium';
  setDefaultDateTime();
}

function addTodo() {
  const name = document.querySelector('.js-name-input').value;
  const date = document.querySelector('.js-date-input').value;
  const time = document.querySelector('.js-time-input').value;
  const category = document.querySelector('.js-category-input').value;
  const priority = document.querySelector('.js-priority-input').value;

  if (!name || !date || !time || !category || !priority) {
    alert('Please fill in all fields.');
    return;
  }

  const currentDateTime = new Date();
  const selectedDateTime = new Date(`${date}T${time}`);

  if (selectedDateTime < currentDateTime) {
    alert('Please select a future date and time.');
    return;
  }

  if (isEditing) {
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
  document.querySelector('.js-add-button').innerHTML = '';
  document.querySelector('.js-add-button').appendChild(checkIcon);
  document.querySelector('.js-cancel-button').style.display = 'block';
}

function updateTodoList() {
  const addElement = document.querySelector('.js-add-html');
  addElement.innerHTML = '';
  todoList.forEach((todo, index) => {
    const todoHTML = `
      <div class="small-container ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})">
        <span>${todo.name}</span>
        <span>${todo.date} ${todo.time}</span>
        <span>${todo.category}</span>
        <span>${todo.priority}</span>
        <button onclick="editTodo(${index})">Edit</button>
        <button onclick="deleteTodo(${index})">Delete</button>
      </div>`;
    addElement.innerHTML += todoHTML;
  });
}

function setDefaultDateTime() {
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');

  const now = new Date();
  inputDateElement.value = now.toISOString().split('T')[0];
  inputTimeElement.value = now.toTimeString().slice(0, 5);
}

function toggleComplete(index) {
  todoList[index].completed = !todoList[index].completed;
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  updateTodoList();
  setDefaultDateTime();
  document.querySelector('.js-cancel-button').style.display = 'none';
  document.querySelector('.js-add-button').addEventListener('click', addTodo);
  document.querySelector('.js-cancel-button').addEventListener('click', clearInputs);
});

// Dynamic footer year
document.getElementById('currentYear').textContent = new Date().getFullYear();
