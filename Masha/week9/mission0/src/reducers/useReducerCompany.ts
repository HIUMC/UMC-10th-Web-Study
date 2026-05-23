export type CompanyState = {
  department: string;
  error: string | null;
};

export type CompanyAction = {
  type: "CHANGE_DEPARTMENT";
  payload: string;
};

export const initialState: CompanyState = {
  department: "카드메이커",
  error: null,
};

export function reducer(
  state: CompanyState,
  action: CompanyAction
): CompanyState {
  switch (action.type) {
    case "CHANGE_DEPARTMENT": {
      const nextDepartment = action.payload.trim();

      if (!nextDepartment) {
        return {
          ...state,
          error: "변경하고 싶은 직무를 입력해주세요.",
        };
      }

      if (["대표", "사장", "ceo"].includes(nextDepartment.toLowerCase())) {
        return {
          ...state,
          error: "해당 직무는 거부권이 행사되었습니다.",
        };
      }

      return {
        department: nextDepartment,
        error: null,
      };
    }

    default:
      return state;
  }
}