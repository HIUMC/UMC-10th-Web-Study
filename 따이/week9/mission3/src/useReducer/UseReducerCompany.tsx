import { useReducer, useState, type ChangeEvent } from "react";

type TActionType = "CHANGE_DEPARTMENT" | "RESET";

interface IState {
  department: string;
  error: string | null;
}

interface IAction {
  type: TActionType;
  payload?: string;
}

function reducer(state: IState, action: IAction) {
  const { type, payload } = action;
  switch (type) {
    case "CHANGE_DEPARTMENT":
      const newDepartment = payload;
      const hasError = newDepartment !== "카드메이커";

      {
        return {
          ...state,
          department: hasError ? state.department : newDepartment,
          error: hasError
            ? "거부권 행사 가능, 카드메이커만 입력 가능합니다."
            : null,
        };
      }
    default:
      return state;
  }
}

export default function UseReducerCompany() {
  const [state, dispatch] = useReducer(reducer, {
    department: "Software Developer",
    error: null,
  });

  const [department, setDepartment] = useState("");

  const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>) => {
    setDepartment(e.target.value);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          {state.department}
        </h1>
        {state.error && (
          <p className="text-center text-red-500">{state.error}</p>
        )}

        <input
          className="mt-10 block w-full rounded-md border border-slate-300 bg-white p-4 outline-none focus:border-blue-500"
          placeholder="변경하시고 싶은 직무를 입력해주세요. 단 거부권 행사 가능"
          value={department}
          onChange={handleChangeDepartment}
        />

        <button
          className="mt-3 w-full rounded-md bg-blue-600 px-5 py-4 font-semibold text-white transition-colors hover:bg-blue-700"
          onClick={() =>
            dispatch({
              type: "CHANGE_DEPARTMENT",
              payload: department,
            })
          }
        >
          직무 변경하기
        </button>
      </div>
    </div>
  );
}
