import { useNavigate } from 'react-router-dom';

import { adminApi } from '../../api/admin.api';
import DashboardLayout from '../../components/dashboard/Layout';
import UploadStudentResults from '../../components/upload/Upload';
import { adminNavigationLinks } from '../../utils/dashboard.navigation';
import { parseJsonFiles } from '../../utils/parse.json.files';

export default function AdminResultUpload() {
  const navigate = useNavigate();

  const handleUpload = async (files) => {
    const payload = await parseJsonFiles(files);

    return adminApi.upload('results', payload, {});
  };

  const handleLogout = async () => {
    await adminApi.logout();
    navigate('/login', { replace: true });
  };

  return (
    <DashboardLayout navItems={adminNavigationLinks} onLogout={handleLogout}>
      <UploadStudentResults
        onUpload={handleUpload}
        title={'Upload Regular or Backlog results'}
      />
    </DashboardLayout>
  );
}
