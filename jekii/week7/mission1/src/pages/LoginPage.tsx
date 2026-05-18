import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useLogin from "../hooks/mutations/useLogin";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const loginMutation = useLogin();

  useEffect(() => {
    if (accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = () => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate("/", { replace: true });
      },
    });
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "") ||
    loginMutation.isPending;

  return (
    <div className="min-h-screen text-slate-800 dark:text-white font-sans flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      <div className="w-full max-w-[420px] bg-white/80 dark:bg-[#1e1e24]/80 backdrop-blur-md p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-10 border border-slate-200 dark:border-gray-800 relative mt-10 transition-all">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute text-xl text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white transition-colors"
          aria-label="Go back"
        >
          {"<"}
        </button>

        <h2 className="text-2xl font-bold text-center mb-8 text-slate-800 dark:text-white">
          Login
        </h2>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <input
              {...getInputProps("email")}
              className={`w-full bg-slate-50 dark:bg-[#2a2b36] border ${
                errors?.email && touched?.email
                  ? "border-pink-500"
                  : "border-slate-200 dark:border-gray-700"
              } rounded-xl p-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors`}
              type="email"
              placeholder="Email"
            />
            {errors?.email && touched?.email && (
              <div className="text-pink-500 text-sm ml-1 mt-1">
                {errors.email}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              {...getInputProps("password")}
              className={`w-full bg-slate-50 dark:bg-[#2a2b36] border ${
                errors?.password && touched?.password
                  ? "border-pink-500"
                  : "border-slate-200 dark:border-gray-700"
              } rounded-xl p-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors`}
              type="password"
              placeholder="Password"
            />
            {errors?.password && touched?.password && (
              <div className="text-pink-500 text-sm ml-1 mt-1">
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 mt-2 rounded-xl disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-[#333] dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          {loginMutation.isError && (
            <p className="text-center text-sm text-pink-500">
              Login failed. Please check your email and password.
            </p>
          )}

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-slate-200 dark:bg-gray-700 transition-colors" />
            <span className="text-sm text-slate-400 dark:text-gray-500 transition-colors">
              or
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-gray-700 transition-colors" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-[#2a2b36] border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-[#32333f] text-slate-800 dark:text-white py-4 rounded-xl font-medium transition-colors cursor-pointer flex items-center justify-center gap-3 shadow-sm"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
