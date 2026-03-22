import { useNavigate } from 'react-router-dom';

import { adminApi } from '../../api/admin.api';
import DashboardLayout from '../../components/dashboard/Layout';
import { adminNavigationLinks } from '../../utils/adminNavigationLinks';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await adminApi.logout();
    navigate('/login', { replace: true });
  };
  return (
    <DashboardLayout navItems={adminNavigationLinks} onLogout={handleLogout} />
  );
}
