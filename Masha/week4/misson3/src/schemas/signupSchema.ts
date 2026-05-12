import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
  password: z.string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(16, "비밀번호는 16자 이하여야 합니다."),
  passwordCheck: z.string()
    .min(1, "비밀번호를 한 번 더 입력해주세요."),
  nickname: z.string()
    .min(2, "닉네임은 2자 이상이어야 합니다.")
    .max(10, "닉네임은 10자 이하여야 합니다."),
}).refine((data) => data.password === data.passwordCheck, {
  path: ["passwordCheck"],
  message: "비밀번호가 일치하지 않습니다.",
});

export type SignupFields = z.infer<typeof signupSchema>;