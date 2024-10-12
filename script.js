/* global gsap */

let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

function addTodo() {
  const inputNameElement = document.querySelector('.js-name-input');
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');

  const name = inputNameElement.value.trim();
  const date = inputDateElement.value;
  const time = inputTimeElement.value;

  if (!name || !date || !time) {
    alert('Please fill in all fields: task, date, and time.');
    return; // Exit the function if any field is empty
  }

  const newTodo = { name, date, time };
  todoList.push(newTodo);
  saveTodoList();

  inputNameElement.value = '';
  setDefaultDateTime();

  updateTodoList();

  // Animate the newly added item
  const todoListElement = document.querySelector('.js-todo-list');
  const newItem = todoListElement.lastElementChild;
  if (newItem) {
    gsap.from(newItem, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'back.out(1.7)',
    });
  }
}

function deleteTodo(index) {
  const itemToDelete = document.querySelector(
    `.todo-item[data-index="${index}"]`
  );

  gsap.to(itemToDelete, {
    opacity: 0,
    x: 100,
    duration: 0.5,
    ease: 'power2.in',
    onComplete: () => {
      todoList.splice(index, 1);
      saveTodoList();
      updateTodoList();
    },
  });
}

function editTodo(index) {
  const todo = todoList[index];
  const inputNameElement = document.querySelector('.js-name-input');
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');
  const addButton = document.querySelector('.js-add-button');

  inputNameElement.value = todo.name;
  inputDateElement.value = todo.date;
  inputTimeElement.value = todo.time;

  addButton.innerHTML =
    '<img src="assets/edit-icon.png" alt="Update" width="16" height="16"> Update';
  addButton.onclick = () => updateTodo(index);

  // Highlight the item being edited
  const itemToEdit = document.querySelector(
    `.todo-item[data-index="${index}"]`
  );
  gsap.to(itemToEdit, {
    backgroundColor: '#fffacd',
    duration: 0.3,
    yoyo: true,
    repeat: 1,
  });
}

function updateTodo(index) {
  const inputNameElement = document.querySelector('.js-name-input');
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');
  const addButton = document.querySelector('.js-add-button');

  const name = inputNameElement.value.trim();
  const date = inputDateElement.value;
  const time = inputTimeElement.value;

  todoList[index] = { name, date, time };
  saveTodoList();

  inputNameElement.value = '';
  setDefaultDateTime();

  addButton.innerHTML =
    '<img src="assets/add-icon.png" alt="Add" width="16" height="16"> Add';
  addButton.onclick = addTodo;

  updateTodoList();

  // Animate the updated item
  const updatedItem = document.querySelector(
    `.todo-item[data-index="${index}"]`
  );
  if (updatedItem) {
    gsap.from(updatedItem, {
      scale: 0.8,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  }
}

function updateTodoList() {
  todoList.sort(
    (a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
  );

  const todoListElement = document.querySelector('.js-todo-list');
  todoListElement.innerHTML = '';

  todoList.forEach((todo, index) => {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    todoItem.setAttribute('data-index', index);
    todoItem.innerHTML = `
            <div class="todo-content">
                <div class="todo-name">${todo.name}</div>
                <div class="todo-datetime">${todo.date} ${todo.time}</div>
            </div>
            <div class="todo-actions">
                <button class="js-edit-button">
                    <img src="assets/edit-icon.png" alt="Edit" width="16" height="16"> Edit
                </button>
                <button class="js-delete-button">
                    <img src="assets/delete-icon.png" alt="Delete" width="16" height="16"> Delete
                </button>
            </div>
        `;

    const editButton = todoItem.querySelector('.js-edit-button');
    const deleteButton = todoItem.querySelector('.js-delete-button');

    editButton.addEventListener('click', () => editTodo(index));
    deleteButton.addEventListener('click', () => deleteTodo(index));

    todoListElement.appendChild(todoItem);
  });
}

function setDefaultDateTime() {
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');

  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].slice(0, 5);

  inputDateElement.value = date;
  inputTimeElement.value = time;
}

function saveTodoList() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function setupEventListeners() {
  const addButton = document.querySelector('.js-add-button');
  addButton.addEventListener('click', addTodo);
}

document.addEventListener('DOMContentLoaded', () => {
  updateTodoList();
  setDefaultDateTime();
  setupEventListeners();
  document.querySelector('.js-name-input').focus();
});
