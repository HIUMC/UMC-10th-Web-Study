import type { Action } from "./Counter";

interface CounterChildProps {
  dispatch: React.Dispatch<Action>;
}

export default function CounterChild({ dispatch }: CounterChildProps) {
  return (
    <div>
      <h3>자식 컴포넌트에서 dispatch 사용</h3>

      <button onClick={() => dispatch({ type: "increment" })}>
        Child에서 +1
      </button>
    </div>
  );
}