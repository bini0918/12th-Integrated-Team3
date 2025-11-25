import { useActionState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface ActionState {
  success: boolean;
  message: string;
}

interface AuthFormProps {
  mode: 'login' | 'signup';
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

const AuthForm = ({ mode, action }: AuthFormProps) => {
  const { email, password, setEmail, setPassword, resetForm } = useAuthStore();

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    message: '',
  });

  useEffect(() => {
    resetForm();
    return () => resetForm();
  }, [resetForm]);

  useEffect(() => {
    if (state.message && !state.success) {
      alert(state.message);
    }
  }, [state]);

  const isLogin = mode === 'login';
  const buttonText = isPending ? '처리 중...' : isLogin ? '로그인' : '가입하기';
  const footerText = isLogin ? '회원이 아니신가요? ' : '이미 회원이신가요? ';
  const linkText = isLogin ? '회원가입하기' : '로그인하기';
  const linkTo = isLogin ? '/signup' : '/';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3]">
      <div className="flex w-full max-w-md flex-col items-center px-6 py-10">
        <form action={formAction} className="w-full">
          <div className="w-full mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">이메일</label>
            <input
              name="email"
              type="email"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:border-gray-500 focus:outline-none"
              required
            />
          </div>

          <div className="w-full mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-11 text-gray-800 focus:border-gray-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full rounded-xl py-3 text-white font-semibold transition-colors cursor-pointer ${
              isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B5B1AE] hover:bg-[#a7a3a0]'
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
