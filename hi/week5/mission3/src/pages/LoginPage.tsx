import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import axiosInstance from '../apis/axiosInstance';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();

  const { values, errors, handleChange, validateAll, isValid } =
    useForm<LoginFormValues>(
      {
        email: '',
        password: '',
      },
      {
        email: {
          required: '이메일을 입력해주세요.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '유효하지 않은 이메일 형식입니다.',
          },
        },
        password: {
          required: '비밀번호를 입력해주세요.',
          minLength: {
            value: 6,
            message: '비밀번호는 최소 6자 이상이어야 합니다.',
          },
        },
      }
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isPassed = validateAll();
    if (!isPassed) return;

    try {
      const response = await axiosInstance.post('/v1/auth/signin', {
        email: values.email,
        password: values.password,
    });

      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);

      navigate('/mypage');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-title-row">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            &lt;
          </button>
          <h1 className="login-title">로그인</h1>
        </div>

        <button 
          type="button" 
          className="google-login-button"
          onClick={() => {
            window.location.href ='http://localhost:8000/v1/auth/google/login';
          }}
          >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            className="google-icon"
          />
          구글 로그인
        </button>

        <div className="or-divider">
          <span className="divider-line" />
          <span className="or-text">OR</span>
          <span className="divider-line" />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="이메일을 입력해주세요!"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="login-input"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="login-input"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" disabled={!isValid} className="login-button">
            로그인
          </button>
        </form>
        <div className="signup-link-row">
          <span>아직 계정이 없으신가요?</span>
          <button
            type="button"
            className="signup-link-button"
            onClick={()=>navigate('/signup')}
          >
            회원가입
          </button>
        </div>


      </div>
    </div>
  );
};

export default LoginPage;