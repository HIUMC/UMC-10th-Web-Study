const form = document.getElementById("todo-form") as HTMLFormElement;
const input = document.getElementById("todo-input") as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

function createButton(label: string, className: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = className;
  return btn;
}

function createTodoItem(text: string): HTMLLIElement {
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

function createDoneItem(text: string): HTMLLIElement {
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

function addTodo(text: string): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  todoList.appendChild(createTodoItem(trimmed));
  input.value = "";
}

function completeTodo(li: HTMLLIElement, text: string): void {
  li.remove();
  doneList.appendChild(createDoneItem(text));
}

function deleteTodo(li: HTMLLIElement): void {
  li.remove();
}

form.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  addTodo(input.value);
});
