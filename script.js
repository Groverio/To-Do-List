let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let todoListhtml = '';
console.log(todoList);

// Default language is set to English or the saved language in localStorage
let language = localStorage.getItem('language') || 'en';
updateLanguageUI();


// Default date and time format
let dateFormat = localStorage.getItem('dateFormat') || 'mm/dd/yyyy'; // Can be 'mm/dd/yyyy' or 'dd/mm/yyyy'
let timeFormat = localStorage.getItem('timeFormat') || '12-hour'; // Can be '12-hour' or '24-hour'
updateFormatUI();

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

// Function to change the date format
function changeDateFormat() {
    const dateFormatSelector = document.querySelector('.js-date-format-selector');
    dateFormat = dateFormatSelector.value;
    localStorage.setItem('dateFormat', dateFormat);
}

// Function to change the time format
function changeTimeFormat() {
    const timeFormatSelector = document.querySelector('.js-time-format-selector');
    timeFormat = timeFormatSelector.value;
    localStorage.setItem('timeFormat', timeFormat);
}

// Update UI with the selected language
function updateLanguageUI() {
    document.querySelector('.js-add-button').textContent = translations[language].add;
    document.querySelector('.js-name-input-label').textContent = translations[language].task;
    document.querySelector('.js-date-input-label').textContent = translations[language].date;
    document.querySelector('.js-time-input-label').textContent = translations[language].time;
    updateTodoList();
}

// Format date according to the selected format
function formatDate(date) {
    const [year, month, day] = date.split('-'); // Assuming input date is in 'yyyy-mm-dd' format
    if (dateFormat === 'mm/dd/yyyy') {
        return `${month}/${day}/${year}`;
    } else {
        return `${day}/${month}/${year}`;
    }
}

// Format time according to the selected format
function formatTime(time) {
    let [hour, minute] = time.split(':');
    if (timeFormat === '12-hour') {
        const suffix = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${suffix}`;
    } else {
        return `${hour}:${minute}`; // 24-hour format
    }
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

    // Format date and time before saving
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);



    todoList.push({ name, date, time });
    localStorage.setItem('todoList', JSON.stringify(todoList));

    // Set the reminder for the task
    setReminder(name, date, time);

    inputNameElement.value = '';
    inputDateElement.value = '';
    inputTimeElement.value = '';

    // Update the displayed list
    updateTodoList();
}

// adds reminder feature
function setReminder(task, date, time) {
    const formattedDate = formatDate(date); // Ensure it's formatted before use
    const formattedTime = formatTime(time); // Ensure it's formatted before use

    const taskDateTime = new Date(`${date} ${time}`);
    const now = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = taskDateTime - now;

    // If the task's time is in the future, set a reminder
    if (timeDifference > 0) {
        setTimeout(() => {
            alert(`Reminder: ${task} is scheduled for ${date} at ${time}.`);
        }, timeDifference);
    }
}

// Reminder feature with formatted time
function setReminderFormatted(task, date, time) {
    const taskDateTime = new Date(`${date} ${time}`);
    const now = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = taskDateTime - now;

    // If the task's time is in the future, set a reminder
    if (timeDifference > 0) {
        setTimeout(() => {
            alert(`Reminder: ${task} is scheduled for ${date} at ${time}.`);
        }, timeDifference);
    }
}

function deleteTodo(index) {
    // Remove the specific todo from the list
    todoList.splice(index, 1);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    updateTodoList();
}

// Format numbers based on the selected language
function formatNumber(num) {
    return new Intl.NumberFormat(language).format(num);
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
        <div class="small-container">${formatNumber(todoList[i].date)} ${formatNumber(todoList[i].time)}</div>
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

