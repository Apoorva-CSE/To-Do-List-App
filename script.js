/* =========================================================
   TO-DO LIST WEB APP — JAVASCRIPT
   Vanilla JS only. Handles adding, deleting, and completing
   tasks, plus dynamic UI updates.
   ========================================================= */

// ---------- Grab DOM elements ----------
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const yearSpan = document.getElementById('year');

// ---------- In-memory task storage ----------
// Each task is an object: { id, text, completed }
let tasks = [];

// Set current year in the footer automatically
yearSpan.textContent = new Date().getFullYear();

/**
 * Renders the entire task list to the DOM based on the
 * current `tasks` array. Called after every change so the
 * UI always stays in sync (instant updates, no refresh).
 */
function renderTasks() {
  // Clear the existing list before re-rendering
  taskList.innerHTML = '';

  // Show/hide the "No tasks available" message
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  // Create a list item for each task
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    // Circular checkbox that toggles completion
    const checkbox = document.createElement('button');
    checkbox.className = 'task-checkbox' + (task.completed ? ' checked' : '');
    checkbox.type = 'button';
    checkbox.setAttribute('aria-label', 'Toggle task completed');
    checkbox.textContent = task.completed ? '✓' : '';
    checkbox.addEventListener('click', () => toggleComplete(task.id));

    // Task text (clicking it also toggles completion)
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    span.addEventListener('click', () => toggleComplete(task.id));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Assemble the list item
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateStats();
}

/**
 * Updates the small stats line showing total tasks
 * and how many are completed.
 */
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;

  totalCount.textContent = `${total} task${total !== 1 ? 's' : ''}`;
  completedCount.textContent = `${done} completed`;
}

/**
 * Adds a new task using the current input value.
 * Validates that the input isn't empty/whitespace-only.
 */
function addTask() {
  const value = taskInput.value.trim();

  // Input validation: prevent empty tasks
  if (value === '') {
    alert('Please enter a task before adding!');
    taskInput.focus();
    return;
  }

  // Create a new task object with a unique id
  const newTask = {
    id: Date.now().toString(),
    text: value,
    completed: false,
  };

  tasks.push(newTask);

  // Reset input field and refresh the UI
  taskInput.value = '';
  taskInput.focus();
  renderTasks();
}

/**
 * Toggles the completed state of a task by id.
 */
function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

/**
 * Removes a task from the list by id.
 */
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}

// ---------- Event Listeners ----------

// Add task on button click
addTaskBtn.addEventListener('click', addTask);

// Add task on pressing Enter inside the input field
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTask();
  }
});

// ---------- Initial render ----------
renderTasks();
