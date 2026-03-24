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
import { IoPersonOutline } from 'react-icons/io5';
import { MdOutlineMenuBook } from 'react-icons/md';
import { MdOutlineSchool } from 'react-icons/md';
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
    color: '#22C55E',
    children: [
      {
        to: '/admin/upload/profile',
        label: 'Profile Upload',
        icon: IoPeopleOutline,
        color: '#22C55E',
      },
      {
        to: '/admin/upload/result',
        label: 'Result Upload',
        icon: HiOutlineDocumentReport,
        color: '#22C55E',
      },
      {
        to: '/admin/upload/review',
        label: 'Review Upload',
        icon: TbReportAnalytics,
        color: '#22C55E',
      },
    ],
  },
];

export const hodNavigationLinks = [
  {
    to: '/hod/dashboard',
    label: 'Dashboard',
    icon: IoHomeOutline,
    color: '#6777F1',
  },
  {
    to: '/hod/results',
    label: 'Results',
    icon: HiOutlineDocumentReport,
    color: '#22C55E',
    children: [
      {
        to: '/hod/results?status=all',
        label: 'All Results',
        icon: IoListOutline,
        color: '#6B7280',
      },
      {
        to: '/hod/results?status=passed',
        label: 'Passed',
        icon: IoCheckmarkCircleOutline,
        color: '#10B981',
      },
      {
        to: '/hod/results?status=failed',
        label: 'Failed',
        icon: IoCloseCircleOutline,
        color: '#EF4444',
      },
    ],
  },
  {
    to: '/hod/students',
    label: 'Students',
    icon: IoPeopleOutline,
    color: '#8B5CF6',
  },
  {
    to: '/hod/subjects',
    label: 'Subjects',
    icon: MdOutlineMenuBook,
    color: '#F59E0B',
  },
  {
    to: '/hod/analytics',
    label: 'Analytics',
    icon: TbChartBar,
    color: '#0EA5E9',
  },
  {
    to: '/hod/rankings',
    label: 'Rankings',
    icon: IoTrophyOutline,
    color: '#EAB308',
  },
  {
    to: '/hod/reports',
    label: 'Reports',
    icon: TbReportAnalytics,
    color: '#6366F1',
  },
  {
    to: '/hod/settings',
    label: 'Settings',
    icon: IoSettingsOutline,
    color: '#f97316',
  },
];

export const studentNavigationLinks = [
  {
    to: '/student/dashboard',
    label: 'Dashboard',
    icon: IoHomeOutline,
    color: '#6777F1',
  },
  {
    to: '/student/profile',
    label: 'My Profile',
    icon: IoPersonOutline,
    color: '#8B5CF6',
  },
  {
    to: '/student/semester',
    label: 'Semester',
    icon: MdOutlineSchool,
    color: '#F59E0B',
    children: [
      {
        to: '/student/semester?sem=1',
        label: 'Semester 1',
        icon: IoListOutline,
        color: '#6B7280',
      },
      {
        to: '/student/semester?sem=2',
        label: 'Semester 2',
        icon: IoListOutline,
        color: '#6B7280',
      },
      {
        to: '/student/semester?sem=3',
        label: 'Semester 3',
        icon: IoListOutline,
        color: '#6B7280',
      },
      {
        to: '/student/semester?sem=4',
        label: 'Semester 4',
        icon: IoListOutline,
        color: '#6B7280',
      },
      {
        to: '/student/semester?sem=5',
        label: 'Semester 5',
        icon: IoListOutline,
        color: '#6B7280',
      },
    ],
  },
  {
    to: '/student/results',
    label: 'Results',
    icon: HiOutlineDocumentReport,
    color: '#22C55E',
  },
  {
    to: '/student/subjects',
    label: 'Subjects',
    icon: MdOutlineMenuBook,
    color: '#0EA5E9',
  },
  {
    to: '/student/rankings',
    label: 'Rankings',
    icon: IoTrophyOutline,
    color: '#EAB308',
  },
  {
    to: '/student/settings',
    label: 'Settings',
    icon: IoSettingsOutline,
    color: '#f97316',
  },
];
