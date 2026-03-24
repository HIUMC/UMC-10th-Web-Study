const input = document.querySelector<HTMLInputElement>('.todo__input')!;
const addBtn = document.querySelector<HTMLButtonElement>('.todo__add-btn')!;
const pendingList = document.querySelector<HTMLDivElement>('.todo__pending')!;
const doneList = document.querySelector<HTMLDivElement>('.todo__done')!;

input.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    addTodo(input.value.trim());
    input.value = '';
  }
});

addBtn.addEventListener('click', () => {
  addTodo(input.value.trim());
  input.value = '';
});

function addTodo(text: string): void {
  if (!text) return;

  const item = document.createElement('div');
  item.className = 'todo__item';

  const span = document.createElement('span');
  span.textContent = text;

  const completeBtn = document.createElement('button');
  completeBtn.className = 'todo__btn--complete';
  completeBtn.textContent = '완료';
  completeBtn.addEventListener('click', () => completeTodo(item, text));

  item.appendChild(span);
  item.appendChild(completeBtn);
  pendingList.appendChild(item);
}

function completeTodo(item: HTMLDivElement, text: string): void {
  item.remove();

  const doneItem = document.createElement('div');
  doneItem.className = 'todo__item';

  const span = document.createElement('span');
  span.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'todo__btn--delete';
  deleteBtn.textContent = '삭제';
  deleteBtn.addEventListener('click', () => deleteTodo(doneItem));

  doneItem.appendChild(span);
  doneItem.appendChild(deleteBtn);
  doneList.appendChild(doneItem);
}

function deleteTodo(item: HTMLDivElement): void {
  item.remove();
}