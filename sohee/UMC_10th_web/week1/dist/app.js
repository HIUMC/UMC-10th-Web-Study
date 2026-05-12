"use strict";
const input = document.getElementById("input");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");
let todos = [];
let completed = [];
addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text)
        return;
    const newTodo = {
        id: Date.now(),
        text,
    };
    todos.push(newTodo);
    input.value = "";
    render();
});
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
        addBtn.click();
    }
});
function completeTodo(id) {
    const target = todos.find(t => t.id === id);
    if (!target)
        return;
    todos = todos.filter(t => t.id !== id);
    completed.push(target);
    render();
}
function deleteTodo(id) {
    completed = completed.filter(t => t.id !== id);
    render();
}
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addBtn.click();
    }
});
function render() {
    todoList.innerHTML = "";
    doneList.innerHTML = "";
    todos.forEach(todo => {
        const div = document.createElement("div");
        div.className = "todo__item";
        div.innerHTML = `
      <span>${todo.text}</span>
      <button class="todo__complete-btn">완료</button>
    `;
        div.querySelector("button").addEventListener("click", () => {
            completeTodo(todo.id);
        });
        todoList.appendChild(div);
    });
    completed.forEach(todo => {
        const div = document.createElement("div");
        div.className = "todo__item";
        div.innerHTML = `
      <span>${todo.text}</span>
      <button class="todo__delete-btn">삭제</button>
    `;
        div.querySelector("button").addEventListener("click", () => {
            deleteTodo(todo.id);
        });
        doneList.appendChild(div);
    });
}
