const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const doneList = document.getElementById('doneList');


todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && todoInput.value.trim() !== '') {
        addTodo(todoInput.value);
        todoInput.value = ''; 
    }
});


function addTodo(text) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${text}</span>
        <button class="complete-btn">완료</button>
    `;
    
    
    li.querySelector('.complete-btn').addEventListener('click', () => {
        completeTodo(li, text);
    });

    todoList.appendChild(li);
}


function completeTodo(li, text) {
    li.remove(); 
    
    const doneLi = document.createElement('li');
    doneLi.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn">삭제</button>
    `;
    
    
    doneLi.querySelector('.delete-btn').addEventListener('click', () => {
        doneLi.remove();
    });

    doneList.appendChild(doneLi);
}