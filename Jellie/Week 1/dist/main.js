"use strict";
const inputElement = document.getElementById("todoInput");
const addButtonElement = document.getElementById("addButton");
const todoListElement = document.getElementById("todoList");
const doneListElement = document.getElementById("doneList");
if (!(inputElement instanceof HTMLInputElement) ||
    !(addButtonElement instanceof HTMLButtonElement) ||
    !(todoListElement instanceof HTMLUListElement) ||
    !(doneListElement instanceof HTMLUListElement)) {
    throw new Error("필수 요소를 찾을 수 없습니다.");
}
const input = inputElement;
const addButton = addButtonElement;
const todoList = todoListElement;
const doneList = doneListElement;
function isDuplicate(text) {
    const texts = [
        ...todoList.querySelectorAll(".todo-item__text"),
        ...doneList.querySelectorAll(".todo-item__text"),
    ];
    return texts.some((item) => item.textContent === text);
}
function deleteItem(item) {
    item.remove();
}
function completeItem(item) {
    item.classList.add("todo-item--done");
    const actionBox = item.querySelector(".todo-item__actions");
    const completeButton = item.querySelector(".todo-item__button--complete");
    if (!(actionBox instanceof HTMLDivElement)) {
        return;
    }
    if (completeButton instanceof HTMLButtonElement) {
        completeButton.remove();
    }
    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-item__button todo-item__button--delete";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", function () {
        deleteItem(item);
    });
    actionBox.appendChild(deleteButton);
    doneList.appendChild(item);
}
function createTodoItem(text) {
    const item = document.createElement("li");
    item.className = "todo-item";
    const itemText = document.createElement("span");
    itemText.className = "todo-item__text";
    itemText.textContent = text;
    const actions = document.createElement("div");
    actions.className = "todo-item__actions";
    const completeButton = document.createElement("button");
    completeButton.className = "todo-item__button todo-item__button--complete";
    completeButton.textContent = "완료";
    completeButton.addEventListener("click", function () {
        completeItem(item);
    });
    actions.appendChild(completeButton);
    item.appendChild(itemText);
    item.appendChild(actions);
    return item;
}
function addTodo() {
    const value = input.value.trim();
    if (value === "") {
        return;
    }
    if (isDuplicate(value)) {
        alert("이미 추가된 할 일입니다.");
        input.value = "";
        input.focus();
        return;
    }
    const item = createTodoItem(value);
    todoList.appendChild(item);
    input.value = "";
    input.focus();
}
addButton.addEventListener("click", function () {
    addTodo();
});
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});
