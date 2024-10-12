let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let todoListhtml = '';

document.addEventListener('DOMContentLoaded', () => {
  updateTodoList();
  setDefaultDateTime();

  document.querySelector('.js-theme-toggle').addEventListener('click', toggleTheme);

  const inputNameElement = document.querySelector('.js-name-input');
  inputNameElement.focus();
});

function addTodo() {
  const inputNameElement = document.querySelector('.js-name-input');
  let name = inputNameElement.value;

  const inputPriorityElement = document.querySelector('.js-priority-input');
  let priority = inputPriorityElement.value;

  const inputDateElement = document.querySelector('.js-date-input');
  let date = inputDateElement.value;

  const inputTimeElement = document.querySelector('.js-time-input');
  let time = inputTimeElement.value;

  if (!name || !date || !time) {
    alert('Please fill in all fields: task, date, time.');
    return;
  }

  todoList.push({ name, priority, date, time, completed: false });
  localStorage.setItem('todoList', JSON.stringify(todoList));

  inputNameElement.value = '';
  setDefaultDateTime();
  updateTodoList();
}

function updateTodoList() {
  todoList.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

  const addElement = document.querySelector('.js-add-html');
  todoListhtml = '';

  todoList.forEach((todo, i) => {
    let completedClass = todo.completed ? 'completed' : '';
    todoListhtml += `
      <div class="small-container ${completedClass} ${priorityClass(todo.priority)}">${todo.name} (${todo.priority})</div>
      <div class="small-container">${todo.date} ${todo.time}</div>
      <button class="js-complete-button" data-index="${i}">✔️ Complete</button>
      <button class="js-edit-button" data-index="${i}">✏️ Edit</button>
      <button class="js-delete-button" data-index="${i}">🗑️ Delete</button>
    `;
  });

  addElement.innerHTML = todoListhtml;
  addEventListeners();
}

function addEventListeners() {
  document.querySelectorAll('.js-delete-button').forEach((button) => {
    button.addEventListener('click', function () {
      const index = button.getAttribute('data-index');
      if (confirm('Are you sure you want to delete this task?')) {
        deleteTodo(index);
      }
    });
  });

  document.querySelectorAll('.js-edit-button').forEach((button) => {
    button.addEventListener('click', function () {
      const index = button.getAttribute('data-index');
      editTodo(index);
    });
  });

  document.querySelectorAll('.js-complete-button').forEach((button) => {
    button.addEventListener('click', function () {
      const index = button.getAttribute('data-index');
      markComplete(index);
    });
  });
}

function markComplete(index) {
  todoList[index].completed = true;
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

function priorityClass(priority) {
  if (priority === 'High') return 'priority-high';
  if (priority === 'Medium') return 'priority-medium';
  return 'priority-low';
}

function setDefaultDateTime() {
  const now = new Date();
  document.querySelector('.js-date-input').value = now.toISOString().split('T')[0];
  document.querySelector('.js-time-input').value = now.toTimeString().split(' ')[0].slice(0, 5);
}
