{
    var todos_1 = [];
    var loginForm_1 = document.getElementById("login-form");
    var loginInput_1 = loginForm_1.querySelector("input");
    var greeting_1 = document.querySelector("h1");
    var todoForm = document.getElementById("todo-form");
    var todoInput_1 = todoForm.querySelector("input");
    var todoList_1 = document.getElementById("todo-list");
    var doneList_1 = document.getElementById("done-list");
    var HIDDEN_CLASSNAME_1 = "hidden";

    loginForm_1.addEventListener("submit", function (e) {
        e.preventDefault();
        var username = loginInput_1.value;
        loginForm_1.classList.add(HIDDEN_CLASSNAME_1);
        greeting_1.innerText = "Hello, ".concat(username, "!");
        greeting_1.classList.remove(HIDDEN_CLASSNAME_1);
    });
    
    todoForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var taskValue = todoInput_1.value;
        if (taskValue !== "") {
            var newTodo = {
                id: Date.now(),
                task: taskValue,
                isCompleted: false
            };
            todos_1.push(newTodo);
            todoInput_1.value = "";
            paintTodos();
        }
    });
    function paintTodos() {
        todoList_1.innerHTML = "";
        doneList_1.innerHTML = "";
        todos_1.forEach(function (todo) {
            var li = document.createElement("li");
            var span = document.createElement("span");
            span.textContent = todo.task;
            var btn = document.createElement("button");
            btn.textContent = todo.isCompleted ? "취소" : "완료";
            btn.onclick = function () {
                todo.isCompleted = !todo.isCompleted;
                paintTodos();
            };
            var delBtn = document.createElement("button");
            delBtn.textContent = "삭제";
            delBtn.onclick = function () {
                todos_1 = todos_1.filter(function (t) { return t.id !== todo.id; });
                paintTodos();
            };
            li.appendChild(span);
            li.appendChild(btn);
            li.appendChild(delBtn);
            (todo.isCompleted ? doneList_1 : todoList_1).appendChild(li);
        });
    }
}
