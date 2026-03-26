import { useNavigate } from 'react-router-dom';

import { deptApi } from '../../api/dept.api';
import LoginForm from '../../components/auth/LoginFrom';

export default function DeptLoginPage() {
  const navigate = useNavigate();
  const handleLogin = async (data) => {
    await deptApi.login(data);
    navigate('/dept/dashboard', { replace: true });
  };
  return <LoginForm onSubmit={handleLogin} userType={'department'} />;
}
