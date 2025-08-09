import React from 'react';
import { Page } from '../types';
import {
  DashboardIcon,
  GraduationCapIcon,
  ChalkboardTeacherIcon,
  BookOpenIcon,
  AttendanceIcon,
  TimetableIcon,
  ExamsIcon,
  FeesIcon,
  CommunicationIcon,
  LibraryIcon,
  TransportIcon,
  DocumentStoreIcon,
  BookMarkedIcon,
  ReportsIcon,
  SettingsIcon,
  ShieldCheckIcon,
  HistoryIcon,
} from './icons';

interface MobileNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  accessiblePages: Page[];
}

const MobileNav: React.FC<MobileNavProps> = ({ currentPage, setCurrentPage, accessiblePages }) => {
  // Define all pages for mobile navigation
  const mobileNavItems = [
    { page: Page.Dashboard, icon: DashboardIcon, label: 'Dashboard' },
    { page: Page.Students, icon: GraduationCapIcon, label: 'Students' },
    { page: Page.Teachers, icon: ChalkboardTeacherIcon, label: 'Teachers' },
    { page: Page.Academics, icon: BookOpenIcon, label: 'Academics' },
    { page: Page.Attendance, icon: AttendanceIcon, label: 'Attendance' },
    { page: Page.Timetable, icon: TimetableIcon, label: 'Timetable' },
    { page: Page.Exams, icon: ExamsIcon, label: 'Exams' },
    { page: Page.Fees, icon: FeesIcon, label: 'Fees' },
    { page: Page.Communication, icon: CommunicationIcon, label: 'Messages' },
    { page: Page.Library, icon: LibraryIcon, label: 'Library' },
    { page: Page.Transport, icon: TransportIcon, label: 'Transport' },
    { page: Page.DocumentStore, icon: DocumentStoreIcon, label: 'Documents' },
    { page: Page.LearningResources, icon: BookMarkedIcon, label: 'Resources' },
    { page: Page.Reports, icon: ReportsIcon, label: 'Reports' },
    { page: Page.UserManagement, icon: ShieldCheckIcon, label: 'Users' },
    { page: Page.AuditLogs, icon: HistoryIcon, label: 'Logs' },
    { page: Page.Settings, icon: SettingsIcon, label: 'Settings' },
  ];

  // Filter to only show accessible pages
  const availableItems = mobileNavItems.filter(item => 
    accessiblePages.includes(item.page)
  );

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-start px-2 py-2 overflow-x-auto scrollbar-hide">
        {availableItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={`flex flex-col items-center justify-center min-w-16 py-2 px-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? 'text-teal-600 bg-teal-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <IconComponent className={`h-5 w-5 mb-1 ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
              <span className="text-xs font-medium truncate max-w-14 text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav; 