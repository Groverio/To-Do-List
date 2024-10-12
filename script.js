let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
const addElement = document.querySelector('.js-add-html');
const inputNameElement = document.querySelector('.js-name-input');
const inputDateElement = document.querySelector('.js-date-input');
const inputTimeElement = document.querySelector('.js-time-input');
const addButton = document.querySelector('.js-add-button');

// Initialize the todo list on page load
updateTodoList();

function addTodo() {
    let name = inputNameElement.value.trim();
    let date = inputDateElement.value;
    let time = inputTimeElement.value;

    // Validation checks
    if (!name || !date || !time) {
        alert('Please fill in all fields: task, date, and time.');
        return;
    }

    // Add the new todo to the list and local storage
    todoList.push({ name, date, time });
    localStorage.setItem('todoList', JSON.stringify(todoList));

    // Clear input fields
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
    // Fill the input fields with the current values
    inputNameElement.value = todoList[index].name;
    inputDateElement.value = todoList[index].date;
    inputTimeElement.value = todoList[index].time;

    // Change the add button to an update button
    addButton.innerHTML = 'Update';
    addButton.onclick = function () { updateTodo(index); };
}

function updateTodoList() {
    addElement.innerHTML = ''; // Clear previous todos
    todoList.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('small-container', 'fade-in'); // Add fade-in class for animation
        todoItem.innerHTML = `
            <span>${todo.name} - ${todo.date} ${todo.time}</span>
            <button class="js-delete-button" onclick="deleteTodo(${index});">
                <img src="assets/delete-icon.png" alt="Delete" width="16" height="16">Delete
            </button>
            <button class="js-edit-button" onclick="editTodo(${index});">
                <img src="assets/edit-icon.png" alt="Edit" width="16" height="16">Edit
            </button>`;
        addElement.appendChild(todoItem);
    });
}
function updateTodo(index) {
    const name = inputNameElement.value.trim();
    const date = inputDateElement.value;
    const time = inputTimeElement.value;

    // Validation checks
    if (!name || !date || !time) {
        alert('Please fill in all fields: task, date, and time.');
        return;
    }

    // Update the todo in the list
    todoList[index] = { name, date, time };
    localStorage.setItem('todoList', JSON.stringify(todoList));

    // Clear input fields
    clearInputs();
    
    // Change the update button back to an add button
    addButton.innerHTML = 'Add';
    addButton.onclick = addTodo;

    // Update the displayed list
    updateTodoList();
}

function clearInputs() {
    inputNameElement.value = '';
    inputDateElement.value = '';
    inputTimeElement.value = '';
}
// CSS for Fade-In Animation
const style = document.createElement('style');
style.innerHTML = `
.fade-in {
    animation: fadeIn 0.5s ease forwards;
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`;
document.head.appendChild(style);
