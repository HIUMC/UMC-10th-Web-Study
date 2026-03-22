{

    interface Todo {
        id: number;
        task: string;
        isCompleted: boolean;
    }

    let todos: Todo[] = [];


    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    const loginInput = loginForm.querySelector("input") as HTMLInputElement;
    const greeting = document.querySelector("h1") as HTMLHeadingElement;
    const todoForm = document.getElementById("todo-form") as HTMLFormElement;
    const todoInput = todoForm.querySelector("input") as HTMLInputElement;
    const todoList = document.getElementById("todo-list") as HTMLUListElement;
    const doneList = document.getElementById("done-list") as HTMLUListElement;

    const HIDDEN_CLASSNAME = "hidden";


    loginForm.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        const username = loginInput.value;
        loginForm.classList.add(HIDDEN_CLASSNAME);
        greeting.innerText = `Hello, ${username}!`;
        greeting.classList.remove(HIDDEN_CLASSNAME);
    });

    
    todoForm.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        const taskValue = todoInput.value;
        if (taskValue !== "") {
            const newTodo: Todo = {
                id: Date.now(),
                task: taskValue,
                isCompleted: false
            };
            todos.push(newTodo);
            todoInput.value = "";
            paintTodos();
        }
    });

    function paintTodos(): void {
        todoList.innerHTML = "";
        doneList.innerHTML = "";
        todos.forEach((todo) => {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = todo.task;
            
            const btn = document.createElement("button");
            btn.textContent = todo.isCompleted ? "취소" : "완료";
            btn.onclick = () => {
                todo.isCompleted = !todo.isCompleted;
                paintTodos();
            };

            const delBtn = document.createElement("button");
            delBtn.textContent = "삭제";
            delBtn.onclick = () => {
                todos = todos.filter(t => t.id !== todo.id);
                paintTodos();
            };

            li.appendChild(span);
            li.appendChild(btn);
            li.appendChild(delBtn);
            (todo.isCompleted ? doneList : todoList).appendChild(li);
        });
    }

}