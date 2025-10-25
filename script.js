// Login System
const loginPage = document.getElementById('login-page');
const todoPage = document.getElementById('todo-page');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginError = document.getElementById('login-error');
const welcomeUser = document.getElementById('welcomeUser');

loginBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username && password) {
    localStorage.setItem('loggedInUser', username);
    showTodoPage(username);
  } else {
    loginError.textContent = "Please enter both username and password!";
  }
});

function showTodoPage(user) {
  loginPage.classList.add('hidden');
  todoPage.classList.remove('hidden');
  welcomeUser.textContent = `Hello, ${user}! 👋`;
  loadTasks();
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  todoPage.classList.add('hidden');
  loginPage.classList.remove('hidden');
});

// Stay logged in if already authenticated
window.addEventListener('load', () => {
  const savedUser = localStorage.getItem('loggedInUser');
  if (savedUser) showTodoPage(savedUser);
});

// To-Do Functionality
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter');

addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskClick);
filterButtons.forEach(btn => btn.addEventListener('click', filterTasks));

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const tasks = getTasks();
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskInput.value = "";
  renderTasks(tasks);
}

function handleTaskClick(e) {
  const index = e.target.parentElement.dataset.index;
  const tasks = getTasks();

  if (e.target.classList.contains('delete-btn')) {
    tasks.splice(index, 1);
  } else {
    tasks[index].completed = !tasks[index].completed;
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);
}

function filterTasks(e) {
  const filter = e.target.dataset.filter;
  const tasks = getTasks();

  if (filter === "completed") {
    renderTasks(tasks.filter(t => t.completed));
  } else if (filter === "pending") {
    renderTasks(tasks.filter(t => !t.completed));
  } else {
    renderTasks(tasks);
  }
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
  renderTasks(getTasks());
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    li.dataset.index = index;
    li.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-btn">X</button>
    `;
    taskList.appendChild(li);
  });
}
