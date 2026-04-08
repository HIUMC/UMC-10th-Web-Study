import { z } from 'zod';

export const emailSchema = z.object({
  email: z.email('올바른 이메일 형식을 입력해주세요.'),
});

export const loginSchema = z.object({
  email: z.email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

export const passwordStepSchema = z
  .object({
    password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
    passwordConfirm: z.string().min(1, '비밀번호를 다시 입력해주세요.'),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export const signUpSchema = z
  .object({
    email: z.email('올바른 이메일 형식을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
    passwordConfirm: z.string().min(1, '비밀번호를 다시 입력해주세요.'),
    name: z
      .string()
      .min(2, '닉네임은 2자 이상 입력해주세요.')
      .max(20, '닉네임은 20자 이하로 입력해주세요.'),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
