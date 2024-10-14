let toastTimeout;

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) {
    console.error('Toast element not found');
    return;
  }

  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.style.display = 'block';

  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Load todo list from localStorage or initialize an empty array
let todoList = [];
try {
  const storedList = localStorage.getItem('todoList');
  todoList = storedList ? JSON.parse(storedList) : [];
} catch (error) {
  console.error('Error loading todo list from localStorage:', error);
  todoList = [];
}

let todoListhtml = '';
let currentSortMethod = 'date';
let currentSortOrder = 'asc';
let currentCategorySortOrder = 'asc';
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
  if (input.length > 120) {
    e.target.value = input.slice(0, 120);
    showToast('Maximum character limit (120) reached.', 'warning');
  }
});

let dateCheck = false;
let timeCheck = false;

document.querySelector('.js-date-input').addEventListener('click', (e) => {
  e.preventDefault();
  e.target.showPicker();
});

document.querySelector('.js-time-input').addEventListener('click', (e) => {
  e.preventDefault();
  e.target.showPicker();
});

function clearInputs() {
  const inputNameElement = document.querySelector('.js-name-input');
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');
  const inputCategoryElement = document.querySelector('.js-category-input');
  const inputPriorityElement = document.querySelector('.js-priority-input');

  // Clear the inputs
  inputNameElement.value = '';
  inputDateElement.value = '';
  inputTimeElement.value = '';
  inputCategoryElement.value = '';
  inputPriorityElement.value = '';
}

function addTodo() {
  const inputNameElement = document.querySelector('.js-name-input');
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');
  const inputCategoryElement = document.querySelector('.js-category-input');
  const inputPriorityElement = document.querySelector('.js-priority-input');

  let name = inputNameElement.value.trim();
  let date = inputDateElement.value;
  let time = inputTimeElement.value;
  let category = inputCategoryElement.value.trim();
  let priority = inputPriorityElement.value;

  // Validation checks
  if (!name || !date || !time || !category || !priority) {
    showToast('Please fill in all fields: task, date, time, category, and priority.', 'warning');
    return;
  }

  // Check that date and time are not in the past
  const now = new Date();
  const selectedDateTime = new Date(`${date}T${time}`);
  if (selectedDateTime < now) {
    showToast('Please select a future date and time.', 'warning');
    return;
  }

  if (isEditing && editIndex !== null) {
    // Update the existing todo
    todoList[editIndex] = { name, date, time, category, priority, completed: todoList[editIndex].completed };
    isEditing = false;
    editIndex = null;
    document.querySelector('.js-add-button').innerHTML = '';
    document.querySelector('.js-add-button').appendChild(addIcon);
    showToast('Todo updated successfully', 'success');
  } else {
    // Add a new todo
    todoList.push({ name, date, time, category, priority, completed: false });
    showToast('Todo added successfully', 'success');
  }

  // Save to localStorage
  localStorage.setItem('todoList', JSON.stringify(todoList));
  clearInputs();
  updateTodoList();
}

function deleteTodo(index) {
  if (index < 0 || index >= todoList.length) {
    showToast('Invalid delete index.', 'error');
    return;
  }
  todoList.splice(index, 1);
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
  showToast('Todo deleted successfully', 'success');
}

function editTodo(index) {
  if (index < 0 || index >= todoList.length) {
    showToast('Invalid edit index.', 'error');
    return;
  }
  const inputNameElement = document.querySelector('.js-name-input');
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');
  const inputCategoryElement = document.querySelector('.js-category-input');
  const inputPriorityElement = document.querySelector('.js-priority-input');

  inputNameElement.value = todoList[index].name;
  inputDateElement.value = todoList[index].date;
  inputTimeElement.value = todoList[index].time;
  inputCategoryElement.value = todoList[index].category;
  inputPriorityElement.value = todoList[index].priority;

  isEditing = true;
  editIndex = index;

  document.querySelector('.js-add-button').innerHTML = '';
  document.querySelector('.js-add-button').appendChild(checkIcon);
}

function cancelEditTodo() {
  isEditing = false;
  editIndex = null;
  clearInputs();

  // Reset button
  const addButton = document.querySelector('.js-add-button');
  addButton.innerHTML = '';
  addButton.appendChild(addIcon);
}

function updateTodoList() {
  const addElement = document.querySelector('.js-add-html');
  let filteredTodos = todoList.filter((todo) => {
    return filterMethod === 'all' || (filterMethod === 'completed' && todo.completed) || (filterMethod === 'pending' && !todo.completed);
  });

  // Sort todos based on currentSortMethod and currentSortOrder
  filteredTodos.sort((a, b) => {
    const aDateTime = new Date(`${a.date} ${a.time}`);
    const bDateTime = new Date(`${b.date} ${b.time}`);
    return currentSortOrder === 'asc' ? aDateTime - bDateTime : bDateTime - aDateTime;
  });

  // Build the todo list HTML
  todoListhtml = '';
  filteredTodos.forEach((todo, index) => {
    todoListhtml += `
      <div class="small-container ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" class="js-complete-checkbox" data-index="${index}" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})">
        <div class="task-info">
          <span class="task-name">${todo.name}</span>
          <span class="category-tag">${todo.category}</span>
          <span class="priority-tag priority-${todo.priority}">${todo.priority}</span>
        </div>
        <button class="js-delete-button" onclick="deleteTodo(${index})"><i class="fa-solid fa-trash"></i></button>
        <button class="js-edit-button" onclick="editTodo(${index})"><i class="fa-solid fa-pen"></i></button>
      </div>
      <div class="small-container">${todo.date} ${todo.time}</div>
    `;
  });

  addElement.innerHTML = todoListhtml;
}

// Toggle completion status of todo
function toggleComplete(index) {
  if (index < 0 || index >= todoList.length) {
    showToast('Invalid toggle index.', 'error');
    return;
  }
  todoList[index].completed = !todoList[index].completed;
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
}

// Initialize default date and time input
function setDefaultDateTime() {
  const now = new Date();
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');

  inputDateElement.value = now.toISOString().split('T')[0]; // Set default to today
  inputTimeElement.value = now.toTimeString().split(' ')[0].slice(0, 5); // Set default to current time
}

// Call to set initial default date and time
setDefaultDateTime();
updateTodoList(); // Initial call to display the list
