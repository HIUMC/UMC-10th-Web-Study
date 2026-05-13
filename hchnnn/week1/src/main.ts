// 1. ToDo 아이템 인터페이스 정의
interface Todo {
    id: number;
    text: string;
    isCompleted: boolean;
}

// 2. 상태 관리 배열
let todos: Todo[] = [];

// 3. DOM 요소 선택 (타입 단언)
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const pendingList = document.getElementById('pending-list') as HTMLUListElement;
const completedList = document.getElementById('completed-list') as HTMLUListElement;

// 4. 화면 렌더링 함수
const render = (): void => {
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const span = document.createElement('span');
        span.className = 'todo-item__text';
        span.textContent = todo.text;
        li.appendChild(span);

        if (!todo.isCompleted) {
            // 완료 버튼 (초록색)
            const doneBtn = document.createElement('button');
            doneBtn.className = 'todo-item__btn todo-item__btn--done';
            doneBtn.textContent = '완료';
            doneBtn.onclick = () => toggleTodo(todo.id);
            li.appendChild(doneBtn);
            pendingList.appendChild(li);
        } else {
            // 삭제 버튼 (빨간색)
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'todo-item__btn todo-item__btn--delete';
            deleteBtn.textContent = '삭제';
            deleteBtn.onclick = () => deleteTodo(todo.id);
            li.appendChild(deleteBtn);
            completedList.appendChild(li);
        }
    });
};

// 5. 할 일 추가 함수
const addTodo = (e: Event): void => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    const newTodo: Todo = {
        id: Date.now(),
        text: text,
        isCompleted: false
    };

    todos.push(newTodo);
    todoInput.value = '';
    render();
};

// 6. 상태 변경 (완료로 이동)
const toggleTodo = (id: number): void => {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    render();
};

// 7. 삭제 함수
const deleteTodo = (id: number): void => {
    todos = todos.filter(todo => todo.id !== id);
    render();
};

// 이벤트 리스너 등록
todoForm.addEventListener('submit', addTodo);