import { Outlet, useNavigate } from 'react-router-dom';

import { studentApi } from '../../api/student.api';
import DashboardLayout from '../../components/dashboard/Layout';
import { studentNavigationLinks } from '../../utils/dashboard.navigation';

export default function StudentOverviewPage() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await studentApi.logout();
    navigate('/student/login', { replace: true });
  };
  return (
    <DashboardLayout navItems={studentNavigationLinks} onLogout={handleLogout}>
      <Outlet />
    </DashboardLayout>
  );
}
