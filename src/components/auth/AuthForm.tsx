// src/components/auth/AuthForm.tsx
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useActionState, startTransition } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const authSchema = z.object({
  email: z.string().min(1, '이메일은 필수입니다.').email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

type FormInputs = z.infer<typeof authSchema>;

interface ActionState {
  success: boolean;
  message: string;
}

interface AuthFormProps {
  mode: 'login' | 'signup';
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

const AuthForm = ({ mode, action }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: zodResolver(authSchema),
    mode: 'onSubmit',
  });

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    message: '',
  });

  const onSubmit = (data: FormInputs) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    startTransition(() => {
      formAction(formData);
    });
  };

  const isLogin = mode === 'login';
  const isLoading = isPending || isSubmitting;

  const buttonText = isLoading ? '처리 중...' : isLogin ? '로그인' : '가입하기';
  const footerText = isLogin ? '회원이 아니신가요? ' : '이미 회원이신가요? ';
  const linkText = isLogin ? '회원가입하기' : '로그인하기';
  const linkTo = isLogin ? '/signup' : '/';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3]">
      <div className="flex w-full max-w-md flex-col items-center px-6 py-10">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="w-full mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="이메일을 입력해 주세요"
              {...register('email')}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-800 focus:outline-none transition-colors
                ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="w-full mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="비밀번호를 입력해주세요"
                {...register('password')}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-800 focus:outline-none transition-colors
                  ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          {state.message && !state.success && (
            <div className="mb-4 text-sm text-red-500 font-medium text-center">{state.message}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-xl py-3 text-white font-semibold transition-colors cursor-pointer ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B5B1AE] hover:bg-[#a7a3a0]'
            }`}
          >
            {buttonText}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-700">
          {footerText}
          <Link to={linkTo} className="font-semibold text-gray-900 underline">
            {linkText}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
