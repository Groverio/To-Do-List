// Load todo list from localStorage or initialize an empty array
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

// Display the remaining characters count out of 120
document.querySelector('.js-name-input').addEventListener('input', (e) => {
  let input = e.target.value;
  if (input.length > 120) {
    e.target.value = input.slice(0, 120);
    showToast('Maximum character limit (120) reached.', 'warning');
  }
});

function addTodo() {
  try {
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
      throw new Error(
        'Please fill in all fields: task, date, time, category, and priority.'
      );
    }

    if (isEditing && editIndex !== null) {
      // Update the existing todo
      if (editIndex < 0 || editIndex >= todoList.length) {
        throw new Error('Invalid edit index.');
      }
      todoList[editIndex] = {
        name,
        date,
        time,
        category,
        priority,
        completed: todoList[editIndex].completed,
      };
      isEditing = false;
      editIndex = null;
      document.querySelector('.js-add-button').innerHTML = 'Add';
      showToast('Todo updated successfully', 'success');
    } else {
      // Add a new todo
      todoList.push({ name, date, time, category, priority, completed: false });
      showToast('Todo added successfully', 'success');
    }

    // Save to localStorage
    localStorage.setItem('todoList', JSON.stringify(todoList));

    // Clear the inputs
    inputNameElement.value = '';
    inputDateElement.value = '';
    inputTimeElement.value = '';
    inputCategoryElement.value = '';
    inputPriorityElement.value = '';
    setDefaultDateTime();

    // Update the displayed list
    updateTodoList();
  } catch (error) {
    showToast(`Error updating To-Do list`, 'error');
    console.error('Error in addTodo:', error);
  }
}

function deleteTodo(index) {
  try {
    if (index < 0 || index >= todoList.length) {
      throw new Error('Invalid delete index.');
    }
    todoList.splice(index, 1);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    updateTodoList();
    showToast('Todo deleted successfully', 'success');
  } catch (error) {
    showToast(`Error deleting todo list`, 'error');
    console.error('Error in deleteTodo:', error);
  }
}

function editTodo(index) {
  try {
    if (index < 0 || index >= todoList.length) {
      throw new Error('Invalid edit index.');
    }
    let inputNameElement = document.querySelector('.js-name-input');
    let inputDateElement = document.querySelector('.js-date-input');
    let inputTimeElement = document.querySelector('.js-time-input');
    let inputCategoryElement = document.querySelector('.js-category-input');
    let inputPriorityElement = document.querySelector('.js-priority-input');

    inputNameElement.value = todoList[index].name;
    inputDateElement.value = todoList[index].date;
    inputTimeElement.value = todoList[index].time;
    inputCategoryElement.value = todoList[index].category;
    inputPriorityElement.value = todoList[index].priority;

    isEditing = true;
    editIndex = index;

    document.querySelector('.js-add-button').innerHTML = 'Update';
    showToast('Editing todo', 'info');
  } catch (error) {
    showToast(`Error editing todo list`, 'error');
    console.error('Error in editTodo:', error);
  }
}

function updateTodoList() {
  try {
    let filteredTodos = todoList;

    if (filterMethod === 'pending') {
      filteredTodos = todoList.filter((todo) => !todo.completed);
    } else if (filterMethod === 'completed') {
      filteredTodos = todoList.filter((todo) => todo.completed);
    }

    filteredTodos.sort((a, b) => {
      if (currentSortMethod === 'date') {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
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

    const addElement = document.querySelector('.js-add-html');
    if (!addElement) {
      throw new Error('Add element not found.');
    }

    todoListhtml = '';

    filteredTodos.forEach((todo) => {
      const todoIndex = todoList.indexOf(todo);
      todoListhtml += `
                <div class="small-container ${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" class="js-complete-checkbox" data-index="${todoIndex}" ${todo.completed ? 'checked' : ''}>
                    <div class="task-info">
                        <span class="task-name">${escapeHtml(todo.name)}</span>
                        <span class="category-tag">${escapeHtml(todo.category)}</span>
                        <span class="priority-tag priority-${todo.priority}">${escapeHtml(todo.priority)}</span>
                    </div>
                </div>
                <div class="small-container">${escapeHtml(todo.date)}</div>
                <div class="small-container">${escapeHtml(todo.time)}</div>
                <button class="js-delete-button" data-index="${todoIndex}">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button class="js-edit-button" data-index="${todoIndex}">
                    <i class="fa-solid fa-pen"></i>
                </button>`;
    });

    addElement.style.display = todoList.length === 0 ? 'none' : 'grid';
    addElement.innerHTML = todoListhtml;

    // Add event listeners for delete, edit, and complete buttons
    document.querySelectorAll('.js-delete-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        const index = parseInt(
          event.currentTarget.getAttribute('data-index'),
          10
        );
        if (!isNaN(index)) {
          deleteTodo(index);
        }
      });
    });

    document.querySelectorAll('.js-edit-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        const index = parseInt(
          event.currentTarget.getAttribute('data-index'),
          10
        );
        if (!isNaN(index)) {
          editTodo(index);
        }
      });
    });

    document.querySelectorAll('.js-complete-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', (event) => {
        const index = parseInt(event.target.getAttribute('data-index'), 10);
        if (!isNaN(index)) {
          toggleComplete(index);
        }
      });
    });
  } catch (error) {
    console.error('Error in updateTodoList:', error);
    alert(`Error updating todo list: ${error.message}`);
  }
}

function setDefaultDateTime() {
  try {
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');

    if (!inputDateElement || !inputTimeElement) {
      throw new Error('Date or time input element not found.');
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);

    inputDateElement.value = date;
    inputDateElement.min = date;
    inputTimeElement.value = time;
  } catch (error) {
    console.error('Error in setDefaultDateTime:', error);
    alert(`Error setting default date and time: ${error.message}`);
  }
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
  try {
    const filterElement = document.querySelector('.js-filter-input');
    if (!filterElement) {
      throw new Error('Filter element not found.');
    }
    filterMethod = filterElement.value;
    updateTodoList();
  } catch (error) {
    console.error('Error in filterTodos:', error);
    alert(`Error filtering todos: ${error.message}`);
  }
}

function toggleComplete(index) {
  try {
    if (index < 0 || index >= todoList.length) {
      throw new Error('Invalid todo index.');
    }
    todoList[index].completed = !todoList[index].completed;
    localStorage.setItem('todoList', JSON.stringify(todoList));
    updateTodoList();
  } catch (error) {
    console.error('Error in toggleComplete:', error);
    alert(`Error toggling todo completion: ${error.message}`);
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.id = 'toast';
    toastElement.className = 'toast';
    toastElement.style.display = 'none';
    document.body.appendChild(toastElement);

    updateTodoList();
    setDefaultDateTime();

    const inputNameElement = document.querySelector('.js-name-input');
    if (!inputNameElement) {
      throw new Error('Name input element not found.');
    }
    inputNameElement.focus();

    const addButton = document.querySelector('.js-add-button');
    if (!addButton) {
      throw new Error('Add button not found.');
    }
    addButton.addEventListener('click', addTodo);

    const sortCategoryButton = document.querySelector('.sort-button-category');
    const sortPriorityButton = document.querySelector('.sort-button-priority');
    sortCategoryButton.addEventListener('click', () => sortTodos('category'));
    sortPriorityButton.addEventListener('click', () => sortTodos('priority'));

    const filterInput = document.querySelector('.js-filter-input');
    if (!filterInput) {
      throw new Error('Filter input not found.');
    }
    filterInput.addEventListener('change', filterTodos);
  } catch (error) {
    console.error('Error in DOMContentLoaded event:', error);
  }
});
