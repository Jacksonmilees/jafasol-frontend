import React, { useState, useEffect } from 'react';
import { Page, User, Student, Role, AuditLog } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import { NAV_ITEMS } from './constants';

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

import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import UserManagement from './components/UserManagement';
import TeacherManagement from './components/TeacherManagement';
import Academics from './components/Academics';
import Exams from './components/Exams';
import Fees from './components/Fees';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Attendance from './components/Attendance';
import Timetable from './components/Timetable';
import Communication from './components/Communication';
import Library from './components/Library';
import Transport from './components/Transport';
import DocumentStore from './components/DocumentStore';
import LearningResources from './components/LearningResources';
import ParentStudentPortal from './components/portal/ParentStudentPortal';
import Login from './components/Login';
import { Register } from './components/Register';
import AuditLogs from './components/AuditLogs';
import TwoFactorSetup from './components/security/TwoFactorSetup';
import TwoFactorVerification from './components/security/TwoFactorVerification';
import apiClient from './api';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'register' | '2fa' | '2fa-setup'>('login');
  const [userFor2FA, setUserFor2FA] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Add loading state for auth check
  
  // State for real data from API
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Restore authentication state on app initialization
  useEffect(() => {
    const restoreAuthState = async () => {
      try {
        // Check if we have saved user data and token
        if (apiClient.isAuthenticated()) {
          const savedUser = apiClient.getSavedUserData();
          if (savedUser) {
            console.log('🔄 Restoring authentication state...');
            setCurrentUser(savedUser);
            console.log('✅ Authentication state restored for:', savedUser.email);
          } else {
            // Token exists but no user data, clear everything
            console.log('⚠️ Token found but no user data, clearing session');
            apiClient.clearToken();
          }
        }
      } catch (error) {
        console.error('❌ Error restoring auth state:', error);
        // Clear potentially corrupted data
        apiClient.clearToken();
      } finally {
        setIsAuthChecking(false);
      }
    };

    restoreAuthState();
  }, []);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // PWA Install Prompt Effect
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is already installed');
        return;
      }
      
      // Show install prompt after a delay if not installed
      setTimeout(() => {
        if (!deferredPrompt) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };
    
    checkIfInstalled();
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      // Fallback for manual installation
      if (navigator.userAgent.includes('Android')) {
        // Android instructions
        alert('To install this app:\n1. Tap the menu button (⋮)\n2. Select "Add to Home screen"\n3. Tap "Add"');
      } else if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        // iOS instructions
        alert('To install this app:\n1. Tap the Share button (□↑)\n2. Select "Add to Home Screen"\n3. Tap "Add"');
      } else {
        // Desktop instructions
        alert('To install this app:\n1. Look for the install icon in your browser address bar\n2. Click "Install" or "Add to Desktop"');
      }
      setShowInstallPrompt(false);
    }
  };

  // Load data from API when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadDataFromAPI();
    }
  }, [currentUser]);

  const loadDataFromAPI = async () => {
    setIsLoading(true);
    try {
      console.log('Loading data from API...');
      
      // Load user modules and permissions
      if (currentUser) {
        try {
          // For now, set default modules for admin users
          // In the future, this should come from the backend
          const defaultModules = [
            'Dashboard', 'Students', 'Teachers', 'Academics', 
            'Attendance', 'Timetable', 'Exams', 'Fees', 
            'Communication', 'Library', 'Learning Resources', 
            'Transport', 'Documents', 'Reports'
          ];
          setCurrentUser(prev => prev ? { ...prev, modules: defaultModules } : null);
        } catch (error) {
          console.error('Failed to load user modules:', error);
        }
      }
      
      // Load other data as needed
      setUsers([]);
      setStudents([]);
      setAuditLogs([]);
      setRoles([]);
      
      console.log('Data loading completed');
    } catch (error) {
      console.error('Failed to load data from API:', error);
      // Fallback to empty arrays if API fails
      setUsers([]);
      setStudents([]);
      setAuditLogs([]);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addAuditLog = async (user: User | null, action: AuditLog['action'], target: AuditLog['target'], details: string) => {
    const newLog: AuditLog = {
      id: `LOG${Date.now()}`,
      userId: user?.id,
      userName: user?.name,
      action,
      target,
      timestamp: new Date().toISOString(),
      details,
    };
    
    setAuditLogs(prev => [newLog, ...prev]);
    
    // In a real app, you'd also send this to the API
    try {
      // await apiClient.createAuditLog(newLog);
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  };

  const handleLogout = async () => {
    console.log('🚪 Logging out user...');
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear authentication data from API client and localStorage
      apiClient.clearToken();
      setCurrentUser(null);
      setCurrentPage(Page.Dashboard);
      setUserFor2FA(null);
      setAuthScreen('login');
      console.log('✅ User logged out successfully');
    }
  };
  
  const handleRegisterSuccess = () => {
    setAuthScreen('login');
  };

  const handleCredentialsSuccess = (user: User) => {
    console.log('Login successful, user data:', user);
    addAuditLog(user, 'Login Success', { type: 'Auth', name: user.email }, `IP: 192.168.1.${Math.floor(Math.random() * 254) + 1}`);
    
    // Check if user is admin (role is an object)
    const isAdmin = user.role.name === 'Admin';
    
    console.log('User role:', user.role, 'Is admin:', isAdmin);
    
    if (isAdmin && user.twoFactorEnabled) {
      setUserFor2FA(user);
      setAuthScreen('2fa');
    } else if (isAdmin && !user.twoFactorEnabled) {
      setUserFor2FA(user);
      setAuthScreen('2fa-setup');
    } else {
      console.log('Setting current user:', user);
      setCurrentUser(user);
    }
  };

  const handleLoginFailure = (email: string) => {
    addAuditLog(null, 'Login Failure', { type: 'Auth', name: email }, `IP: 192.168.1.${Math.floor(Math.random() * 254) + 1}`);
  };

  const handle2FASuccess = () => {
    if(userFor2FA) {
      setCurrentUser(userFor2FA);
      setUserFor2FA(null);
      setAuthScreen('login');
    }
  }

  const handle2FASetupSuccess = () => {
    if(userFor2FA) {
      const userWith2FA = { ...userFor2FA, twoFactorEnabled: true };
      setCurrentUser(userWith2FA);
      setUserFor2FA(null);
      setAuthScreen('login');
    }
  }

  const handleAuthCancel = () => {
    setUserFor2FA(null);
    setAuthScreen('login');
  };

  const renderContent = () => {
    // Show loading spinner while checking authentication
    if (isAuthChecking) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );
    }

    if (!currentUser) {
      switch (authScreen) {
        case 'login':
          return (
            <Login
              onCredentialsSuccess={handleCredentialsSuccess}
              onFailure={handleLoginFailure}
              onSwitchToRegister={() => setAuthScreen('register')}
            />
          );
        case 'register':
          return (
            <Register
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setAuthScreen('login')}
            />
          );
        case '2fa':
          return (
            <TwoFactorVerification
              user={userFor2FA!}
              onSuccess={handle2FASuccess}
              onCancel={handleAuthCancel}
            />
          );
        case '2fa-setup':
          return (
            <TwoFactorSetup
              user={userFor2FA!}
              onSuccess={handle2FASetupSuccess}
              onCancel={handleAuthCancel}
            />
          );
        default:
          return (
            <Login
              onCredentialsSuccess={handleCredentialsSuccess}
              onFailure={handleLoginFailure}
              onSwitchToRegister={() => setAuthScreen('register')}
            />
          );
      }
    }

    // Main application content
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          currentUser={currentUser}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header
            user={currentUser}
            onLogout={handleLogout}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onInstallApp={handleInstallClick}
            showInstallButton={showInstallPrompt}
          />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
                </div>
              ) : (
                <>
                  {currentPage === Page.Dashboard && (
                    <Dashboard
                      user={currentUser}
                      stats={{
                        totalStudents: students.length,
                        totalTeachers: users.filter(u => u.role === 'Teacher').length,
                        totalClasses: 12,
                        totalRevenue: 450000
                      }}
                    />
                  )}
                  {currentPage === Page.UserManagement && (
                    <UserManagement
                      users={users}
                      setUsers={setUsers}
                      roles={roles}
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.AuditLogs && (
                    <AuditLogs
                      logs={auditLogs}
                      currentUser={currentUser}
                    />
                  )}
                  {currentPage === Page.Students && (
                    <StudentManagement
                      students={students}
                      setStudents={setStudents}
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.Teachers && (
                    <TeacherManagement
                      teachers={users.filter(u => u.role === 'Teacher')}
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.Academics && (
                    <Academics
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.Attendance && (
                    <Attendance
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                          {currentPage === Page.Timetable && (
          <Timetable
            currentUser={currentUser}
            addAuditLog={addAuditLog}
          />
        )}
        {currentPage === Page.Settings && (
          <Settings
            currentUser={currentUser}
            addAuditLog={addAuditLog}
          />
        )}
                  {currentPage === Page.Exams && (
                    <Exams
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.Fees && (
                    <Fees
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.Communication && (
                    <Communication
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.Library && (
                    <Library
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.LearningResources && (
                    <LearningResources
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.Transport && (
                    <Transport
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.DocumentStore && (
                    <DocumentStore
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.Reports && (
                    <Reports
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.Settings && (
                    <Settings
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                  {currentPage === Page.ParentStudentPortal && (
                    <ParentStudentPortal
                      currentUser={currentUser}
                      addAuditLog={addAuditLog}
                    />
                  )}
                </>
              )}
            </div>
          </main>
          
          {/* Mobile Navigation */}
          <MobileNav
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            accessiblePages={NAV_ITEMS.filter(item => {
              const schoolModules = currentUser?.modules || [];
              const mappedModules = schoolModules?.map(module => MODULE_NAME_MAPPING[module] || module) || [];
              const isModuleEnabled = mappedModules.includes(item.id);
              const isAdmin = currentUser?.role?.name === 'Admin';
              return isModuleEnabled || isAdmin;
            }).map(item => item.id)}
          />
        </div>
        
        {/* PWA Install Prompt */}
        {showInstallPrompt && (
          <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Install Jafasol</h3>
                  <p className="text-xs text-gray-500">Add to home screen for quick access</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Not now
                </button>
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return renderContent();
};

export default App;