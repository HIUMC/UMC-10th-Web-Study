import { z } from "zod";

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "이메일을 입력해주세요!" })
      .email({ message: "올바른 이메일 형식이 아닙니다!" }),

    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),

    passwordCheck: z
      .string()
      .min(1, { message: "비밀번호를 다시 한 번 입력해주세요!" }),

    nickname: z
      .string()
      .min(1, { message: "닉네임을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;