const todoInput = document.querySelector('#todo-input');
const todoList  = document.querySelector('#todo-list');
const doneList  = document.querySelector('#done-list');

function saveToStorage() {
  const todos = [...todoList.querySelectorAll('.todo-text')].map(s => s.textContent);
  const dones = [...doneList.querySelectorAll('.todo-text')].map(s => s.textContent);
  localStorage.setItem('todos', JSON.stringify(todos));
  localStorage.setItem('dones', JSON.stringify(dones));
}

function loadFromStorage() {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  const dones = JSON.parse(localStorage.getItem('dones') || '[]');
  todos.forEach(text => todoList.appendChild(createTodoItem(text, false)));
  dones.forEach(text => doneList.appendChild(createTodoItem(text, true)));
}

function createTodoItem(text, isDone = false) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (isDone ? ' done' : '');

  const span = document.createElement('span');
  span.className   = 'todo-text';
  span.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className   = 'btn btn-delete';
  deleteBtn.textContent = '삭제';
  deleteBtn.addEventListener('click', () => { li.remove(); saveToStorage(); });

  if (!isDone) {
    const completeBtn = document.createElement('button');
    completeBtn.className   = 'btn btn-complete';
    completeBtn.textContent = '완료';
    completeBtn.addEventListener('click', () => {
      li.remove();
      doneList.appendChild(createTodoItem(text, true));
      saveToStorage();
    });
    li.append(span, completeBtn);
  } else {
    li.append(span, deleteBtn);
  }

  return li;
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todoList.appendChild(createTodoItem(trimmed));
  todoInput.value = '';
  saveToStorage();
}

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo(todoInput.value);
});

loadFromStorage();