import { FcGoogle } from "react-icons/fc";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useAuth } from "../hooks/useAuth";

const API_BASE_URL = "http://localhost:8000";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, touched, getInputProps, validateAll } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    if (!validateAll()) return;

    const isLoggedIn = await login(values);
    if (isLoggedIn) {
      navigate("/my", { replace: true });
    }
  };

  const handleGoogleLogin = () => {
    const origin = encodeURIComponent(window.location.origin);
    window.location.assign(`${API_BASE_URL}/v1/auth/google?origin=${origin}`);
  };

  const isDisabled =
    Object.values(errors).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value.trim() === "");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
      <form
        className="flex w-full max-w-xs flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="relative mb-3 flex items-center justify-center py-3">
          <button
            type="button"
            className="absolute left-0 text-xl"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            {"<"}
          </button>
          <h1 className="text-2xl font-semibold">Login</h1>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="relative flex w-full items-center justify-center rounded border border-white/40 bg-black px-4 py-3 text-base font-medium text-white hover:bg-white/5"
        >
          <FcGoogle className="absolute left-4 text-2xl" />
          Continue with Google
        </button>

        <div className="my-3 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/30" />
          <span className="text-sm text-white/70">OR</span>
          <div className="h-px flex-1 bg-white/30" />
        </div>

        <input
          {...getInputProps("email")}
          name="email"
          className={`w-full rounded border bg-zinc-900 px-4 py-3 text-white outline-none focus:border-[#807bff] ${
            errors?.email && touched?.email ? "border-red-500" : "border-white/30"
          }`}
          type="email"
          placeholder="Email"
          autoComplete="email"
        />
        {errors?.email && touched?.email && (
          <div className="text-sm text-red-500">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          name="password"
          className={`w-full rounded border bg-zinc-900 px-4 py-3 text-white outline-none focus:border-[#807bff] ${
            errors?.password && touched?.password
              ? "border-red-500"
              : "border-white/30"
          }`}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
        />
        {errors?.password && touched?.password && (
          <div className="text-sm text-red-500">{errors.password}</div>
        )}

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full cursor-pointer rounded bg-blue-600 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
