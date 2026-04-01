import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/dashboard/Layout';
import { useAuthStore } from '../../store/user.auth.store';
import { getStudentNavigationLinks } from '../../utils/dashboard.navigation';

export default function StudentOverviewPage() {
  const navigate = useNavigate();
  const { student, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    async function ensureStudent() {
      if (!student) {
        await fetchMe();
      }
    }

    ensureStudent();
  }, [student, fetchMe]);

  const studentData = student?.user || student;
  const semester = studentData?.semester;
  const userName = studentData?.name || '';
  const navItems =
    semester && Number.isInteger(semester) && semester > 0
      ? getStudentNavigationLinks(
          Array.from({ length: semester }, (_, i) => i + 1)
        )
      : getStudentNavigationLinks();

  const handleLogout = async () => {
    await logout();
    navigate('/student/login', { replace: true });
  };

  return (
    <DashboardLayout
      navItems={navItems}
      onLogout={handleLogout}
      userName={userName}
    >
      <Outlet />
    </DashboardLayout>
  );
}
