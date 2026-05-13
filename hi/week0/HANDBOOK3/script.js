const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");
const todoEmpty = document.getElementById("todoEmpty");
const doneEmpty = document.getElementById("doneEmpty");

function updateEmptyMessage() {
  todoEmpty.style.display = todoList.children.length === 0 ? "block" : "none";
  doneEmpty.style.display = doneList.children.length === 0 ? "block" : "none";
}

function createButton(text) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = "action-btn";
  return button;
}

function createTodoItem(text) {
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

function createDoneItem(text) {
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

function addTodo() {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("할 일을 입력해주세요!");
    return;
  }

  const item = createTodoItem(text);
  todoList.appendChild(item);

  todoInput.value = "";
  updateEmptyMessage();
}

function completeTodo(item, text) {
  item.remove();
  const doneItem = createDoneItem(text);
  doneList.appendChild(doneItem);
  updateEmptyMessage();
}

function deleteTodo(item) {
  item.remove();
  updateEmptyMessage();
}

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

updateEmptyMessage();