interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

let todos: Todo[] = [];

const input = document.querySelector('.todo__input') as HTMLInputElement;
const addBtn = document.querySelector('.todo__add-btn') as HTMLButtonElement;
const activeList = document.querySelector('#active-list') as HTMLUListElement;
const completedList = document.querySelector('#completed-list') as HTMLUListElement;

function render(): void {
    activeList.innerHTML = "";
    completedList.innerHTML = "";

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo__item';

        // main.ts의 render 부분 아이템 생성 코드
        li.innerHTML = `
        <span>${todo.text}</span>
        <button class="${todo.completed ? 'btn-delete' : 'btn-complete'}" onclick="toggleTodo(${todo.id})">
            ${todo.completed ? '삭제' : '완료'}
        </button>
        `;

        if (todo.completed) {
            completedList.appendChild(li);
        } else {
            activeList.appendChild(li);
        }
    });
}

function addTodo(): void {
    const text = input.value.trim();
    if (text === "") return;

    todos.push({ id: Date.now(), text, completed: false });
    input.value = "";
    render();
}

addBtn.addEventListener('click', addTodo);

(window as any).toggleTodo = (id: number) => {
    const target = todos.find(t => t.id === id);
    if (target) {
        if (target.completed) {
            todos = todos.filter(t => t.id !== id); // 완료 상태에서 누르면 삭제
        } else {
            target.completed = true; // 할 일 상태에서 누르면 완료로 이동
        }
    }
    render();
};