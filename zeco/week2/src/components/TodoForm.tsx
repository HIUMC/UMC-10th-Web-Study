type TodoFormProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  addTodo: () => void;
};

function TodoForm({ input, setInput, addTodo }: TodoFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-container__input"
        placeholder="할 일 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        required
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
}

export default TodoForm;
