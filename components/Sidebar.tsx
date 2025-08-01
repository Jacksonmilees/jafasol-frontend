import React from 'react';
import { Page, User } from '../types';
import { NAV_ITEMS } from '../constants';
import {
  LogoIcon,
  DashboardIcon,
  UsersIcon,
  GraduationCapIcon,
  ChalkboardTeacherIcon,
  BookOpenIcon,
  ExamsIcon,
  FeesIcon,
  ReportsIcon,
  SettingsIcon,
  AttendanceIcon,
  TimetableIcon,
  CommunicationIcon,
  LibraryIcon,
  TransportIcon,
  DocumentStoreIcon,
  BookMarkedIcon,
  ShieldCheckIcon,
  HistoryIcon,
} from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Create a dedicated component for rendering the icon
const SidebarIcon: React.FC<{ page: Page }> = ({ page }) => {
  const iconProps = { className: "h-5 w-5 mr-3" };
  switch (page) {
    case Page.Dashboard: return <DashboardIcon {...iconProps} />;
    case Page.UserManagement: return <ShieldCheckIcon {...iconProps} />;
    case Page.AuditLogs: return <HistoryIcon {...iconProps} />;
    case Page.Students: return <GraduationCapIcon {...iconProps} />;
    case Page.Teachers: return <ChalkboardTeacherIcon {...iconProps} />;
    case Page.Academics: return <BookOpenIcon {...iconProps} />;
    case Page.Exams: return <ExamsIcon {...iconProps} />;
    case Page.Fees: return <FeesIcon {...iconProps} />;
    case Page.Reports: return <ReportsIcon {...iconProps} />;
    case Page.Attendance: return <AttendanceIcon {...iconProps} />;
    case Page.Timetable: return <TimetableIcon {...iconProps} />;
    case Page.Communication: return <CommunicationIcon {...iconProps} />;
    case Page.Library: return <LibraryIcon {...iconProps} />;
    case Page.LearningResources: return <BookMarkedIcon {...iconProps} />;
    case Page.Transport: return <TransportIcon {...iconProps} />;
    case Page.DocumentStore: return <DocumentStoreIcon {...iconProps} />;
    default: return null;
  }
};


const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, currentUser, isOpen, setIsOpen }) => {
  const accessibleNavItems = NAV_ITEMS.filter(item =>
    currentUser.role.permissions[item.id]?.view
  );

  const handleLinkClick = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false);
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div
          className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity non-printable ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
      ></div>
      <aside className={`w-64 flex-shrink-0 bg-gray-900 text-gray-300 flex flex-col fixed inset-y-0 left-0 z-40 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out non-printable ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <LogoIcon className="h-8 w-8 text-teal-400" />
          <span className="ml-3 text-lg font-semibold text-white">JafaSol</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {accessibleNavItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <a
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'hover:bg-gray-700 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <SidebarIcon page={item.id} />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <a
              href="#"
              onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(Page.Settings);
              }}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentPage === Page.Settings
                  ? 'bg-teal-600 text-white'
                  : 'hover:bg-gray-700 hover:text-white'
              }`}
          >
              <SettingsIcon className="h-5 w-5 mr-3" />
              Settings
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;