import { useNavigate } from 'react-router-dom';

import { hodApi } from '../../api/hod.api';
import LoginForm from '../../components/auth/LoginFrom';

export default function HodLoginPage() {
  const navigate = useNavigate();
  const handleLogin = async (data) => {
    await hodApi.login(data);
    navigate('/hod/dashboard', { replace: true });
  };
  return <LoginForm onSubmit={handleLogin} userType={'HOD'} />;
}
