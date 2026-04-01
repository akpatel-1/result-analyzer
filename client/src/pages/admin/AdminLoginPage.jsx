import { useNavigate } from 'react-router-dom';

import { adminApi } from '../../api/admin.api';
import LoginForm from '../../components/auth/LoginFrom';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const handleLogin = async (data) => {
    await adminApi.login(data);
    navigate('/admin/overview', { replace: true });
  };
  return <LoginForm onSubmit={handleLogin} userType={'Admin'} />;
}
