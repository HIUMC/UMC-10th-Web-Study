var todoInput = document.getElementById("todo-input");
var todoList = document.getElementById("todo-list");
var doneList = document.getElementById("done-list");
if (!todoInput || !todoList || !doneList) {
    throw new Error("필요한 DOM 요소를 찾을 수 없습니다.");
}
todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});
function addTodo() {
    var text = todoInput.value.trim();
    if (text === "") {
        alert("할 일을 입력해주세요.");
        return;
    }
    var todoItem = createTodoItem(text);
    todoList.appendChild(todoItem);
    todoInput.value = "";
}
function createTodoItem(text) {
    var item = document.createElement("div");
    item.classList.add("todo-item");
    var textSpan = document.createElement("span");
    textSpan.classList.add("todo-text");
    textSpan.textContent = text;
    var button = document.createElement("button");
    button.classList.add("todo-btn", "complete-btn");
    button.textContent = "완료";
    button.addEventListener("click", function () {
        if (!item.classList.contains("done")) {
            completeTodo(item, button);
        }
        else {
            deleteTodo(item);
        }
    });
    item.appendChild(textSpan);
    item.appendChild(button);
    return item;
}
function completeTodo(item, button) {
    item.classList.add("done");
    button.textContent = "삭제";
    button.classList.remove("complete-btn");
    button.classList.add("delete-btn");
    doneList.appendChild(item);
}
function deleteTodo(item) {
    item.remove();
}
