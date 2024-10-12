let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let todoListhtml = '';
console.log(todoList);

function addTodo() {
  const inputNameElement = document.querySelector('.js-name-input');
  let name = inputNameElement.value;
  const inputDateElement = document.querySelector('.js-date-input');
  let date = inputDateElement.value;
  const inputTimeElement = document.querySelector('.js-time-input');
  let time = inputTimeElement.value;

  // Validation checks
  if (!name || !date || !time) {
    alert('Please fill in all fields: task, date, and time.');
    return;
  }

  todoList.push({ name, date, time });
  localStorage.setItem('todoList', JSON.stringify(todoList));

  inputNameElement.value = '';
  inputDateElement.value = '';
  inputTimeElement.value = '';
  setDefaultDateTime();

  // Update the displayed list
  updateTodoList();
}

// eslint-disable-next-line no-unused-vars
function deleteTodo(index) {
  // Remove the specific todo from the list
  todoList.splice(index, 1);
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
}
// eslint-disable-next-line no-unused-vars
function editTodo(index) {
  let inputNameElement = document.querySelector('.js-name-input');
  let inputDateElement = document.querySelector('.js-date-input');
  let inputTimeElement = document.querySelector('.js-time-input');

  // Fill the input fields with the current values
  inputNameElement.value = todoList[index].name;
  inputDateElement.value = todoList[index].date;
  inputTimeElement.value = todoList[index].time;

  // Change the add button to an update button
  const addButton = document.querySelector('.js-add-button');
  addButton.innerHTML = 'Update';

  // Update the add button's onclick function to call updateTodo with the correct index
  addButton.onclick = function () {
    updateTodo(index);
  };
}

function updateTodoList() {
  // Sort todoList by date and time before rendering
  todoList.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time);
    const dateB = new Date(b.date + ' ' + b.time);
    return dateA - dateB; // Sort by ascending date and time
  });

  const addElement = document.querySelector('.js-add-html');
  todoListhtml = '';

  for (let i = 0; i < todoList.length; i++) {
    todoListhtml += `<div class="small-container">${todoList[i].name}</div>
                         <div class="small-container">${todoList[i].date} ${todoList[i].time}</div>
                         <button class="js-delete-button" data-index="${i}">
                            <img src="assets/delete-icon.png" alt="Delete" width="16" height="16">delete
                         </button>
                         <button class="js-edit-button" data-index="${i}">
                            <img src="assets/edit-icon.png" alt="Edit" width="16" height="16">edit
                         </button>`;
  }

  addElement.innerHTML = todoListhtml;

  document.querySelectorAll('.js-delete-button').forEach((button) => {
    button.addEventListener('click', function () {
      const index = button.getAttribute('data-index');
      deleteTodo(index);
    });
  });

  document.querySelectorAll('.js-edit-button').forEach((button) => {
    button.addEventListener('click', function () {
      const index = button.getAttribute('data-index');
      editTodo(index);
    });
  });
}

function updateTodo(index) {
  const inputNameElement = document.querySelector('.js-name-input');
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');

  // Validation checks
  if (
    !inputNameElement.value ||
    !inputDateElement.value ||
    !inputTimeElement.value
  ) {
    alert('Please fill in all fields: task, date, and time.');
    return;
  }

  // Update the todo in the list
  todoList[index].name = inputNameElement.value;
  todoList[index].date = inputDateElement.value;
  todoList[index].time = inputTimeElement.value;

  // Update local storage
  localStorage.setItem('todoList', JSON.stringify(todoList));

  // Clear the input fields
  inputNameElement.value = '';

  // Set default date and time
  setDefaultDateTime();

  // Change the update button back to an add button
  const addButton = document.querySelector('.js-add-button');
  addButton.innerHTML = 'Add';
  addButton.onclick = addTodo;

  // Update the displayed list
  updateTodoList();
}

function setDefaultDateTime() {
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');

  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  const time = now.toTimeString().split(' ')[0].slice(0, 5); // HH:MM format

  inputDateElement.value = date;
  inputTimeElement.value = time;
}

// Initialize the todo list and set default date and time on page load
document.addEventListener('DOMContentLoaded', () => {
  updateTodoList();
  setDefaultDateTime();

  // Set focus on the name input field
  const inputNameElement = document.querySelector('.js-name-input');
  inputNameElement.focus();
});
