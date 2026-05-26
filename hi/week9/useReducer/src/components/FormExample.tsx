import { useReducer } from "react";

interface FormState {
  name: string;
  age: number;
}

type FormAction =
  | { type: "setName"; payload: string }
  | { type: "setAge"; payload: number }
  | { type: "reset" };

const initialForm: FormState = {
  name: "",
  age: 0,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "setName":
      return { ...state, name: action.payload };
    case "setAge":
      return { ...state, age: action.payload };
    case "reset":
      return initialForm;
    default:
      return state;
  }
}

export default function FormExample() {
  const [state, dispatch] = useReducer(formReducer, initialForm);

  return (
    <div>
      <h2>Form 상태 관리 예제</h2>

      <input
        value={state.name}
        onChange={(e) =>
          dispatch({ type: "setName", payload: e.target.value })
        }
        placeholder="이름"
      />

      <input
        type="number"
        value={state.age}
        onChange={(e) =>
          dispatch({ type: "setAge", payload: Number(e.target.value) })
        }
        placeholder="나이"
      />

      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>

      <p>이름: {state.name}</p>
      <p>나이: {state.age}</p>
    </div>
  );
}