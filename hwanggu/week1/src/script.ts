interface Todo {
    id: number;
    text: string;
}

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const addButton = document.getElementById('add-button') as HTMLButtonElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

let todos: Todo[] = [];
let dones: Todo[] = [];
let nextId: number = 1;

const addTodo = (): void => {
    const text = todoInput.value.trim();
    if (text === '') return;

    const todo: Todo = { id: nextId++, text };
    todos.push(todo);
    todoInput.value = '';
    render();
};

const completeTodo = (id: number): void => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    todos = todos.filter((t) => t.id !== id);
    dones.push(todo);
    render();
};

const deleteDone = (id: number): void => {
    dones = dones.filter((d) => d.id !== id);
    render();
};

const render = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <span class="todo-item__text">${todo.text}</span>
            <button class="todo-item__button todo-item__button--complete" data-id="${todo.id}">완료</button>
        `;
        li.querySelector('button')?.addEventListener('click', () => completeTodo(todo.id));
        todoList.appendChild(li);
    });

    dones.forEach((done) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <span class="todo-item__text">${done.text}</span>
            <button class="todo-item__button todo-item__button--delete" data-id="${done.id}">삭제</button>
        `;
        li.querySelector('button')?.addEventListener('click', () => deleteDone(done.id));
        doneList.appendChild(li);
    });
};

addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
});