import { useState, useReducer } from "react";
import "./App.css";

// ════════════════════════════════════════
// 카운터 예제
// ════════════════════════════════════════

interface ICounterState {
  counter: number;
}

type CounterAction =
  | { type: "INCREASE" }
  | { type: "DECREASE" }
  | { type: "RESET" };

const counterInitial: ICounterState = { counter: 0 };

function counterReducer(state: ICounterState, action: CounterAction): ICounterState {
  console.log(action);
  console.log(state);
  switch (action.type) {
    case "INCREASE":
      return { counter: state.counter + 1 };
    case "DECREASE":
      return { counter: state.counter - 1 };
    case "RESET":
      return counterInitial;
    default:
      return state;
  }
}

function UseStateCounter() {
  const [count, setCount] = useState(0);
  return (
    <div className="card">
      <h2>useState</h2>
      <p className="sub">useState를 시작: {count}</p>
      <div className="btn-group">
        <button onClick={() => setCount((prev) => prev + 1)}>Increase</button>
      </div>
    </div>
  );
}

function UseReducerCounter() {
  const [state, dispatch] = useReducer(counterReducer, counterInitial);
  return (
    <div className="card">
      <h2>useReducer</h2>
      <p className="sub">useReducer를 시작: {state.counter}</p>
      <div className="btn-group">
        <button onClick={() => dispatch({ type: "INCREASE" })}>Increase</button>
        <button onClick={() => dispatch({ type: "DECREASE" })}>Decrease</button>
        <button className="reset" onClick={() => dispatch({ type: "RESET" })}>reset</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// 회사 직무 예제
// ════════════════════════════════════════

interface ICompanyState {
  department: string;
  error: string | null;
}

type CompanyAction =
  | { type: "CHANGE_DEPARTMENT"; payload: string }
  | { type: "SET_ERROR"; payload: string };

const companyInitial: ICompanyState = {
  department: "Software Developer",
  error: null,
};

function companyReducer(state: ICompanyState, action: CompanyAction): ICompanyState {
  switch (action.type) {
    case "CHANGE_DEPARTMENT":
      return { department: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function UseReducerCompany() {
  const [state, dispatch] = useReducer(companyReducer, companyInitial);
  const [input, setInput] = useState("");

  const handleChange = () => {
    if (input.trim() === "") return;
    if (input !== "카드메이커") {
      dispatch({ type: "SET_ERROR", payload: "죄송합니다. 거부권을 행사합니다." });
    } else {
      dispatch({ type: "CHANGE_DEPARTMENT", payload: input });
    }
    setInput("");
  };

  return (
    <div className="card company">
      <h2>{state.department}</h2>
      {state.error && <p className="error">{state.error}</p>}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleChange()}
        placeholder="변경하시고 싶은 직무를 입력해주세요. 단 거부권 행사 가능"
      />
      <button onClick={handleChange}>직무 변경</button>
    </div>
  );
}

// ════════════════════════════════════════
// App
// ════════════════════════════════════════

export default function App() {
  return (
    <main>
      <section className="section">
        <h1 className="section-title">카운터 예제</h1>
        <div className="row">
          <UseStateCounter />
          <UseReducerCounter />
        </div>
      </section>

      <section className="section">
        <h1 className="section-title">회사 직무 예제</h1>
        <UseReducerCompany />
      </section>
    </main>
  );
}
