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

  // Update the displayed list with animation
  updateTodoList(true); // Pass true to animate on addition
}

function deleteTodo(index) {
  // Create a reference to the element to animate
  const itemToDelete = document.querySelector(`.todo-item[data-index="${index}"]`);

  // Animate the item before removing it
  gsap.to(itemToDelete, {
    opacity: 0,
    scale: 0.5,
    duration: 0.3,
    onComplete: () => {
      // Remove the specific todo from the list
      todoList.splice(index, 1);
      localStorage.setItem('todoList', JSON.stringify(todoList));
      updateTodoList();
    },
  });
}

function updateTodoList(animate = false) {
  // Sort todoList by date and time before rendering
  todoList.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time);
    const dateB = new Date(b.date + ' ' + b.time);
    return dateA - dateB; // Sort by ascending date and time
  });

  const addElement = document.querySelector('.js-add-html');
  todoListhtml = '';

  for (let i = 0; i < todoList.length; i++) {
    todoListhtml += `
    
                    <div class="todo-item small-container" data-index="${i}">${todoList[i].name}</div>
                     <div class="small-container">${todoList[i].date} ${todoList[i].time}</div>
                     <button class="js-delete-button" onclick="deleteTodo(${i});">
                        <img src="assets/delete-icon.png" alt="Delete" width="16" height="16">delete
                     </button>
                     <button class="js-edit-button" onclick="editTodo(${i});">
                        <img src="assets/edit-icon.png" alt="Edit" width="16" height="16">edit
                     </button>`;
  }
  
  addElement.innerHTML = todoListhtml;

  if (animate) {
    // Animate the newly added items
    const newItems = document.querySelectorAll('.todo-item');
    newItems.forEach(item => {
      gsap.from(item, {
        opacity: 0,
        scale: 0.5,
        duration: 0.3,
      });
    });
  }
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
  inputDateElement.value = '';
  inputTimeElement.value = '';

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
