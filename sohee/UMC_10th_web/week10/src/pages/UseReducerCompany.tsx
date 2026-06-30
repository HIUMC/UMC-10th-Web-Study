import { ChangeEvent, useReducer, useState } from 'react';

type CompanyState = {
  department: string;
  error: string | null;
};

type CompanyAction = {
  type: 'CHANGE_DEPARTMENT';
  payload: string;
};

const initialState: CompanyState = {
  department: '\uCE74\uB4DC\uBA54\uC774\uCEE4',
  error: null,
};

function reducer(state: CompanyState, action: CompanyAction): CompanyState {
  switch (action.type) {
    case 'CHANGE_DEPARTMENT': {
      const nextDepartment = action.payload.trim();

      if (!nextDepartment) {
        return {
          ...state,
          error: '\uBCC0\uACBD\uD558\uACE0 \uC2F6\uC740 \uC9C1\uBB34\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.',
        };
      }

      if (['\uB300\uD45C', '\uC0AC\uC7A5', 'ceo'].includes(nextDepartment.toLowerCase())) {
        return {
          ...state,
          error: '\uD574\uB2F9 \uC9C1\uBB34\uB294 \uAC70\uBD80\uAD8C\uC774 \uD589\uC0AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.',
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

export default function UseReducerCompany() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [department, setDepartment] = useState('');

  const handleChangeDepartment = (event: ChangeEvent<HTMLInputElement>) => {
    setDepartment(event.target.value);
  };

  const handleSubmit = () => {
    dispatch({ type: 'CHANGE_DEPARTMENT', payload: department });
  };

  return (
    <section className="reducer-company-page" aria-labelledby="department-title">
      <div className="reducer-company-panel">
        <h1 id="department-title">{state.department}</h1>
        {state.error && <p className="reducer-error">{state.error}</p>}

        <input
          className="reducer-input"
          placeholder="\uCE74\uB4DC\uBA54\uC774\uCEE4"
          value={department}
          onChange={handleChangeDepartment}
        />

        <button className="reducer-button" type="button" onClick={handleSubmit}>
          {'\uC9C1\uBB34 \uBCC0\uACBD\uD558\uAE30'}
        </button>
      </div>
    </section>
  );
}
