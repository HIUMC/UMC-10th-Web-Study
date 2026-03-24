"use strict";
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');

// localStorage에서 초기 데이터 불러오기
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let dones = JSON.parse(localStorage.getItem('dones')) || [];
let nextId = parseInt(localStorage.getItem('nextId')) || 1;

const addTodo = () => {
    const text = todoInput.value.trim();
    if (text === '') return;
    const todo = { id: nextId++, text };
    todos.push(todo);
    todoInput.value = '';
    render();
};

const completeTodo = (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    todos = todos.filter((t) => t.id !== id);
    dones.push(todo);
    render();
};

const deleteDone = (id) => {
    dones = dones.filter((d) => d.id !== id);
    render();
};

const render = () => {
    // 렌더링할 때마다 localStorage에 저장
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('dones', JSON.stringify(dones));
    localStorage.setItem('nextId', nextId);

    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <span class="todo-item__text">${todo.text}</span>
            <button class="todo-item__button todo-item__button--complete" data-id="${todo.id}">완료</button>
        `;
        li.querySelector('button')?.addEventListener('click', () => completeTodo(todo.id));
        todoList.appendChild(li);
    });

    dones.forEach((done) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <span class="todo-item__text">${done.text}</span>
            <button class="todo-item__button todo-item__button--delete" data-id="${done.id}">삭제</button>
        `;
        li.querySelector('button')?.addEventListener('click', () => deleteDone(done.id));
        doneList.appendChild(li);
    });
};

addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});

// 페이지 첫 로드 시 저장된 데이터 화면에 표시
render();