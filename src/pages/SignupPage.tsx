// src/pages/SignupPage.tsx
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import AuthForm from '../components/auth/AuthForm';

const SignupPage = () => {
  const navigate = useNavigate();

  const signupAction = async (_prev: any, formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await signup(email, password);

      if (response && response.email) {
        alert(`회원가입 완료! (ID: ${response.email})\n로그인해주세요.`);
        navigate('/');
        return { success: true, message: '회원가입 성공' };
      }

      return { success: false, message: '회원가입 응답이 올바르지 않습니다.' };
    } catch (error: any) {
      return { success: false, message: error.message || '회원가입 오류 발생' };
    }
  };

  return <AuthForm mode="signup" action={signupAction} />;
};

export default SignupPage;
