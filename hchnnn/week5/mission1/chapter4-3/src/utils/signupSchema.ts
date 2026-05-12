import * as z from 'zod';

export const signupSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
  passwordCheck: z.string(),
  nickname: z.string().min(2, { message: "닉네임은 2자 이상이어야 합니다." }),
}).refine((data) => data.password === data.passwordCheck, {
  path: ["passwordCheck"],
  message: "비밀번호가 일치하지 않습니다.",
});

export type SignupFormValues = z.infer<typeof signupSchema>;