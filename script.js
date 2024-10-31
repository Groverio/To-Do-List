let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let todoListhtml = '';
console.log(todoList);
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
  if (input.length > 120) {
    showToast('max character limits reached', 'Danger');
    e.target.value = input.slice(0, 120);
  }
});

let dateCheck = false;
let timeCheck = false;

document.querySelector('.js-date-input').addEventListener('click', (e) => {
  e.preventDefault();
  if (!dateCheck) {
    e.target.showPicker();
    dateCheck = true;
  } else {
    dateCheck = false;
  }
});

document.querySelector('.js-date-input').addEventListener('blur', () => {
  dateCheck = false;
});

document.querySelector('.js-time-input').addEventListener('click', (e) => {
  e.preventDefault();
  if (!timeCheck) {
    e.target.showPicker();
    timeCheck = true;
  } else {
    timeCheck = false;
  }
});

document.querySelector('.js-time-input').addEventListener('blur', () => {
  timeCheck = false;
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
  setDefaultDateTime();
}

function validInfo(name, date, time, category, priority) {
  const specifyMessage = [];
  if (!name) {
    specifyMessage.push('task');
  }
  if (!date) {
    specifyMessage.push('date');
  }
  if (!time) {
    specifyMessage.push('time');
  }
  if (!category) {
    specifyMessage.push('category');
  }
  if (!priority) {
    specifyMessage.push('priority');
  }

  if (!name || !date || !time || !category || !priority) {
    showToast(
      `Please fill this fields: ${specifyMessage.join(', ')}.`,
      'Danger'
    );
    return false;
  }
  return true;
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
  if (!validInfo(name, date, time, category, priority)) return;

  // Check that date is not in past
  if (date < inputDateElement.min) {
    showToast('Please select the current date or a future date.', 'Danger');
    return;
  }

  // Check that time is not in past
  if (time < inputTimeElement.min && date === inputDateElement.min) {
    showToast('Please select the current time or a future time.', 'Danger');
    return;
  }

  if (isEditing) {
    // Update the existing todo
    todoList[editIndex] = {
      name,
      date,
      time,
      category,
      priority,
      completed: false,
    }; // Ensure completed is set
    isEditing = false; // Reset edit mode
    editIndex = null;

    // Change the button back to 'Add'
    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = '';
    addButton.title = 'Add';
    addButton.appendChild(addIcon);

    // Hide cancel button
    const cancelEditBtn = document.querySelector('.js-cancel-button');
    cancelEditBtn.style.display = 'none';
  } else {
    // Add a new todo
    todoList.push({ name, date, time, category, priority, completed: false }); // Ensure completed is set
  }

  // Save to localStorage
  localStorage.setItem('todoList', JSON.stringify(todoList));

  // Reset the inputs
  clearInputs();

  // Update the displayed list
  updateTodoList();
  updateTaskCounter();
}

function deleteTodo(index) {
  // Remove the specific todo from the list
  todoList.splice(index, 1);
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
  updateTaskCounter();
}

function editTodo(index) {
  let inputNameElement = document.querySelector('.js-name-input');
  let inputDateElement = document.querySelector('.js-date-input');
  let inputTimeElement = document.querySelector('.js-time-input');
  let inputCategoryElement = document.querySelector('.js-category-input');
  let inputPriorityElement = document.querySelector('.js-priority-input');

  // Fill the input fields with the current values
  inputNameElement.value = todoList[index].name;
  inputDateElement.value = todoList[index].date;
  inputTimeElement.value = todoList[index].time;
  inputCategoryElement.value = todoList[index].category;
  inputPriorityElement.value = todoList[index].priority;

  // Set editing mode and the index of the todo being edited
  isEditing = true;
  editIndex = index;

  // Enable cancel option
  const cancelEditBtn = document.querySelector('.js-cancel-button');
  cancelEditBtn.style.display = 'block';

  // Change the add button to 'Update'
  const addButton = document.querySelector('.js-add-button');
  addButton.innerHTML = '';
  addButton.title = 'Update';
  addButton.appendChild(checkIcon);
  updateTaskCounter();
}

function cancelEditTodo() {
  isEditing = false; // Reset edit mode
  editIndex = null;

  // Reset the inputs
  clearInputs();

  // Hide edit cancel action button on page load
  const cancelEditBtn = document.querySelector('.js-cancel-button');
  cancelEditBtn.style.display = 'none';

  // Change the button back to 'Add'
  const addButton = document.querySelector('.js-add-button');
  addButton.innerHTML = '';
  addButton.title = 'Add';
  addButton.appendChild(addIcon);
  updateTaskCounter();
}

function updateTodoList() {
  // Sort todoList based on the current sort method
  let filteredTodos = todoList;

  // Apply filtering based on the selected filter method
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
    updateTaskCounter();
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

  // Show or hide the task container based on the presence of tasks
  if (todoList.length === 0) {
    addElement.style.display = 'none'; // Hide if no tasks
  } else {
    addElement.style.display = 'grid'; // Show if tasks exist
    addElement.innerHTML = todoListhtml;
  }

  // Add event listeners for delete and edit buttons
  document.querySelectorAll('.js-delete-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index');
      deleteTodo(index);
    });
  });

  document.querySelectorAll('.js-edit-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index');
      editTodo(index);
    });
  });

  // Call the task counter update function
  updateTaskCounter();
}

function setDefaultDateTime() {
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');

  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].slice(0, 5);

  inputDateElement.value = date;
  inputDateElement.min = date; // Set the min attribute to today's date
  inputTimeElement.value = time;
  inputTimeElement.min = time; // Set the min attribute to current time
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

// this shows the sucessNotification for 4000ms
function successNotification() {
  const success = document.getElementById('js-success-notification');
  success.style.display = 'flex';
  setTimeout(() => {
    success.style.display = 'none';
  }, 4000);
}

// eslint-disable-next-line no-unused-vars
function toggleComplete(index) {
  todoList[index].completed = !todoList[index].completed;
  if (todoList[index].completed) {
    successNotification();
  }
  localStorage.setItem('todoList', JSON.stringify(todoList));
  updateTodoList();
  updateTaskCounter();
}

function updateTaskCounter() {
  const totalTasks = todoList.length;

  // Select the element where the task counter is displayed
  const taskCounterButton = document.querySelector('.task-counter-button');

  // Update the text of the task counter button
  if (taskCounterButton) {
    taskCounterButton.innerText = `Tasks: ${totalTasks}`;
  }
}

// Initialize the todo list and set default date and time on page load
document.addEventListener('DOMContentLoaded', () => {
  updateTodoList();
  setDefaultDateTime();

  // Set focus on the name input field
  const inputNameElement = document.querySelector('.js-name-input');
  inputNameElement.focus();

  // Hide edit cancel action button on page load
  const cancelEditBtn = document.querySelector('.js-cancel-button');
  cancelEditBtn.style.display = 'none';

  // Add event listeners to buttons
  document.querySelector('.js-add-button').addEventListener('click', addTodo);
  document
    .querySelector('.js-cancel-button')
    .addEventListener('click', cancelEditTodo);

  // Add event listeners for sorting buttons
  document
    .querySelector('.sort-button-category')
    .addEventListener('click', () => sortTodos('category'));
  document
    .querySelector('.sort-button-priority')
    .addEventListener('click', () => sortTodos('priority'));

  // Add event listener for filter button
  document
    .querySelector('.js-filter-input')
    .addEventListener('change', filterTodos);
});

// Add year in the footer(CopyRight Notice)
let year = document.querySelector('.year');
year.innerText = new Date().getFullYear();

/** New toast Info */
class Toast {
  constructor(message, color, time) {
    this.message = message;
    this.color = color;
    this.time = time;
    this.element = null;
    const element = document.createElement('div');
    element.className = 'toast-notification hide';
    this.element = element;
    const countElements = document.getElementsByClassName('toast-notification');
    element.style.opacity = 0.9;

    element.style.marginBottom = countElements.length * 55 + 'px';

    element.style.backgroundColor = this.color;

    element.textContent = this.message;

    const close = document.createElement('div');
    close.className = 'close-notification';

    const icon = document.createElement('i');
    icon.className = 'fa fa-times';

    close.appendChild(icon);
    element.appendChild(close);

    document.body.appendChild(element);

    setTimeout(() => {
      element.classList.replace('hide', 'show');
    }, 100);

    setTimeout(() => {
      element.classList.replace('show', 'hide');
      setTimeout(() => element.remove(), 300);
    }, this.time);

    close.addEventListener('click', () => {
      element.classList.replace('show', 'hide');
      setTimeout(() => element.remove(), 300);
    });
  }
}

const ToastType = {
  Danger: '#eb3b5a',
  Warning: '#f6b93b',
  Succes: '#00b894',
};
function showToast(message, type) {
  new Toast(message, ToastType[type], 3000);
}
