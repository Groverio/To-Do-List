let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let todoListhtml = '';
console.log(todoList);

// Default language is set to English or the saved language in localStorage
let language = localStorage.getItem('language') || 'en';
updateLanguageUI();

// Translation object via dictionary since there is not much to translate
const translations = {
    en: {
        task: 'Task',
        date: 'Date',
        time: 'Time',
        add: 'Add',
        update: 'Update',
        delete: 'Delete',
        edit: 'Edit',
        alertFill: 'Please fill in all fields: task, date, and time.',
        alertDate: 'Please enter the date in the format mm/dd/yyyy.'
    },
    es: {
        task: 'Tarea',
        date: 'Fecha',
        time: 'Hora',
        add: 'Agregar',
        update: 'Actualizar',
        delete: 'Eliminar',
        edit: 'Editar',
        alertFill: 'Por favor complete todos los campos: tarea, fecha y hora.',
        alertDate: 'Por favor ingrese la fecha en el formato mm/dd/yyyy.'
    },
    fr: {
        task: 'Tâche',
        date: 'Date',
        time: 'Heure',
        add: 'Ajouter',
        update: 'Mettre à jour',
        delete: 'Supprimer',
        edit: 'Modifier',
        alertFill: 'Veuillez remplir tous les champs : tâche, date et heure.',
        alertDate: 'Veuillez entrer la date au format mm/jj/aaaa.'
    }
};

// Function to change the language
function changeLanguage() {
    const languageSelector = document.querySelector('.js-language-selector');
    language = languageSelector.value;
    localStorage.setItem('language', language);
    updateLanguageUI();
}

// Update UI with the selected language
function updateLanguageUI() {
    document.querySelector('.js-add-button').textContent = translations[language].add;
    document.querySelector('.js-name-input-label').textContent = translations[language].task;
    document.querySelector('.js-date-input-label').textContent = translations[language].date;
    document.querySelector('.js-time-input-label').textContent = translations[language].time;
    updateTodoList();
}

// Validation with translation
function addTodo() {
    const inputNameElement = document.querySelector('.js-name-input');
    let name = inputNameElement.value;
    const inputDateElement = document.querySelector('.js-date-input');
    let date = inputDateElement.value;
    const inputTimeElement = document.querySelector('.js-time-input');
    let time = inputTimeElement.value;

    // Validation checks
    if (!name || !date || !time) {
        // alert('Please fill in all fields: task, date, and time.');
        alert(translations[language].alertFill);
        return;
    }

    //keeps the date format consistent
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!datePattern.test(date)) {
        alert(translations[language].alertDate);
        // alert('Please enter the date in the format mm/dd/yyyy.');
        return;
    }



    todoList.push({ name, date, time });
    localStorage.setItem('todoList', JSON.stringify(todoList));

    inputNameElement.value = '';
    inputDateElement.value = '';
    inputTimeElement.value = '';

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

