import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3]">
      <div className="flex w-full max-w-md flex-col items-center px-6 py-10">
        <div className="w-full mb-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            placeholder="이메일을 입력해 주세요"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:border-gray-500 focus:outline-none"
          />
        </div>

        <div className="w-full mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
          <div className="relative">
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-11 text-gray-800 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-[#B5B1AE] py-3 text-white font-semibold hover:bg-[#a7a3a0] cursor-pointer"
        >
          가입하기
        </button>

        <p className="mt-6 text-sm text-gray-700">
          이미 회원이신가요?{' '}
          <Link to="/" className="font-semibold text-gray-900 underline">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
