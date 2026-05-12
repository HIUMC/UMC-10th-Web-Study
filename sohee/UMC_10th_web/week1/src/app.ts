interface Todo {
  id: number;
  text: string;
}

const input = document.getElementById("input") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const todoList = document.getElementById("todoList") as HTMLDivElement;
const doneList = document.getElementById("doneList") as HTMLDivElement;

let todos: Todo[] = [];
let completed: Todo[] = [];

// 할 일 추가
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  const newTodo: Todo = {
    id: Date.now(),
    text,
  };

  todos.push(newTodo);
  input.value = "";
  render();
});
input.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter" && input.value.trim()) {
    addBtn.click();
  }
});
// 완료 처리
function completeTodo(id: number) {
  const target = todos.find(t => t.id === id);
  if (!target) return;

  todos = todos.filter(t => t.id !== id);
  completed.push(target);

  render();
}

// 삭제
function deleteTodo(id: number) {
  completed = completed.filter(t => t.id !== id);
  render();
}
// 엔터키로 추가
input.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    addBtn.click(); // 기존 버튼 로직 그대로 재사용
  }
});

// 화면 렌더링
function render() {
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  // 할 일 목록
  todos.forEach(todo => {
    const div = document.createElement("div");
    div.className = "todo__item";

    div.innerHTML = `
      <span>${todo.text}</span>
      <button class="todo__complete-btn">완료</button>
    `;

    div.querySelector("button")!.addEventListener("click", () => {
      completeTodo(todo.id);
    });

    todoList.appendChild(div);
  });

  // 완료 목록
  completed.forEach(todo => {
    const div = document.createElement("div");
    div.className = "todo__item";

    div.innerHTML = `
      <span>${todo.text}</span>
      <button class="todo__delete-btn">삭제</button>
    `;

    div.querySelector("button")!.addEventListener("click", () => {
      deleteTodo(todo.id);
    });

    doneList.appendChild(div);
  });
}