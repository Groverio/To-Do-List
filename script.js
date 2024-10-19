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
  if (input.length === 120) {
    alert('max character limits exceeded');
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
  const inputCategoryElement = document.querySelector('.js-category-input');
  const inputPriorityElement = document.querySelector('.js-priority-input');

  // Clear the inputs
  inputNameElement.value = '';
  inputCategoryElement.value = '';
  inputPriorityElement.value = '';
  setDefaultDateTime(); // Call this function to reset date and time
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
    alert(
      'Please fill in all fields: task, date, time, category, and priority.'
    );
    return;
  }

  // Check that date is not in past
  if (date < inputDateElement.min) {
    alert('Please select the current date or a future date.');
    return;
  }

  // Check that time is not in past
  if (time < inputTimeElement.min && date === inputDateElement.min) {
    alert('Please select a future time.');
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
}

function deleteTodo(index) {
  // Remove the specific todo from the list
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
}

function updateTodoList() {
  let filteredTodos = getFilteredAndSortedTodos();

  const addElement = document.querySelector('.js-add-html');
  todoListhtml = '';

  for (let i = 0; i < filteredTodos.length; i++) {
    const todo = filteredTodos[i];
    todoListhtml += `
      <div class="small-container ${todo.completed ? 'completed' : ''}">
        <div class="task-checkbox">
          <input type="checkbox" class="js-complete-checkbox" data-index="${i}" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todoList.indexOf(todo)})">
        </div>
        <div class="task-info">
          <span class="task-name">${todo.name}</span>
          <div class="task-details">
            <span class="category-tag">${todo.category}</span>
            <span class="priority-tag priority-${todo.priority}">${todo.priority}</span>
          </div>
          <div class="task-date-time">
            <span class="task-date"><i class="fas fa-calendar-alt"></i> ${todo.date}</span>
            <span class="task-time"><i class="fas fa-clock"></i> ${todo.time}</span>
          </div>
          <div class="task-actions">
            <button class="js-edit-button" data-index="${i}">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="js-delete-button" data-index="${i}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>`;
  }

  addElement.innerHTML = todoListhtml;

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
}

function setDefaultDateTime() {
  const inputDateElement = document.querySelector('.js-date-input');
  const inputTimeElement = document.querySelector('.js-time-input');

  const now = new Date();
  
  // Format date as YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  // Format time as HH:MM
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  inputDateElement.value = formattedDate;
  inputDateElement.min = formattedDate; // Set the min attribute to today's date
  inputTimeElement.value = formattedTime;
  inputTimeElement.min = formattedTime; // Set the min attribute to current time
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
}

// Initialize the todo list and set default date and time on page load
document.addEventListener('DOMContentLoaded', () => {
  updateTodoList();
  setDefaultDateTime(); // Call this function when the page loads

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

// Add this function to the end of the file

function exportTasks(format) {
  if (format === 'csv') {
    exportTasksCSV();
  } else if (format === 'pdf') {
    exportTasksPDF();
  }
}

function exportTasksCSV() {
  // Create CSV content
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Name,Date,Time,Category,Priority,Completed\n";

  todoList.forEach(task => {
    const row = [
      task.name,
      task.date,
      task.time,
      task.category,
      task.priority,
      task.completed
    ].map(item => `"${item}"`).join(",");
    csvContent += row + "\n";
  });

  // Create a download link and trigger the download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "tasks.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Show a success notification
  const success = document.getElementById('js-success-notification');
  success.innerHTML = '<p>Tasks exported successfully!</p>';
  success.style.display = 'flex';
  setTimeout(() => {
    success.style.display = 'none';
    success.innerHTML = '<p>Task completed 🎉</p>';
  }, 4000);
}

function exportTasksPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text("Tasks List", 14, 22);

  // Add table headers
  doc.setFontSize(12);
  doc.setTextColor(100);

  // Table header
  const headers = ["Name", "Date", "Time", "Category", "Priority", "Completed"];
  let y = 30;
  doc.text(headers[0], 10, y);
  doc.text(headers[1], 60, y);
  doc.text(headers[2], 85, y);
  doc.text(headers[3], 105, y);
  doc.text(headers[4], 135, y);
  doc.text(headers[5], 160, y);

  // Table content
  doc.setTextColor(0);
  todoList.forEach((task, i) => {
    y = y + 10;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(task.name.substring(0, 25), 10, y);
    doc.text(task.date, 60, y);
    doc.text(task.time, 85, y);
    doc.text(task.category, 105, y);
    doc.text(task.priority, 135, y);
    doc.text(task.completed.toString(), 160, y);
  });

  // Save the PDF
  doc.save("tasks.pdf");

  // Show a success notification
  const success = document.getElementById('js-success-notification');
  success.innerHTML = '<p>Tasks exported to PDF successfully!</p>';
  success.style.display = 'flex';
  setTimeout(() => {
    success.style.display = 'none';
    success.innerHTML = '<p>Task completed 🎉</p>';
  }, 4000);
}

// Add this new function to get filtered and sorted todos
function getFilteredAndSortedTodos() {
  let filteredTodos = todoList;

  // Apply filtering based on the selected filter method
  if (filterMethod === 'pending') {
    filteredTodos = todoList.filter((todo) => !todo.completed);
  } else if (filterMethod === 'completed') {
    filteredTodos = todoList.filter((todo) => todo.completed);
  }

  // Apply sorting
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

  return filteredTodos;
}

// Dark mode toggle functionality
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    localStorage.setItem('darkMode', 'disabled');
  }
}

// Check for saved dark mode preference
function checkDarkModePreference() {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
  }
}

// Initialize dark mode
document.addEventListener('DOMContentLoaded', () => {
  checkDarkModePreference();

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  } else {
    console.error('Dark mode toggle button not found');
  }

  // ... (rest of your initialization code)
});
