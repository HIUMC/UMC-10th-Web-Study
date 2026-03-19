"use strict";
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");
function createButton(label, className) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = className;
  return btn;
}
function createTodoItem(text) {
  const li = document.createElement("li");
  li.classList.add("todo-item");
  const span = document.createElement("span");
  span.classList.add("todo-item__text");
  span.textContent = text;
  const completeBtn = createButton("완료", "todo-item__btn btn btn--complete");
  completeBtn.addEventListener("click", () => completeTodo(li, text));
  li.append(span, completeBtn);
  return li;
}
function createDoneItem(text) {
  const li = document.createElement("li");
  li.classList.add("todo-item", "todo-item--done");
  const span = document.createElement("span");
  span.classList.add("todo-item__text");
  span.textContent = text;
  const deleteBtn = createButton("삭제", "todo-item__btn btn btn--delete");
  deleteBtn.addEventListener("click", () => deleteTodo(li));
  li.append(span, deleteBtn);
  return li;
}
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todoList.appendChild(createTodoItem(trimmed));
  input.value = "";
}
function completeTodo(li, text) {
  li.remove();
  doneList.appendChild(createDoneItem(text));
}
function deleteTodo(li) {
  li.remove();
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(input.value);
});
