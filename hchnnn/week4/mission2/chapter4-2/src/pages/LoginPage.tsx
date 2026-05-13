import React from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();

  const validateLogin = (values: any) => {
    const errors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.email) {
        errors.email = "이메일을 입력해주세요!";
    } else if (!emailRegex.test(values.email)) {
        errors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!values.password) {
        errors.password = "비밀번호를 입력해주세요!";
    } else if (values.password.length < 6) { // 8에서 6으로 수정 🍠
        errors.password = "비밀번호는 최소 6자 이상이어야 합니다."; // 메시지 수정 🍠
    }

    return errors;
};
    const { values, errors, touched, handleChange, handleBlur, isValid } = useForm({
        initialValues: { email: '', password: '' },
        validate: validateLogin,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) {
            try {
                const response = await axios.post('http://localhost:3000/auth/login', {
                    email: values.email,
                    password: values.password
                });
                alert("로그인 성공!");
                navigate('/'); 
            } catch (error) {
                alert("로그인 실패! 아이디와 비밀번호를 확인해주세요.");
            }
        }
    };

    return (
        <div className="bg-black min-h-screen text-white relative">
            {/* --- 헤더 영역 (상단 버튼들) --- */}
            <header className="flex justify-between items-center p-6 px-10">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-2xl hover:text-gray-400 transition cursor-pointer"
                >
                    &lt;
                </button>
                <button 
                    onClick={() => navigate('/signup')} 
                    className="bg-pink-500 px-4 py-2 rounded-lg font-bold hover:bg-pink-600 transition cursor-pointer"
                >
                    회원가입
                </button>
            </header>

            {/* --- 로그인 폼 영역 --- */}
            <div className="flex flex-col items-center justify-center pt-10">
                <div className="w-full max-w-md p-6">
                    <h1 className="text-center text-2xl font-bold mb-8">로그인</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <button type="button" className="flex items-center justify-center gap-2 border border-gray-600 p-3 rounded-lg hover:bg-gray-900 transition font-medium">
                            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
                            구글 로그인
                        </button>

                        <div className="flex items-center gap-4 my-2">
                            <div className="h-[1px] bg-gray-600 flex-1"></div>
                            <span className="text-sm text-gray-400">OR</span>
                            <div className="h-[1px] bg-gray-600 flex-1"></div>
                        </div>

                        <div className="flex flex-col">
                            <input
                                type="email"
                                placeholder="이메일을 입력해주세요!"
                                value={values.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                className={`p-4 bg-transparent border rounded-lg focus:outline-none focus:ring-1 ${
                                    touched.email && errors.email ? 'border-red-500' : 'border-gray-600 focus:ring-blue-500'
                                }`}
                            />
                            {touched.email && errors.email && (
                                <span className="text-red-500 text-sm mt-1">{errors.email}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <input
                                type="password"
                                placeholder="비밀번호를 입력해주세요!"
                                value={values.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                onBlur={() => handleBlur('password')}
                                className={`p-4 bg-transparent border rounded-lg focus:outline-none focus:ring-1 ${
                                    touched.password && errors.password ? 'border-red-500' : 'border-gray-600 focus:ring-blue-500'
                                }`}
                            />
                            {touched.password && errors.password && (
                                <span className="text-red-500 text-sm mt-1">{errors.password}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!isValid}
                            className={`p-4 mt-4 rounded-lg font-bold transition ${
                                isValid ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-800 text-gray-500'
                            }`}
                        >
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;