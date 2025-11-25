// src/pages/LoginPage.tsx
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import AuthForm from '../components/auth/AuthForm';

const LoginPage = () => {
  const navigate = useNavigate();

  const loginAction = async (_prev: any, formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await login(email, password);

      if (response && response.id) {
        navigate('/home');
        return { success: true, message: '로그인 성공' };
      }

      return { success: false, message: '로그인 응답이 올바르지 않습니다.' };
    } catch (error: any) {
      return { success: false, message: error.message || '로그인 오류 발생' };
    }
  };

  return <AuthForm mode="login" action={loginAction} />;
};

export default LoginPage;
