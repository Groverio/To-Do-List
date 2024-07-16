let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let todoListhtml = '';
console.log(todoList);

function addTodo() {
    const inputNameElement = document.querySelector('.js-name-input');
    let name = inputNameElement.value;
    const inputDateElement = document.querySelector('.js-date-input');
    let date = inputDateElement.value;

    todoList.push({ name, date });
    localStorage.setItem('todoList', JSON.stringify(todoList));

    inputNameElement.value = '';
    inputDateElement.value = '';

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

    // Fill the input fields with the current values
    inputNameElement.value = todoList[index].name;
    inputDateElement.value = todoList[index].date;

    // Change the add button to an update button
    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = 'Update';

    // Update the add button's onclick function to call updateTodo with the correct index
    addButton.onclick = function() { updateTodo(index); };
}

function updateTodoList() {
    const addElement = document.querySelector('.js-add-html');
    todoListhtml = '';

    for (let i = 0; i < todoList.length; i++) {
        todoListhtml += `<div class="small-container">${todoList[i].name}</div><div class="small-container">${todoList[i].date}</div>
        <button class="js-delete-button" onclick="deleteTodo(${i});"><img src="assets/delete-icon.png" alt="Delete" width="16" height="16">delete</button>
        <button class="js-edit-button" onclick="editTodo(${i});"><img src="assets/edit-icon.png" alt="Edit" width="16" height="16">edit</button>`;
    }
    addElement.innerHTML = todoListhtml;
}

function updateTodo(index) {
    const inputNameElement = document.querySelector('.js-name-input');
    const inputDateElement = document.querySelector('.js-date-input');
    
    // Update the todo in the list
    todoList[index].name = inputNameElement.value;
    todoList[index].date = inputDateElement.value;
    
    // Update local storage
    localStorage.setItem('todoList', JSON.stringify(todoList));
    
    // Clear the input fields
    inputNameElement.value = '';
    inputDateElement.value = '';
    
    // Change the update button back to an add button
    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = 'Add';
    addButton.onclick = addTodo;
    
    // Update the displayed list
    updateTodoList();
}
// Initialize the todo list on page load
updateTodoList();


