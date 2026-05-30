import { useReducer, useState } from "react";
import type { ChangeEvent } from "react";
import { reducer, initialState } from "../reducers/useReducerCompany";

export default function UseReducerPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [department, setDepartment] = useState("");

  const handleChangeDepartment = (event: ChangeEvent<HTMLInputElement>) => {
    setDepartment(event.target.value);
  };

  const handleSubmit = () => {
    dispatch({
      type: "CHANGE_DEPARTMENT",
      payload: department,
    });
  };

  return (
    <section className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#151515] p-8 shadow-xl">
        <h1 className="mb-4 text-4xl font-bold text-pink-500">
          {state.department}
        </h1>

        {state.error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {state.error}
          </p>
        )}

        <input
          className="mb-4 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-pink-500"
          placeholder="변경하고 싶은 직무를 입력하세요"
          value={department}
          onChange={handleChangeDepartment}
        />

        <button
          className="w-full rounded-lg bg-pink-500 px-5 py-3 font-bold transition-colors duration-200 hover:bg-pink-600"
          type="button"
          onClick={handleSubmit}
        >
          직무 변경하기
        </button>
      </div>
    </section>
  );
}