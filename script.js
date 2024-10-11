let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let todoListhtml = '';

function setDefault() {
  let current = new Date();
  let date = current.getDate();
  let month = current.getMonth() + 1; // JavaScript months are zero-indexed (0 = January)
  let year = current.getFullYear();

  let hours = current.getHours();
  let minutes = current.getMinutes();

  // To maintain the expected length
  if (date < 10) date = "0" + date;
  if (month < 10) month = "0" + month;
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;

  const inputDateElement = document.querySelector(".js-date-input");
  inputDateElement.value = `${year}-${month}-${date}`;
  const inputTimeElement = document.querySelector(".js-time-input");
  inputTimeElement.value = `${hours}:${minutes}`;
}
setDefault();
let intervalId;
startInterval();

// Function to start the interval
function startInterval() {
  if (!intervalId) {
    // to update every minute
    intervalId = setInterval(setDefault, 1000 * 60);
  }
}
const inputDateElement = document.querySelector(".js-date-input");
inputDateElement.addEventListener("change", () => {
  stopInterval();
});

// Function to stop the interval
function stopInterval() {
    if (intervalId) {
        clearInterval(intervalId); // Clear the interval
        intervalId = null; // Reset the intervalId
    }
}

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

    // Update the displayed list
    updateTodoList();
    setDefault();
    startInterval();
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

    // Fill the input fields with the current values
    inputNameElement.value = todoList[index].name;
    inputDateElement.value = todoList[index].date;
    inputTimeElement.value = todoList[index].time;

    // Change the add button to an update button
    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = 'Update';

    // Update the add button's onclick function to call updateTodo with the correct index
    addButton.onclick = function () { updateTodo(index); };
}

function updateTodoList() {
    const addElement = document.querySelector('.js-add-html');
    todoListhtml = '';

    for (let i = 0; i < todoList.length; i++) {
        todoListhtml += `<div class="small-container">${todoList[i].name}</div>
                         <div class="small-container">${todoList[i].date} ${todoList[i].time}</div>
                         <button class="js-delete-button" onclick="deleteTodo(${i});">
                            <img src="assets/delete-icon.png" alt="Delete" width="16" height="16">delete
                         </button>
                         <button class="js-edit-button" onclick="editTodo(${i});">
                            <img src="assets/edit-icon.png" alt="Edit" width="16" height="16">edit
                         </button>`;
    }
    addElement.innerHTML = todoListhtml;
}

function updateTodo(index) {
    const inputNameElement = document.querySelector('.js-name-input');
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');

    // Validation checks
    if (!inputNameElement.value || !inputDateElement.value || !inputTimeElement.value) {
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
    inputDateElement.value = '';
    inputTimeElement.value = '';

    // Change the update button back to an add button
    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = 'Add';
    addButton.onclick = addTodo;

    // Update the displayed list
    updateTodoList();
}

// Initialize the todo list on page load
updateTodoList();
