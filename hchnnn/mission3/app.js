const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const doneList = document.getElementById('doneList');

// 1. 할 일 추가 (Enter 키 이벤트)
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && todoInput.value.trim() !== '') {
        addTodo(todoInput.value);
        todoInput.value = ''; // 입력창 초기화
    }
});

// 2. 할 일 생성 함수
function addTodo(text) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${text}</span>
        <button class="complete-btn">완료</button>
    `;
    
    // 완료 버튼 클릭 이벤트
    li.querySelector('.complete-btn').addEventListener('click', () => {
        completeTodo(li, text);
    });

    todoList.appendChild(li);
}

// 3. 완료 처리 함수 (해낸 일로 이동)
function completeTodo(li, text) {
    li.remove(); // 기존 목록에서 제거
    
    const doneLi = document.createElement('li');
    doneLi.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn">삭제</button>
    `;
    
    // 삭제 버튼 클릭 이벤트
    doneLi.querySelector('.delete-btn').addEventListener('click', () => {
        doneLi.remove();
    });

    doneList.appendChild(doneLi);
}