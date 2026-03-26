import { useNavigate } from 'react-router-dom';

import { deptApi } from '../../api/dept.api';
import DashboardLayout from '../../components/dashboard/Layout';
import { deptNavigationLinks } from '../../utils/dashboard.navigation';

export default function DeptDashboardPage() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await deptApi.logout();
    navigate('/dept/login', { replace: true });
  };
  return (
    <DashboardLayout navItems={deptNavigationLinks} onLogout={handleLogout} />
  );
}
