import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { studentApi } from '../../api/student.api';
import DashboardLayout from '../../components/dashboard/Layout';
import { getStudentNavigationLinks } from '../../utils/dashboard.navigation';

export default function StudentOverviewPage() {
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState(getStudentNavigationLinks());

  useEffect(() => {
    async function fetchSemester() {
      try {
        const res = await studentApi.me();
        const semester = res?.data?.user?.semester;
        if (semester && Number.isInteger(semester) && semester > 0) {
          setNavItems(
            getStudentNavigationLinks(
              Array.from({ length: semester }, (_, i) => i + 1)
            )
          );
        }
      } catch (e) {
        // fallback to default navItems
      }
    }
    fetchSemester();
  }, []);

  const handleLogout = async () => {
    await studentApi.logout();
    navigate('/student/login', { replace: true });
  };

  return (
    <DashboardLayout navItems={navItems} onLogout={handleLogout}>
      <Outlet />
    </DashboardLayout>
  );
}
