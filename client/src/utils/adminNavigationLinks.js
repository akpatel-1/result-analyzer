import { FaFileUpload } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoHomeOutline,
  IoListOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoTrophyOutline,
} from 'react-icons/io5';
import { MdOutlineMenuBook } from 'react-icons/md';
import { TbChartBar, TbReportAnalytics } from 'react-icons/tb';

export const adminNavigationLinks = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: IoHomeOutline,
    color: '#6777F1',
  },
  {
    to: '/admin/results',
    label: 'Results',
    icon: HiOutlineDocumentReport,
    color: '#22C55E',
    children: [
      {
        to: '/admin/results?status=all',
        label: 'All Results',
        icon: IoListOutline,
        color: '#6B7280',
      },
      {
        to: '/admin/results?status=passed',
        label: 'Passed',
        icon: IoCheckmarkCircleOutline,
        color: '#10B981',
      },
      {
        to: '/admin/results?status=failed',
        label: 'Failed',
        icon: IoCloseCircleOutline,
        color: '#EF4444',
      },
    ],
  },
  {
    to: '/admin/students',
    label: 'Students',
    icon: IoPeopleOutline,
    color: '#8B5CF6',
  },
  {
    to: '/admin/subjects',
    label: 'Subjects',
    icon: MdOutlineMenuBook,
    color: '#F59E0B',
  },
  {
    to: '/admin/analytics',
    label: 'Analytics',
    icon: TbChartBar,
    color: '#0EA5E9',
  },
  {
    to: '/admin/rankings',
    label: 'Rankings',
    icon: IoTrophyOutline,
    color: '#EAB308',
  },
  {
    to: '/admin/reports',
    label: 'Reports',
    icon: TbReportAnalytics,
    color: '#6366F1',
  },
  {
    to: '/admin/settings',
    label: 'Settings',
    icon: IoSettingsOutline,
    color: '#f97316',
  },
  {
    to: '/admin/upload',
    label: 'Upload results',
    icon: FaFileUpload,
    color: '#32a866',
  },
];
