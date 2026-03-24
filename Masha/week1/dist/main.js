"use strict";
let todos = [];
const input = document.querySelector('.todo__input');
const addBtn = document.querySelector('.todo__add-btn');
const activeList = document.querySelector('#active-list');
const completedList = document.querySelector('#completed-list');
function render() {
    activeList.innerHTML = "";
    completedList.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo__item';
        // 중요: 텍스트와 버튼을 각각 span과 button으로 분리해서 넣기
        li.innerHTML = `
            <span>${todo.text}</span>
            <button onclick="toggleTodo(${todo.id})">${todo.completed ? '취소' : '완료'}</button>
        `;
        if (todo.completed) {
            completedList.appendChild(li);
        }
        else {
            activeList.appendChild(li);
        }
    });
}
function addTodo() {
    const text = input.value.trim();
    if (text === "")
        return;
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    todos.push(newTodo);
    input.value = "";
    render();
}
addBtn.addEventListener('click', addTodo);
// 전역 함수로 등록 (버튼 클릭 작동용)
window.toggleTodo = (id) => {
    todos = todos.map(todo => todo.id === id ? Object.assign(Object.assign({}, todo), { completed: !todo.completed }) : todo);
    render();
};
