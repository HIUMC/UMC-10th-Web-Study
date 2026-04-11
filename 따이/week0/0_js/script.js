const input = document.querySelector(".page__input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");

// localStorage에서 불러오기
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let dones = JSON.parse(localStorage.getItem("dones")) || [];

// localStorage에 저장
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("dones", JSON.stringify(dones));
}

// 페이지 로드 시 목록 복원
todos.forEach((text) => todoList.appendChild(createTodoItem(text)));
dones.forEach((text) => doneList.appendChild(createDoneItem(text)));

input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const text = input.value.trim();
  if (!text) return;

  todos.push(text);
  save();

  todoList.appendChild(createTodoItem(text));
  input.value = "";
});

function createTodoItem(text) {
  const li = document.createElement("li");
  li.className = "plan-item";

  const span = document.createElement("span");
  span.className = "plan-item__text";
  span.textContent = text;

  const btn = document.createElement("button");
  btn.className = "plan-item__btn";
  btn.textContent = "완료";

  btn.addEventListener("click", () => {
    todos = todos.filter((t) => t !== text);
    dones.push(text);
    save();

    todoList.removeChild(li);
    doneList.appendChild(createDoneItem(text));
  });

  li.appendChild(span);
  li.appendChild(btn);
  return li;
}

function createDoneItem(text) {
  const li = document.createElement("li");
  li.className = "plan-item";

  const span = document.createElement("span");
  span.className = "plan-item__text";
  span.textContent = text;

  const btn = document.createElement("button");
  btn.className = "plan-item__btn";
  btn.textContent = "삭제";

  btn.addEventListener("click", () => {
    dones = dones.filter((t) => t !== text);
    save();

    doneList.removeChild(li);
  });

  li.appendChild(span);
  li.appendChild(btn);
  return li;
}
