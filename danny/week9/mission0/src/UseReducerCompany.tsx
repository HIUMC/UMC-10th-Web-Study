import { type ChangeEvent, useReducer, useState } from "react";

type TActionType = "CHANGE_DEPARTMENT" | "RESET";

interface IState {
  department: string;
  error: string | null;
}

interface IAction {
  type: TActionType;
  payload?: string;
}

function reducer(state: IState, action: IAction): IState {
  const { type, payload } = action;

  switch (type) {
    case "CHANGE_DEPARTMENT": {
      const newDepartment = payload;
      const hasError = newDepartment !== "카드메이커";
      return {
        ...state,
        department: hasError ? state.department : newDepartment,
        error: hasError
          ? "거부권 행사가능, 카드메이커만 입력 가능합니다."
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
  const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>): void => {
    setDepartment(e.target.value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-[600px] rounded-2xl bg-white p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            현재 소속 직무
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            {state.department}
          </h1>
        </div>
        {/* font-2xl을 text-2xl로 수정했습니다 */}
        {state.error && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-center gap-2">
            <p className="text-red-600 text-sm font-medium">{state.error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            className="w-full border border-slate-200 rounded-xl p-4 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50"
            placeholder="변경하시고 싶은 직무를 입력해주세요. 단 거부권 행사 가능"
            value={department}
            onChange={handleChangeDepartment}
          />

          <button
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold p-4 rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.99] cursor-pointer"
            onClick={(): void => {
              dispatch({ type: "CHANGE_DEPARTMENT", payload: department });
            }}
          >
            직무 변경하기
          </button>
        </div>
      </div>
    </div>
  );
}
