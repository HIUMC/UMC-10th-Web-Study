const todoInput = document.getElementById("todo-input") as HTMLInputElement | null;
const todoList = document.getElementById("todo-list") as HTMLDivElement | null;
const doneList = document.getElementById("done-list") as HTMLDivElement | null;

if (!todoInput || !todoList || !doneList) {
  throw new Error("필요한 DOM 요소를 찾을 수 없습니다.");
}

todoInput.addEventListener("keydown", function (event: KeyboardEvent): void {
  if (event.key === "Enter") {
    addTodo();
  }
});

function addTodo(): void {
  const text: string = todoInput.value.trim();

  if (text === "") {
    alert("할 일을 입력해주세요.");
    return;
  }

  const todoItem: HTMLDivElement = createTodoItem(text);
  todoList.appendChild(todoItem);
  todoInput.value = "";
}

function createTodoItem(text: string): HTMLDivElement {
  const item: HTMLDivElement = document.createElement("div");
  item.classList.add("todo-item");

  const textSpan: HTMLSpanElement = document.createElement("span");
  textSpan.classList.add("todo-text");
  textSpan.textContent = text;

  const button: HTMLButtonElement = document.createElement("button");
  button.classList.add("todo-btn", "complete-btn");
  button.textContent = "완료";

  button.addEventListener("click", function (): void {
    if (!item.classList.contains("done")) {
      completeTodo(item, button);
    } else {
      deleteTodo(item);
    }
  });

  item.appendChild(textSpan);
  item.appendChild(button);

  return item;
}

function completeTodo(item: HTMLDivElement, button: HTMLButtonElement): void {
  item.classList.add("done");
  button.textContent = "삭제";
  button.classList.remove("complete-btn");
  button.classList.add("delete-btn");
  doneList.appendChild(item);
}

function deleteTodo(item: HTMLDivElement): void {
  item.remove();
}