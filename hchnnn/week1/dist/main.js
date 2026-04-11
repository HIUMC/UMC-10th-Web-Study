"use strict";
let todos = [];
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const render = () => {
    pendingList.innerHTML = '';
    completedList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        const span = document.createElement('span');
        span.className = 'todo-item__text';
        span.textContent = todo.text;
        li.appendChild(span);
        if (!todo.isCompleted) {
            const doneBtn = document.createElement('button');
            doneBtn.className = 'todo-item__btn todo-item__btn--done';
            doneBtn.textContent = '완료';
            doneBtn.onclick = () => toggleTodo(todo.id);
            li.appendChild(doneBtn);
            pendingList.appendChild(li);
        }
        else {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'todo-item__btn todo-item__btn--delete';
            deleteBtn.textContent = '삭제';
            deleteBtn.onclick = () => deleteTodo(todo.id);
            li.appendChild(deleteBtn);
            completedList.appendChild(li);
        }
    });
};
const addTodo = (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text)
        return;
    const newTodo = {
        id: Date.now(),
        text: text,
        isCompleted: false
    };
    todos.push(newTodo);
    todoInput.value = '';
    render();
};
const toggleTodo = (id) => {
    todos = todos.map(todo => todo.id === id ? Object.assign(Object.assign({}, todo), { isCompleted: true }) : todo);
    render();
};
const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    render();
};
todoForm.addEventListener('submit', addTodo);
