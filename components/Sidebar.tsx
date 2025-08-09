import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Page, User } from '../types';
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
  XMarkIcon,
} from './icons';

// Module name mapping: Backend module names -> Frontend Page enum values
const MODULE_NAME_MAPPING: { [key: string]: string } = {
  'analytics': 'Dashboard',
  'studentManagement': 'Students',
  'teacherManagement': 'Teachers',
  'timetable': 'Timetable',
  'fees': 'Fees',
  'exams': 'Exams',
  'communication': 'Communication',
  'attendance': 'Attendance',
  'library': 'Library',
  'transport': 'Transport',
  'academics': 'Academics',
  'learningResources': 'Learning Resources',
  'documents': 'Documents',
  'reports': 'Reports',
  'userManagement': 'User Management',
  'auditLogs': 'Audit Logs'
};

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SidebarIcon: React.FC<{ page: Page }> = ({ page }) => {
  const iconProps = { className: "h-5 w-5 mr-3 flex-shrink-0" };
  
  switch (page) {
    case Page.Dashboard: return <DashboardIcon {...iconProps} />;
    case Page.UserManagement: return <ShieldCheckIcon {...iconProps} />;
    case Page.AuditLogs: return <HistoryIcon {...iconProps} />;
    case Page.Students: return <GraduationCapIcon {...iconProps} />;
    case Page.Teachers: return <ChalkboardTeacherIcon {...iconProps} />;
    case Page.Academics: return <BookOpenIcon {...iconProps} />;
    case Page.Attendance: return <AttendanceIcon {...iconProps} />;
    case Page.Timetable: return <TimetableIcon {...iconProps} />;
    case Page.Exams: return <ExamsIcon {...iconProps} />;
    case Page.Fees: return <FeesIcon {...iconProps} />;
    case Page.Communication: return <CommunicationIcon {...iconProps} />;
    case Page.Library: return <LibraryIcon {...iconProps} />;
    case Page.LearningResources: return <BookMarkedIcon {...iconProps} />;
    case Page.Transport: return <TransportIcon {...iconProps} />;
    case Page.DocumentStore: return <DocumentStoreIcon {...iconProps} />;
    case Page.Reports: return <ReportsIcon {...iconProps} />;
    default: return null;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, currentUser, isOpen, setIsOpen }) => {
  // Get school modules from user data or fetch from API
  const schoolModules = currentUser?.modules || [];
  
  // Debug logging
  console.log('Sidebar Debug:', {
    currentUser: currentUser?.email,
    role: currentUser?.role,
    modules: schoolModules,
    totalModules: schoolModules.length
  });
  
  // Filter nav items based on school modules and user role
  const accessibleNavItems = NAV_ITEMS.filter(item => {
    // Map backend module names to frontend Page enum values
    const mappedModules = schoolModules.map(module => MODULE_NAME_MAPPING[module] || module);
    
    // For school users, check if the module is enabled for their school
    const isModuleEnabled = mappedModules.includes(item.id);
    
    // For admin users, show all modules
    const isAdmin = currentUser?.role?.name === 'Admin' || (typeof currentUser?.role === 'string' && currentUser.role === 'Admin');
    
    // Show item if it's enabled for the school OR if user is admin
    const shouldShow = isModuleEnabled || isAdmin;
    
    console.log(`Module ${item.id}: enabled=${isModuleEnabled}, admin=${isAdmin}, show=${shouldShow}`);
    
    return shouldShow;
  });

  const handleLinkClick = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false);
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center">
            <img src="/assets/images/logo.png" alt="School Logo" className="h-8 w-8" />
            <span className="ml-3 text-lg font-bold text-white">
              {(() => {
                const hostname = window.location.hostname;
                if (hostname.includes('.jafasol.com') && !hostname.startsWith('www.') && !hostname.startsWith('admin.')) {
                  const subdomain = hostname.split('.')[0];
                  return subdomain.charAt(0).toUpperCase() + subdomain.slice(1) + ' School';
                }
                return 'JafaSol';
              })()}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {currentUser?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser?.name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {currentUser?.role?.name || 'Unknown Role'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation items with scrolling */}
          <div className="flex-1 overflow-y-auto">
            <nav className="py-4">
              <div className="px-4 space-y-1">
                {accessibleNavItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/25'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <SidebarIcon page={item.id} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Settings at bottom */}
          <div className="px-4 py-4 border-t border-gray-700 bg-gray-800">
            <button
              onClick={() => handleLinkClick(Page.Settings)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                currentPage === Page.Settings
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/25'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <SettingsIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="truncate">Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;