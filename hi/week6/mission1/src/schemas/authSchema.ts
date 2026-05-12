import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .email('올바른 이메일 형식을 입력해주세요.'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .min(6, '비밀번호는 6자 이상이어야 합니다.'),
    confirmPassword: z
      .string()
      .min(1, '비밀번호를 다시 입력해주세요.'),
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요.')
      .min(2, '닉네임은 2자 이상이어야 합니다.')
      .max(10, '닉네임은 10자 이하로 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type SignupSchemaType = z.infer<typeof signupSchema>;