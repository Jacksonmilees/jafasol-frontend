import React, { useState, useEffect } from 'react';
import { Page, User, Student, Role, AuditLog } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'register' | '2fa' | '2fa-setup'>('login');
  const [userFor2FA, setUserFor2FA] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for real data from API
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from API when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadDataFromAPI();
    }
  }, [currentUser]);

  const loadDataFromAPI = async () => {
    setIsLoading(true);
    try {
      // Load users
      const usersResponse = await apiClient.getUsers();
      setUsers(usersResponse.users || []);

      // Load students
      const studentsResponse = await apiClient.getStudents();
      setStudents(studentsResponse.students || []);

      // Load audit logs
      const auditResponse = await apiClient.getAuditLogs();
      setAuditLogs(auditResponse.logs || []);

      // Load roles (if available)
      // Note: Roles might be loaded differently based on your API structure
      setRoles([]); // Will be populated when API endpoint is available

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
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      apiClient.clearToken();
      setCurrentUser(null);
      setUserFor2FA(null);
      setAuthScreen('login');
      setCurrentPage(Page.Dashboard);
    }
  };
  
  const handleRegisterSuccess = () => {
    setAuthScreen('login');
  };

  const handleCredentialsSuccess = (user: User) => {
    addAuditLog(user, 'Login Success', { type: 'Auth', name: user.email }, `IP: 192.168.1.${Math.floor(Math.random() * 254) + 1}`);
    if (user.role.name === 'Admin' && user.twoFactorEnabled) {
      setUserFor2FA(user);
      setAuthScreen('2fa');
    } else if (user.role.name === 'Admin' && !user.twoFactorEnabled) {
      setUserFor2FA(user);
      setAuthScreen('2fa-setup');
    } else {
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
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          user={currentUser}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            user={currentUser}
            onLogout={handleLogout}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
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
                        totalTeachers: users.filter(u => u.role.name === 'Teacher').length,
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
                      teachers={users.filter(u => u.role.name === 'Teacher')}
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
        </div>
      </div>
    );
  };

  return renderContent();
};

export default App;