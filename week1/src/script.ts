const todoInput = document.getElementById("todoInput") as HTMLInputElement;
const todoList = document.getElementById("todoList") as HTMLUListElement;
const doneList = document.getElementById("doneList") as HTMLUListElement;

function createButton(text: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = "action-btn";
  return button;
}

function createTodoItem(text: string): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "todo-item";

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = text;

  const completeBtn = createButton("완료");
  completeBtn.addEventListener("click", () => {
    completeTodo(li, text);
  });

  li.appendChild(span);
  li.appendChild(completeBtn);

  return li;
}

function createDoneItem(text: string): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "todo-item";

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = text;

  const deleteBtn = createButton("삭제");
  deleteBtn.addEventListener("click", () => {
    deleteTodo(li);
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

function addTodo(): void {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("할 일을 입력해주세요!");
    return;
  }

  const item = createTodoItem(text);
  todoList.appendChild(item);
  todoInput.value = "";
}

function completeTodo(item: HTMLLIElement, text: string): void {
  item.remove();
  const doneItem = createDoneItem(text);
  doneList.appendChild(doneItem);
}

function deleteTodo(item: HTMLLIElement): void {
  item.remove();
}

todoInput.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    addTodo();
  }
});