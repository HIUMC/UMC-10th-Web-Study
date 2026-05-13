import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLogin = (values: { email: string; password: string }) => {
  const errors: Partial<Record<'email' | 'password', string>> = {};

  if (!values.email) {
    errors.email = '이메일을 입력해주세요!';
  } else if (!emailRegex.test(values.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요. (예: example@email.com)';
  }

  if (!values.password) {
    errors.password = '비밀번호를 입력해주세요!';
  } else if (values.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.';
  }

  return errors;
};

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
  } = useForm({
    initialValues: { email: '', password: '' },
    validate: validateLogin,
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await fetch('http://localhost:3000/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) throw new Error('로그인 실패');

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/');
    } catch {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <Container>
      <LoginBox onSubmit={handleSubmit(onSubmit)}>
        <Header>
          <BackButton type="button" onClick={() => navigate('/')}>
            &lt;
          </BackButton>
          <Title>로그인</Title>
        </Header>

        <GoogleButton type="button">
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
            width="20"
          />
          구글 로그인
        </GoogleButton>

        <Divider>
          <Line />
          <OrText>OR</OrText>
          <Line />
        </Divider>

        <InputWrapper>
          <Input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="이메일을 입력해주세요!"
            $hasError={!!(touched.email && errors.email)}
          />
          {touched.email && errors.email && (
            <ErrorText>{errors.email}</ErrorText>
          )}
        </InputWrapper>

        <InputWrapper>
          <Input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="비밀번호를 입력해주세요!"
            $hasError={!!(touched.password && errors.password)}
          />
          {touched.password && errors.password && (
            <ErrorText>{errors.password}</ErrorText>
          )}
        </InputWrapper>

        <LoginButton type="submit" disabled={!isValid}>
          로그인
        </LoginButton>
      </LoginBox>
    </Container>
  );
};

export default LoginPage;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
`;

const LoginBox = styled.form`
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  left: 0;
`;

const Title = styled.h2`
  width: 100%;
  text-align: center;
  color: white;
  font-size: 1.2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background: white;
  color: black;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: #333;
`;

const OrText = styled.span`
  color: #666;
  font-size: 0.8rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 15px;
  border-radius: 8px;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#FF2E7E' : '#333')};
  background-color: #1a1a1a;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? '#FF2E7E' : '#888')};
  }
  &::placeholder {
    color: #555;
  }
`;

const ErrorText = styled.span`
  color: #FF2E7E;
  font-size: 0.75rem;
  margin-left: 5px;
`;

const LoginButton = styled.button`
  margin-top: 10px;
  padding: 15px;
  border-radius: 8px;
  border: none;
  background-color: ${({ disabled }) => (disabled ? '#333' : '#FF2E7E')};
  color: ${({ disabled }) => (disabled ? '#666' : 'white')};
  font-weight: bold;
  font-size: 1rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s;
`;