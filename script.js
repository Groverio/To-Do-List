document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.querySelector('.js-task-list');
    const taskTemplate = document.getElementById('task-template').content;
    const addTaskForm = document.getElementById('add-task-form');
    const themeToggleButton = document.querySelector('.js-theme-toggle');
    const filters = document.querySelectorAll('.filter-btn');
    
    let tasks = [];
    let filter = 'all';

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        });

        filteredTasks.forEach(task => {
            const clone = taskTemplate.cloneNode(true);
            const taskItem = clone.querySelector('.task-item');
            const taskTitle = clone.querySelector('.task-title');
            const taskDueDate = clone.querySelector('.task-due-date');
            const taskPriority = clone.querySelector('.task-priority');
            const taskCheckbox = clone.querySelector('.js-complete-checkbox');
            const editButton = clone.querySelector('.js-edit-button');
            const deleteButton = clone.querySelector('.js-delete-button');

            taskItem.dataset.id = task.id;
            taskTitle.textContent = task.description;
            taskDueDate.textContent = `Due: ${task.dueDate} ${task.dueTime || ''}`;
            taskPriority.textContent = task.priority;
            taskItem.classList.add(`priority-${task.priority.toLowerCase()}`);

            taskCheckbox.checked = task.completed;
            if (task.completed) {
                taskItem.classList.add('completed');
            }

            taskCheckbox.addEventListener('click', () => toggleTaskCompletion(task.id));
            editButton.addEventListener('click', () => editTask(task.id));
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(clone);
        });
    }

    function toggleTaskCompletion(id) {
        const task = tasks.find(task => task.id === id);
        task.completed = !task.completed;
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }

    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        document.querySelector('.js-name-input').value = task.description;
        document.querySelector('.js-priority-input').value = task.priority;
        document.querySelector('.js-date-input').value = task.dueDate;
        document.querySelector('.js-time-input').value = task.dueTime;
        deleteTask(id);
    }

    function handleAddTask(e) {
        e.preventDefault();
        const description = document.querySelector('.js-name-input').value;
        const priority = document.querySelector('.js-priority-input').value;
        const dueDate = document.querySelector('.js-date-input').value;
        const dueTime = document.querySelector('.js-time-input').value;

        const newTask = {
            id: Date.now(),
            description,
            priority,
            dueDate,
            dueTime,
            completed: false
        };

        tasks.push(newTask);
        renderTasks();
        addTaskForm.reset();
    }

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filter = btn.dataset.filter;
            renderTasks();
        });
    });

    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    addTaskForm.addEventListener('submit', handleAddTask);
    renderTasks();
});
