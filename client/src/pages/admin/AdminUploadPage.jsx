import { useNavigate } from 'react-router-dom';

import { adminApi } from '../../api/admin.api';
import DashboardLayout from '../../components/dashboard/Layout';
import UploadStudentResults from '../../components/upload/Upload';
import { adminNavigationLinks } from '../../utils/adminNavigationLinks';

export default function AdminUploadPage() {
  const navigate = useNavigate();

  const handleUpload = async (files) => {
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));

    const response = await adminApi.profileUpload(formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response?.data;
  };

  const handleLogout = async () => {
    await adminApi.logout();
    navigate('/login', { replace: true });
  };

  return (
    <DashboardLayout navItems={adminNavigationLinks} onLogout={handleLogout}>
      <UploadStudentResults onUpload={handleUpload} />
    </DashboardLayout>
  );
}
