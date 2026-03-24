import { useNavigate } from 'react-router-dom';

import { hodApi } from '../../api/hod.api';
import DashboardLayout from '../../components/dashboard/Layout';
import { hodNavigationLinks } from '../../utils/dashboard.navigation';

export default function HodDashboardPage() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await hodApi.logout();
    navigate('/hod/login', { replace: true });
  };
  return (
    <DashboardLayout navItems={hodNavigationLinks} onLogout={handleLogout} />
  );
}
