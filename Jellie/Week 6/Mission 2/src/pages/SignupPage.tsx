import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../apis/auth";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await signUp({ name, email, password, bio, avatar });

      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <section className="w-full max-w-md panel-analog rounded-3xl p-8 shadow-2xl shadow-black/40">
        <h1 className="text-3xl font-black text-center mb-8 text-[#e8ded4]">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름"
            className="px-4 py-3 input-analog"
          />

          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="이메일"
            className="px-4 py-3 input-analog"
          />

          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="비밀번호"
            className="px-4 py-3 input-analog"
          />

          <input
            value={avatar}
            onChange={(event) => setAvatar(event.target.value)}
            placeholder="프로필 이미지 URL"
            className="px-4 py-3 input-analog"
          />

          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="소개글"
            className="min-h-28 px-4 py-3 input-analog resize-none"
          />

          <button className="mt-2 py-3 btn-primary">회원가입</button>
        </form>
      </section>
    </main>
  );
}