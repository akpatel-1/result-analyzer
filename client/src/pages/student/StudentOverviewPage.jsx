import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { studentApi } from '../../api/student.api';
import DashboardLayout from '../../components/dashboard/Layout';
import { getStudentNavigationLinks } from '../../utils/dashboard.navigation';

export default function StudentOverviewPage() {
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState(getStudentNavigationLinks());
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function fetchSemester() {
      const res = await studentApi.me();
      const semester = res?.data?.user?.semester;
      const name = res?.data?.user?.name;
      setUserName(name || '');

      if (semester && Number.isInteger(semester) && semester > 0) {
        setNavItems(
          getStudentNavigationLinks(
            Array.from({ length: semester }, (_, i) => i + 1)
          )
        );
      }
    }
    fetchSemester();
  }, []);

  const handleLogout = async () => {
    await studentApi.logout();
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
